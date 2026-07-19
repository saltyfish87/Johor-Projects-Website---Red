import React, { useState } from "react";
import { ArrowLeft, MapPin, Sparkles, Info, ShieldCheck, ExternalLink, Eye, Layers, Image as ImageIcon } from "lucide-react";
import { Project } from "../types";
import { getDirectDriveImage, getProjectCoverImage } from "../utils";
import MortgageCalculator from "./MortgageCalculator";
import OSMMap from "./OSMMap";
import AIAssistant from "./AIAssistant";

interface ProjectDetailViewProps {
  project: Project | undefined;
  projects: Project[];
  navigateTo: (view: string) => void;
  currency: string;
  convertPriceStr: (priceStr: string, activeCur: string) => string;
  convertPsfStr: (psfStr: string, activeCur: string) => string;
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
}

export default function ProjectDetailView({
  project,
  navigateTo,
  currency,
  convertPriceStr,
  convertPsfStr,
  aiAssistantOpen,
  setAiAssistantOpen,
}: ProjectDetailViewProps) {
  if (!project) {
    return (
      <div className="text-center py-20">
        <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-800">Property Not Found</h3>
        <button onClick={() => navigateTo("projects")} className="text-blue-600 text-sm font-semibold underline mt-2">
          Back to listings
        </button>
      </div>
    );
  }

  // Lead state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadBudget, setLeadBudget] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Google Drive asset states
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  // Fallback floorplans if none mapped from Drive
  const fallbackFloorplans = [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
  ];

  // Robustly extract and consolidate floorplans from both project.floorplan_images and gallery_images
  const floorplansToUse = React.useMemo(() => {
    // If we have explicit, pre-curated floorplan images from Drive Sync, use them directly
    if (project.floorplan_images && project.floorplan_images.length > 0) {
      return project.floorplan_images;
    }

    const fromGallery = project.gallery_images || [];
    const filteredLayouts = fromGallery.filter((imgUrl) => {
      // Get URL without hash for check
      const hashIndex = imgUrl.indexOf('#');
      const urlWithoutHash = hashIndex !== -1 ? imgUrl.substring(0, hashIndex) : imgUrl;
      const urlLower = urlWithoutHash.toLowerCase();
      
      let hashName = "";
      try {
        if (hashIndex !== -1) {
          const hash = imgUrl.substring(hashIndex + 1);
          const params = new URLSearchParams(hash);
          hashName = params.get('name') ? decodeURIComponent(params.get('name')!).toLowerCase() : "";
        }
      } catch (e) {}

      const checkLayout = (name: string) => {
        return !name.includes("facilities") && (
          name.includes("type") ||
          name.includes("layout") ||
          name.includes("floor") ||
          name.includes("plan") ||
          name.includes("pelan")
        );
      };

      return checkLayout(urlLower) || (hashName && checkLayout(hashName));
    });

    return filteredLayouts.length > 0 ? filteredLayouts : fallbackFloorplans;
  }, [project.floorplan_images, project.gallery_images, fallbackFloorplans]);

  // Facilities images are images whose filename or path explicitly contains "facilities"
  const facilitiesImages = React.useMemo(() => {
    // If we have explicit pre-curated facilities images from Drive Sync, use them directly
    if (project.facilities_images && project.facilities_images.length > 0) {
      return project.facilities_images;
    }

    const combined = [
      ...(project.gallery_images || []),
      ...(project.floorplan_images || []),
      ...(project.overview_images || []),
      ...(project.location_images || []),
      project.image_url,
      project.image,
      project.img,
      project.drive_image
    ].filter(Boolean) as string[];
    
    const unique = Array.from(new Set(combined));
    return unique.filter((imgUrl) => {
      const hashIndex = imgUrl.indexOf('#');
      const urlWithoutHash = hashIndex !== -1 ? imgUrl.substring(0, hashIndex) : imgUrl;
      const urlLower = urlWithoutHash.toLowerCase();
      
      let hashName = "";
      try {
        if (hashIndex !== -1) {
          const hash = imgUrl.substring(hashIndex + 1);
          const params = new URLSearchParams(hash);
          hashName = params.get('name') ? decodeURIComponent(params.get('name')!).toLowerCase() : "";
        }
      } catch (e) {}

      const checkName = (name: string) => {
        return name.includes("facilities");
      };

      return checkName(urlLower) || (hashName && checkName(hashName));
    });
  }, [project]);

  // Visual gallery includes all images except those with 'type', 'layout', 'location', 'map', 'peta', 'facilities', 'floor', 'plan', or 'pelan' keywords
  const filteredGalleryImages = React.useMemo(() => {
    const list = project.gallery_images || [];
    return list.filter((imgUrl) => {
      const hashIndex = imgUrl.indexOf('#');
      const urlWithoutHash = hashIndex !== -1 ? imgUrl.substring(0, hashIndex) : imgUrl;
      const urlLower = urlWithoutHash.toLowerCase();
      
      let hashName = "";
      try {
        if (hashIndex !== -1) {
          const hash = imgUrl.substring(hashIndex + 1);
          const params = new URLSearchParams(hash);
          hashName = params.get('name') ? decodeURIComponent(params.get('name')!).toLowerCase() : "";
        }
      } catch (e) {}

      const isExcluded = (name: string) => {
        return name.includes("facilities") ||
               name.includes("location") ||
               name.includes("map") ||
               name.includes("peta") ||
               name.includes("type") ||
               name.includes("layout") ||
               name.includes("floor") ||
               name.includes("plan") ||
               name.includes("pelan");
      };

      return !isExcluded(urlLower) && !(hashName && isExcluded(hashName));
    });
  }, [project.gallery_images]);

  const [selectedFloorplan, setSelectedFloorplan] = useState<string | null>(null);

  // Helper to extract layout details from layout text or URL
  const getLayoutMetadata = React.useCallback((imgUrl: string, index: number) => {
    let fileName = "";
    try {
      const hashIndex = imgUrl.indexOf('#');
      if (hashIndex !== -1) {
        const hash = imgUrl.substring(hashIndex + 1);
        const params = new URLSearchParams(hash);
        const nameParam = params.get('name');
        if (nameParam) {
          fileName = decodeURIComponent(nameParam);
        }
      }
    } catch (e) {}

    let cleanFileName = "";
    if (fileName) {
      cleanFileName = fileName.replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    const parsedLayouts = project.layouts ? project.layouts.split(",").map(item => item.trim()) : [];
    let matchedLayoutText = "";

    // 1. Try to find a parsed layout item that contains/matches parts of the file name (e.g. "type a")
    if (cleanFileName) {
      const cleanFileNameLower = cleanFileName.toLowerCase();
      // Look for EXACT matches or sub-matches of Type A/B/etc
      const foundMatch = parsedLayouts.find(pl => {
        const plLower = pl.toLowerCase();
        // Look for Type X overlap
        const typeMatchInPl = plLower.match(/type\s+([a-g\d\-]+)/);
        const typeMatchInFn = cleanFileNameLower.match(/type\s+([a-g\d\-]+)/);
        
        if (typeMatchInPl && typeMatchInFn && typeMatchInPl[1] === typeMatchInFn[1]) {
          return true;
        }
        return plLower.includes(cleanFileNameLower) || cleanFileNameLower.includes(plLower);
      });
      if (foundMatch) {
        matchedLayoutText = foundMatch;
      }
    }

    // 2. If no matchedLayoutText yet, try index-based alignment
    if (!matchedLayoutText && parsedLayouts[index]) {
      matchedLayoutText = parsedLayouts[index];
    }

    // 3. Fallback to cleanFileName
    if (!matchedLayoutText && cleanFileName) {
      matchedLayoutText = cleanFileName;
    }

    // 4. Ultimate fallback
    if (!matchedLayoutText) {
      matchedLayoutText = `Layout Option ${index + 1}`;
    }

    // Extract values:
    // a. Size
    let size = "";
    const sizeMatch = matchedLayoutText.match(/(\d+(?:\s*-\s*\d+)?\s*(?:sqft|sq\s*ft|sq\.?\s*ft|sf|sqm|sq\s*m|sq\.\s*meters|square\s*feet))/i);
    if (sizeMatch) {
      size = sizeMatch[1];
    }

    // b. Room / Studio configuration
    let rooms = "";
    if (matchedLayoutText.toLowerCase().includes("studio")) {
      rooms = "Studio";
    } else {
      const roomMatch = matchedLayoutText.match(/(\d+(?:\s*\+\s*\d+)?\s*(?:bedroom|bed|room|br|bdr))/i);
      if (roomMatch) {
        rooms = roomMatch[1];
      } else {
        if (matchedLayoutText.toLowerCase().includes("dual-key") || matchedLayoutText.toLowerCase().includes("dual key")) {
          rooms = "Dual-Key Suite";
        } else if (matchedLayoutText.toLowerCase().includes("duplex")) {
          rooms = "Duplex Suite";
        } else if (matchedLayoutText.toLowerCase().includes("penthouse")) {
          rooms = "Penthouse";
        } else if (matchedLayoutText.toLowerCase().includes("1-bedroom") || matchedLayoutText.toLowerCase().includes("1 bedroom")) {
          rooms = "1-Bedroom";
        } else if (matchedLayoutText.toLowerCase().includes("2-bedroom") || matchedLayoutText.toLowerCase().includes("2 bedroom")) {
          rooms = "2-Bedroom";
        } else if (matchedLayoutText.toLowerCase().includes("3-bedroom") || matchedLayoutText.toLowerCase().includes("3 bedroom")) {
          rooms = "3-Bedroom";
        } else if (matchedLayoutText.toLowerCase().includes("4-bedroom") || matchedLayoutText.toLowerCase().includes("4 bedroom")) {
          rooms = "4-Bedroom";
        }
      }
    }

    // c. Type Name
    let type = "";
    const typeMatch = matchedLayoutText.match(/(type\s+[a-g\d\-]+)/i);
    if (typeMatch) {
      type = typeMatch[1].toUpperCase();
    } else if (matchedLayoutText.toLowerCase().includes("studio")) {
      type = "Studio Layout";
    } else {
      // Find the first capital letters sequence or fallback to something readable
      const parts = matchedLayoutText.split(/\(|\bsqft\b/i);
      if (parts[0]) {
        type = parts[0].trim();
      } else {
        type = `Layout ${index + 1}`;
      }
    }

    // Ensure spaces and formatting are perfect
    if (type.toLowerCase() === "studio layout" && rooms.toLowerCase() === "studio") {
      rooms = "Compact Studio";
    }

    return {
      fullName: matchedLayoutText,
      type: type || `Layout ${index + 1}`,
      size: size || "Size Pending",
      rooms: rooms || "Multipurpose Plan"
    };
  }, [project.layouts]);

  // Synchronize selected floorplan if project or floorplans change
  React.useEffect(() => {
    setSelectedFloorplan(floorplansToUse[0] || null);
  }, [floorplansToUse]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setSubmittingLead(true);
    let success = false;

    // 1. First try to submit to Express backend
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          projectSlug: project.slug,
          projectName: project.project_name,
          message: leadMessage,
          budget: leadBudget,
          targetType: "Cross-Border Buyer"
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          success = true;
        }
      }
    } catch (err) {
      console.warn("Express backend failed, falling back to direct FormSubmit client-side submit:", err);
    }

    // 2. Fallback to client-side direct submit to FormSubmit.co for serverless platforms like Vercel
    if (!success) {
      try {
        const directRes = await fetch("https://formsubmit.co/ajax/shyanyeews@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: leadName,
            email: leadEmail,
            phone: leadPhone,
            project_name: project.project_name,
            project_slug: project.slug,
            budget: leadBudget,
            buyer_type: "Cross-Border Buyer",
            message: leadMessage,
            _subject: `New Lead Registered for ${project.project_name} - ${leadName}`,
            _template: "table",
            _captcha: "false"
          })
        });

        if (directRes.ok) {
          const resData = await directRes.json();
          if (resData.success === "true" || directRes.status === 200) {
            success = true;
          }
        }
      } catch (fallbackErr) {
        console.error("Direct client-side FormSubmit fallback failed too:", fallbackErr);
      }
    }

    if (success) {
      setLeadSuccess(true);
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadMessage("");
      setLeadBudget("");
    } else {
      alert("Submission failed. Please email shyanyeews@gmail.com directly or check your internet connection.");
    }
    setSubmittingLead(false);
  };

  // Parse base price
  const basePriceMyrNum = parseInt(project.price_min.replace(/[^0-9]/g, "")) || 0;

  // Schema Markup JSON-LD injection dynamically
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        "@id": `https://shyanyee.com/#projects/${project.slug}`,
        "name": project.seo_title,
        "description": project.seo_description,
        "datePosted": "2026-07-11",
        "priceCurrency": "MYR",
        "price": project.price_min,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "MYR",
          "lowPrice": project.price_min,
          "highPrice": project.price_max,
          "offerCount": project.total_units
        }
      },
      {
        "@type": "Residence",
        "name": project.project_name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": project.address,
          "addressLocality": project.area,
          "addressRegion": "Johor",
          "addressCountry": "MY"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is ${project.project_name} suitable for Singapore daily commuters?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, ${project.project_name} is situated in ${project.area} with high transit indices. Connectivity notes: ${project.transportation}. Direct features: ${project.key_features}.`
            }
          },
          {
            "@type": "Question",
            "name": `What is the tenure and land title of ${project.project_name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `This is a ${project.tenure} tenure property with a ${project.land_title} land title, representing a high-spec verified asset class.`
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="font-sans space-y-16 py-8">
      
      {/* Dynamic Schema Injection (Hidden script) */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Back Button and Navigation path */}
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <button
          onClick={() => navigateTo("projects")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Property Listings</span>
        </button>
      </div>

      {/* Top Feature Hero Banner */}
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl relative p-8 md:p-12 min-h-[360px] flex flex-col justify-end">
          <div className="absolute inset-0 opacity-25">
            <img 
              src={getProjectCoverImage(project)} 
              className="w-full h-full object-cover" 
              alt="Exterior perspective"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">{project.developer}</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">{project.project_name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center space-x-1 text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{project.address}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details Spec Table & Sidebar Form */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column (8 cols): Specifications, GEO Answers, Maps */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section 2: Overview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Overview</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{project.description}</p>
          </div>

          {/* Section 3: Key Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Key Features</h3>
            {project.key_features ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.key_features.split(/[,;\n]+/).map((feature, idx) => {
                  const cleaned = feature.trim();
                  if (!cleaned) return null;
                  return (
                    <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-slate-700">{cleaned}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-500 italic text-xs">Information pending verification.</p>
            )}
          </div>

          {/* Section 4: Specification */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Technical Specifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Land Tenure</span>
                <span className="font-semibold text-slate-800">{project.tenure || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Land Title Class</span>
                <span className="font-semibold text-slate-800">{project.land_title || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Project Type</span>
                <span className="font-semibold text-slate-800">{project.project_type || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Land Size</span>
                <span className="font-semibold text-slate-800">{project.land_size || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Completion Status</span>
                <span className="font-semibold text-slate-800">{project.completion_status || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Estimated Delivery Year</span>
                <span className="font-semibold text-slate-800">{project.completion_year || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Construction Period</span>
                <span className="font-semibold text-slate-800">{project.construction_period || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Total Asset Units</span>
                <span className="font-semibold text-slate-800">{project.total_units || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Total Structural Floors</span>
                <span className="font-semibold text-slate-800">{project.total_floors || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Density (Units per Floor)</span>
                <span className="font-semibold text-slate-800">{project.units_per_floor || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Vertical Lifts per Floor</span>
                <span className="font-semibold text-slate-800">{project.lift_per_floor || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Maintenance Assessments</span>
                <span className="font-semibold text-slate-800">{project.maintenance_fee || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Car Park Allocations</span>
                <span className="font-semibold text-slate-800">{project.car_park || "Information Pending Verification"}</span>
              </div>

              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Starting price per sqft</span>
                <span className="font-semibold text-slate-800">{convertPsfStr(project.price_psf, currency)}</span>
              </div>

            </div>
          </div>

          {/* Section 5: Why This Project */}
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 space-y-6">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
              <span>Why Choose {project.project_name}? (Deterministic AI Valuation Guide)</span>
            </div>

            {/* QA Block 1 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm">Q1. Who is this project suitable for?</h4>
              <p className="text-slate-600 text-xs leading-relaxed pl-4 border-l-2 border-blue-200">
                This development is categorized as a **{project.project_type}** by **{project.developer}**. With formats supporting **{project.bedrooms} bedrooms**, it caters perfectly to cross-border commuters, multi-generational local families, or high-yield short-term rental consultants seeking verified assets in Johor.
              </p>
            </div>

            {/* QA Block 2 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm">Q2. What is the exact transit distance to RTS & Customs?</h4>
              <p className="text-slate-600 text-xs leading-relaxed pl-4 border-l-2 border-blue-200">
                The property sits at GPS **{project.coordinate}**. Proximity metrics show: **{project.transportation}**. It includes a direct linked corridor path to transit, ensuring rapid, reliable commute times.
              </p>
            </div>

            {/* QA Block 3 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm">Q3. What are the key premium features of this property?</h4>
              <p className="text-slate-600 text-xs leading-relaxed pl-4 border-l-2 border-blue-200">
                Key structural accolades include: **{project.key_features || "Information Pending Verification"}**. It features **{project.facilities}** as designated luxurious residential amenities.
              </p>
            </div>
          </div>

          {/* Section 6: Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span>Location Map & Coordinates</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              The project is strategically positioned at <strong className="text-slate-800">{project.address}</strong> (Area: {project.area}, Coordinate: {project.coordinate}). 
            </p>
            
            {project.location_images && project.location_images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {project.location_images.map((imgUrl, idx) => (
                  <div key={idx} className="group relative h-56 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
                    <img 
                      src={imgUrl} 
                      alt={`${project.project_name} Location Map ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white font-mono text-[10px] p-2 text-center">
                      Location Blueprint Map {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                Location schematic map images are pending sync from Google Drive.
              </div>
            )}
          </div>

          {/* Section 7: Layouts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Available Layout Formats</h3>

            {/* Interactive Floorplans Section */}
            {floorplansToUse && floorplansToUse.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  
                  {/* Floorplan List/Thumbnails */}
                  <div className="md:col-span-1 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-visible pb-2 md:pb-0 max-h-[350px] pr-1">
                    {floorplansToUse.map((imgUrl, index) => {
                      const meta = getLayoutMetadata(imgUrl, index);
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedFloorplan(imgUrl)}
                          className={`p-3 rounded-xl border text-left flex items-start space-x-3 shrink-0 md:shrink transition-all duration-200 cursor-pointer ${
                            selectedFloorplan === imgUrl
                              ? "bg-slate-900 border-slate-900 text-white shadow-md font-bold scale-[1.01]"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium hover:border-slate-300"
                          }`}
                        >
                          <div className="h-11 w-11 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img 
                              src={imgUrl} 
                              alt="Thumbnail" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=100&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold tracking-tight truncate">
                              {meta.type}
                            </span>
                            <span className={`text-[10px] truncate mt-0.5 ${selectedFloorplan === imgUrl ? "text-slate-300" : "text-slate-500"}`}>
                              {meta.rooms}
                            </span>
                            <span className={`text-[9px] font-mono mt-0.5 ${selectedFloorplan === imgUrl ? "text-blue-300" : "text-blue-600"}`}>
                              {meta.size}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Floorplan Expanded Viewer */}
                  <div className="md:col-span-3 bg-white border border-slate-200/60 rounded-xl p-6 flex flex-col min-h-[350px] relative">
                    {selectedFloorplan ? (
                      (() => {
                        const activeIndex = floorplansToUse.indexOf(selectedFloorplan);
                        const activeMeta = getLayoutMetadata(selectedFloorplan, activeIndex !== -1 ? activeIndex : 0);
                        return (
                          <div className="flex flex-col h-full w-full justify-between gap-4">
                            {/* Detailed Info Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                                  Selected Floorplan
                                </span>
                                <h4 className="text-base font-semibold text-slate-900 mt-1">
                                  {activeMeta.type} ({activeMeta.rooms})
                                </h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Estimated Area</span>
                                <span className="text-sm font-semibold text-blue-600 font-mono">
                                  {activeMeta.size}
                                </span>
                              </div>
                            </div>

                            {/* Center Floorplan Image */}
                            <div className="flex-1 flex items-center justify-center py-4 relative">
                              <img 
                                src={selectedFloorplan} 
                                alt={`${project.project_name} - ${activeMeta.type} Floorplan`} 
                                className="max-h-[300px] md:max-h-[380px] object-contain rounded-lg transition-transform duration-300" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80";
                                }}
                              />
                            </div>

                            {/* Footer full name & Link */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                              <span className="text-xs text-slate-500 italic max-w-[70%] truncate">
                                {activeMeta.fullName}
                              </span>
                              <a 
                                href={selectedFloorplan} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-all cursor-pointer shadow-sm"
                              >
                                <span>Open Full Resolution</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-slate-500 italic text-sm">Select a floorplan layout to inspect.</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Section 8: Facilities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Resort Facilities & Amenities</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{project.facilities || "Information Pending Verification"}</p>
            
            {facilitiesImages && facilitiesImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {facilitiesImages.map((imgUrl, idx) => (
                  <div key={idx} className="group relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 cursor-pointer shadow-sm hover:shadow-md transition-all">
                    <img 
                      src={imgUrl} 
                      alt={`${project.project_name} Facility ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-xl">Facilities Asset</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                Facilities layout plan & rendering images are pending sync from Google Drive.
              </div>
            )}
          </div>

          {/* Section 9: Amenities */}
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Local Amenities & Lifestyle Ecosystem</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">Transit & Access Gateways</span>
                <h5 className="font-bold text-slate-800 text-sm">Transportation Network</h5>
                <p className="text-slate-600 text-xs leading-relaxed">{project.transportation || "Information Pending Verification"}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">Education & Academy Hubs</span>
                <h5 className="font-bold text-slate-800 text-sm">Schools & Private Education</h5>
                <p className="text-slate-600 text-xs leading-relaxed">{project.education || "Information Pending Verification"}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">Retail Therapy & Food Hubs</span>
                <h5 className="font-bold text-slate-800 text-sm">Shopping Malls & Markets</h5>
                <p className="text-slate-600 text-xs leading-relaxed">{project.shopping || "Information Pending Verification"}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">Medical & Clinical Wellness</span>
                <h5 className="font-bold text-slate-800 text-sm">Hospitals & Health Centers</h5>
                <p className="text-slate-600 text-xs leading-relaxed">{project.hospital || "Information Pending Verification"}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Regional Proximity & Hotspots</span>
              <h5 className="font-bold text-slate-800 text-sm">Nearby Landmark Proximity</h5>
              <p className="text-slate-600 text-xs leading-relaxed">{project.nearby || "Information Pending Verification"}</p>
            </div>
          </div>

          {/* Section 10: Interactive Map */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Interactive Geospatial Position Map</h3>
            <OSMMap
              coordinateString={project.coordinate}
              projectName={project.project_name}
              address={project.address}
              priceRange={`${convertPriceStr(project.price_min, currency)} - ${convertPriceStr(project.price_max, currency)}`}
            />
          </div>

          {/* Embedded Mortgage Calculator / Amortization Simulator */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3">Amortization Simulator</h3>
            <MortgageCalculator basePriceMyr={basePriceMyrNum} activeCurrency={currency} />
          </div>

          {/* Section 11: Visual Gallery (all other pictures exclude location and layouts) */}
          {filteredGalleryImages && filteredGalleryImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <span>Visual Gallery</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredGalleryImages.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className="group relative h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                    onClick={() => setActiveGalleryIndex(index)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Image</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lightbox / Expanded View */}
              {activeGalleryIndex !== null && filteredGalleryImages[activeGalleryIndex] && (
                <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
                  <button 
                    onClick={() => setActiveGalleryIndex(null)}
                    className="absolute top-6 right-6 text-white/90 hover:text-white font-bold text-xs bg-white/10 hover:bg-white/25 px-4 py-2.5 rounded-xl backdrop-blur-md cursor-pointer transition-all border border-white/10"
                  >
                    Close Preview
                  </button>
                  <div className="max-w-4xl max-h-[80vh] relative flex items-center justify-center">
                    <img 
                      src={filteredGalleryImages[activeGalleryIndex]} 
                      alt="Active gallery preview" 
                      className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-6 flex items-center space-x-6 text-white/80 text-sm">
                    <button 
                      onClick={() => setActiveGalleryIndex((prev) => (prev! === 0 ? filteredGalleryImages.length - 1 : prev! - 1))}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-semibold cursor-pointer text-xs transition-all border border-white/5"
                    >
                      Previous
                    </button>
                    <span className="font-mono text-xs font-semibold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      {activeGalleryIndex + 1} / {filteredGalleryImages.length}
                    </span>
                    <button 
                      onClick={() => setActiveGalleryIndex((prev) => (prev! === filteredGalleryImages.length - 1 ? 0 : prev! + 1))}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-semibold cursor-pointer text-xs transition-all border border-white/5"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Site & Construction Progress Photos (Complementary visual content) */}
          {project.progress_images && project.progress_images.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-xl tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Site & Construction Progress Photos</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.progress_images.map((imgUrl, idx) => (
                  <div key={idx} className="group relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 cursor-pointer shadow-sm hover:shadow-md transition-all">
                    <img 
                      src={imgUrl} 
                      alt={`${project.project_name} Progress ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white font-mono text-[9px] p-1 text-center">
                      Site Record {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Lead Acquisition & Actions */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions (Call, Chat, AI sidebar) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md border border-slate-800">
            <h4 className="font-sans font-semibold text-base">Direct Acquisition Channels</h4>
            
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-pink-500/10 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Consult Custom AI Advisor</span>
            </button>

            <a
              href="https://wa.me/60195598932?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20this%20Johor%20Bahru%20property%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3.5 rounded-xl text-center block transition-all shadow-sm"
            >
              Connect to Consultant (WhatsApp)
            </a>

            <p className="text-[10px] text-center text-slate-500 font-mono">
              Verified Listing Code: JB-{project.slug.toUpperCase()}
            </p>
          </div>

          {/* Lead Acquisition Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-semibold text-slate-900 text-base">Acquisition Registration</h4>
            <p className="text-xs text-slate-500">Register your contact details to access premium floorplans, direct pricing updates, and booking terms.</p>
            
            {leadSuccess ? (
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center text-emerald-800">
                <ShieldCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <h5 className="font-semibold text-sm">Registration Complete!</h5>
                <p className="text-xs text-emerald-600 mt-1">Email dispatch to shyanyeews@gmail.com triggered successfully via FormSubmit.</p>
                <button 
                  onClick={() => setLeadSuccess(false)}
                  className="text-xs font-semibold text-blue-600 underline mt-4 block mx-auto"
                >
                  Submit another lead
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. johndoe@gmail.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Mobile Contact No.</label>
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="e.g. +65 9123 4567"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Your Buying Budget</label>
                  <input
                    type="text"
                    value={leadBudget}
                    onChange={(e) => setLeadBudget(e.target.value)}
                    placeholder="e.g. SGD 300,000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Advisory Message</label>
                  <textarea
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    rows={3}
                    placeholder="Note specific details of your acquisition criteria..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {submittingLead ? "Submitting Registration..." : "Register Acquisition Lead"}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* AIAssistant Sidebar */}
      <AIAssistant
        project={project}
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        buyerType="expatriate investor"
      />

    </div>
  );
}
