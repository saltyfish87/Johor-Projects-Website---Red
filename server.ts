import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { projectsData } from "./src/data/projects-data";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory caching for Google Sheet data
let projectsCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds cache for fast updates during development/editing

// Robust CSV parser function
function parseCSV(text: string) {
  const result: any[] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      if (row.length > 1 || row[0] !== "") {
        result.push(row);
      }
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  if (currentVal !== "" || row.length > 0) {
    row.push(currentVal.trim());
    result.push(row);
  }
  return result;
}

// Helper to convert any Google Drive URL to optimized WebP format
function convertToWebpUrl(url: string | any, category?: string): string | any {
  if (typeof url !== "string") return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  let fileId = "";
  
  // Extract fileId if it's drive.google.com link
  if (trimmed.includes("drive.google.com")) {
    const dMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    } else if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  } else if (trimmed.includes("lh3.googleusercontent.com/d/")) {
    // Extract fileId from direct link
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }
  }

  if (fileId) {
    const isFloorplan = category === "floorplan_images" || 
                        trimmed.toLowerCase().includes("floorplan") || 
                        trimmed.toLowerCase().includes("plan") || 
                        trimmed.toLowerCase().includes("layout") || 
                        trimmed.toLowerCase().includes("type") || 
                        trimmed.toLowerCase().includes("floor") ||
                        trimmed.toLowerCase().includes("pelan");
    const hashIndex = trimmed.indexOf('#');
    const hash = hashIndex !== -1 ? trimmed.substring(hashIndex) : "";
    return `https://lh3.googleusercontent.com/d/${fileId}${isFloorplan ? "=s0-rw" : "=w1600-rw"}${hash}`;
  }

  return trimmed;
}

// Convert all values in a mapping object to optimized WebP
function optimizeMappingToWebp(mapping: any): any {
  if (!mapping || typeof mapping !== "object") return mapping;
  const optimized = { ...mapping };
  
  for (const key of Object.keys(optimized)) {
    const val = optimized[key];
    if (Array.isArray(val)) {
      optimized[key] = val.map(u => convertToWebpUrl(u, key));
    } else if (typeof val === "string") {
      optimized[key] = convertToWebpUrl(val, key);
    }
  }
  return optimized;
}

// Path for mapped images storage
const MAPPED_IMAGES_PATH = path.join(process.cwd(), "mapped-images.json");

// Read saved mapped images
function getSavedMappedImages(): Record<string, any> {
  try {
    if (fs.existsSync(MAPPED_IMAGES_PATH)) {
      const content = fs.readFileSync(MAPPED_IMAGES_PATH, "utf8");
      const rawMappings = JSON.parse(content);
      
      // Optimize all loaded mappings to ensure they utilize high-performance WebP URLs
      const optimized: Record<string, any> = {};
      for (const slug of Object.keys(rawMappings)) {
        optimized[slug] = optimizeMappingToWebp(rawMappings[slug]);
      }
      return optimized;
    }
  } catch (err) {
    console.error("Error reading mapped-images.json:", err);
  }
  return {};
}

// Save mapped images
function saveMappedImages(mapping: Record<string, any>) {
  try {
    const optimized: Record<string, any> = {};
    for (const slug of Object.keys(mapping)) {
      optimized[slug] = optimizeMappingToWebp(mapping[slug]);
    }
    fs.writeFileSync(MAPPED_IMAGES_PATH, JSON.stringify(optimized, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing mapped-images.json:", err);
  }
}

// Reconstruct and update the mapped-images.json file physically with WebP format on server startup
try {
  if (fs.existsSync(MAPPED_IMAGES_PATH)) {
    const content = fs.readFileSync(MAPPED_IMAGES_PATH, "utf8");
    const rawMappings = JSON.parse(content);
    const optimized: Record<string, any> = {};
    for (const slug of Object.keys(rawMappings)) {
      optimized[slug] = optimizeMappingToWebp(rawMappings[slug]);
    }
    fs.writeFileSync(MAPPED_IMAGES_PATH, JSON.stringify(optimized, null, 2), "utf8");
    console.log("[Drive Sync] Reconstructed mapped-images.json physically with high-performance WebP links.");
  }
} catch (err) {
  console.error("Failed to reconstruct mapped-images.json:", err);
}

// Fetch live projects from Google Sheets with local fallback
async function getProjects() {
  const now = Date.now();
  const savedMappings = getSavedMappedImages();

  if (projectsCache.length > 0 && (now - cacheTimestamp < CACHE_TTL)) {
    // If cache is valid, return cached version merged with latest saved mappings
    return projectsCache.map(proj => {
      const mapping = savedMappings[proj.slug];
      return mapping ? { ...proj, ...mapping } : proj;
    });
  }

  try {
    const res = await fetch('https://docs.google.com/spreadsheets/d/1_oL3NH6_trjZQnYnG9pjDnyJ7funxP1uSKehM5Ktv3Q/export?format=csv');
    if (!res.ok) throw new Error("Failed to fetch Google Sheet");
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2) throw new Error("Invalid CSV format");

    const headers = rows[0];
    const projects: any[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < headers.length) {
        while (row.length < headers.length) {
          row.push("");
        }
      }
      const project: any = {};
      headers.forEach((header, index) => {
        project[header] = row[index] || "";
      });
      const slug = (project.project_name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      project.slug = slug;
      projects.push(project);
    }

    // Merge Google Sheet with saved Google Drive image mapping
    const merged = projects.map(proj => {
      const mapping = savedMappings[proj.slug];
      return mapping ? { ...proj, ...mapping } : proj;
    });

    projectsCache = merged;
    cacheTimestamp = now;
    console.log(`Live Google Sheets data synchronized successfully at ${new Date().toISOString()} (${merged.length} projects).`);
    return merged;
  } catch (err) {
    console.warn("Using local projects data fallback due to fetch error:", err);
    // Merge fallback local data with saved mappings
    return projectsData.map((proj: any) => {
      const mapping = savedMappings[proj.slug];
      return mapping ? { ...proj, ...mapping } : proj;
    });
  }
}

// Lazy Gemini API Initializer
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or is using a placeholder. Gemini client not initialized.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Endpoints

// 1. Fetch Johor Bahru Projects
app.get("/api/projects", async (req, res) => {
  try {
    const data = await getProjects();
    res.json({ success: true, projects: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to save Google Drive mapped images permanently
app.post("/api/projects/map-images", (req, res) => {
  try {
    const { mappings } = req.body;
    if (!mappings || typeof mappings !== "object") {
      return res.status(400).json({ success: false, error: "Mappings object is required." });
    }

    const existing = getSavedMappedImages();
    const updated = { ...existing, ...mappings };
    saveMappedImages(updated);

    // Clear cache to force reload next time
    projectsCache = [];
    cacheTimestamp = 0;

    res.json({ success: true, message: "Drive image mappings saved successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Lead Enquiries Store in Memory & Log
const enquiries: any[] = [];
app.post("/api/enquiry", async (req, res) => {
  try {
    const { name, email, phone, projectSlug, projectName, message, budget, targetType } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required fields." });
    }

    const newEnquiry = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone: phone || "",
      projectSlug: projectSlug || "",
      projectName: projectName || "General Enquiry",
      message: message || "",
      budget: budget || "",
      targetType: targetType || "Malaysian Buyer",
      createdAt: new Date().toISOString()
    };

    enquiries.push(newEnquiry);
    console.log("🌟 NEW LEAD ACQUIRED FOR SHYAN YEE:", newEnquiry);

    // Forward to FormSubmit using Fetch
    try {
      const formSubmitUrl = "https://formsubmit.co/ajax/shyanyeews@gmail.com";
      const payload = {
        name: newEnquiry.name,
        email: newEnquiry.email,
        phone: newEnquiry.phone,
        project_name: newEnquiry.projectName,
        project_slug: newEnquiry.projectSlug,
        budget: newEnquiry.budget,
        buyer_type: newEnquiry.targetType,
        message: newEnquiry.message,
        _subject: `New Lead Registered for ${newEnquiry.projectName} - ${newEnquiry.name}`,
        _template: "table",
        _captcha: "false",
        _honey: ""
      };

      const response = await fetch(formSubmitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("✅ Successfully forwarded lead to FormSubmit (shyanyeews@gmail.com)");
      } else {
        const errorText = await response.text();
        console.warn("⚠️ FormSubmit returned non-OK status:", response.status, errorText);
      }
    } catch (fsError) {
      console.error("❌ Error sending to FormSubmit:", fsError);
    }

    res.json({ 
      success: true, 
      message: "Your enquiry has been successfully logged! Agent Shyan Yee has been notified.",
      enquiryId: newEnquiry.id
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin endpoint to view list of leads
app.get("/api/enquiries", (req, res) => {
  res.json({ success: true, enquiries });
});

// 3. Gemini-powered Investment Advisor / Insights Generator
app.post("/api/gemini/insights", async (req, res) => {
  try {
    const { prompt, project, buyerType } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a smart deterministic fallback if Gemini API is not configured or offline
      let fallbackText = `### Johor Bahru Market Analyst Verdict (Local Fallback)\n\n`;
      if (project) {
        fallbackText += `For **${project.project_name}** in the high-growth **${project.area}** district:\n\n`;
        fallbackText += `- **Location Strength**: Located in **${project.area}**, this project offers supreme advantages. `;
        if (project.transportation && project.transportation.toLowerCase().includes("rts")) {
          fallbackText += `The direct proximity to the **Bukit Chagar RTS Link** makes it a stellar choice for Singapore commuters, saving hours of daily travel.\n`;
        } else {
          fallbackText += `Excellent highway connectivity offers seamless access to key commercial centers.\n`;
        }
        
        fallbackText += `- **Value Analysis**: At **${project.price_psf}**, this represents a competitive price point for a **${project.tenure}** tenure development. `;
        if (project.project_type.toLowerCase().includes("airbnb") || project.key_features.toLowerCase().includes("airbnb")) {
          fallbackText += `Its Airbnb-friendly zoning indicates strong potential for short-term rental yields targeting weekend leisure travelers and business consultants.\n`;
        } else {
          fallbackText += `Its residential zoning ensures high-quality living standards with peaceful surroundings suitable for owner-occupiers.\n`;
        }
        
        fallbackText += `- **Affordability Outlook**: With prices starting from **${project.price_min}**, our structural amortization estimates indicate a manageable entry tier for **${buyerType || 'cross-border investors'}** seeking Southern Corridor exposure.\n\n`;
        fallbackText += `*Please check your Secrets Panel to configure GEMINI_API_KEY for full conversational AI evaluation.*`;
      } else {
        fallbackText += `Johor Bahru's real estate market is currently experiencing unprecedented tailwinds driven by the RTS Link connection to Singapore, the Johor-Singapore Special Economic Zone (JS-SEZ), and friendly cross-border policies. Investors can expect high capital appreciation around Transit-Oriented Developments (TOD) near Bukit Chagar, while family own-stay buyers can find premium value in tranquil suburban precincts like Mount Austin.\n\n*Please check your Secrets Panel to configure GEMINI_API_KEY for full conversational AI evaluation.*`;
      }
      return res.json({ success: true, text: fallbackText });
    }

    const systemInstruction = `You are Shyan Yee's Elite Real Estate AI Advisor, an expert market analyst for Johor Bahru (JB) property. 
Analyze real estate queries with high professional rigor. Provide specific metrics, distance estimates, and rental yield assumptions. 
Compare project attributes (like Price PSF, tenure, lift/units ratio, and layouts) to offer objective pros/cons.
Maintain a premium, luxury branding tone (inspired by Sotheby's Realty and EdgeProp). 
Format responses in clear, elegant Markdown with headings and bullet points. Never fabricate numbers. If certain data points are missing, note that details are pending verification.`;

    let contentPrompt = prompt;
    if (project) {
      contentPrompt = `Review and analyze this project:
Project Name: ${project.project_name}
Developer: ${project.developer}
Area: ${project.area}
Address: ${project.address}
Type: ${project.project_type}
Tenure: ${project.tenure}
Land Title: ${project.land_title}
Price: ${project.price_min} to ${project.price_max} (${project.price_psf})
Total Units: ${project.total_units} across ${project.total_floors} floors (Units per floor: ${project.units_per_floor}, Lifts: ${project.lift_per_floor})
Built up: ${project.built_up_min} to ${project.built_up_max} sqft
Layouts: ${project.layouts}
Key Features: ${project.key_features}
Transportation: ${project.transportation}
Education: ${project.education}
Shopping: ${project.shopping}
Hospital: ${project.hospital}
Buyer Type: ${buyerType || "General Investor"}

User Query: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Johor Bahru Premium Portal Server running on http://localhost:${PORT}`);
  });
}

start();
