import React, { useState, useEffect } from "react";
import { 
  Compass, Sparkles, Phone, Mail, Youtube, ArrowRight, ShieldCheck, 
  MapPin, CheckSquare, Search, Filter, HelpCircle, ArrowLeft, RefreshCw, 
  Lock, Trash2, ExternalLink, Calendar, Calculator, Info, FileText, ChevronRight, 
  ChevronDown, Star, Milestone, Building2, UserCheck, Scale, Landmark, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Project, Enquiry, BlogPost, AreaGuide, DeveloperProfile } from "./types";
import { projectsData } from "./data/projects-data";
import { blogPosts, areaGuides, developerProfiles } from "./data/blog-data";
import { getTranslatedBlog } from "./utils/blog-translator";
import { getDirectDriveImage, getProjectCoverImage } from "./utils";
import { syncDriveImages } from "./utils/drive-sync";
import { getTranslation } from "./utils/translation";
import { initAuth } from "./firebase-auth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProjectCard from "./components/ProjectCard";
import MortgageCalculator from "./components/MortgageCalculator";
import OSMMap from "./components/OSMMap";
import AIAssistant from "./components/AIAssistant";
import ProjectDetailView from "./components/ProjectDetailView";
import AdminView from "./components/AdminView";
import johorBahruHighrise from "./assets/images/johor_bahru_highrise_1783943811292.jpg";

// Custom markdown helper functions for beautiful, tidy and consistent article rendering
const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|\[(.*?)\]\((.*?)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) { // Bold
      parts.push(<strong key={match.index} className="font-semibold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) { // Italic
      parts.push(<em key={match.index} className="italic text-slate-800">{match[4]}</em>);
    } else if (match[5]) { // Inline code
      parts.push(<code key={match.index} className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1 rounded">{match[6]}</code>);
    } else if (match[7]) { // Link
      parts.push(
        <a key={match.index} href={match[8]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold cursor-pointer">
          {match[7]}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

const renderMarkdownContent = (content: string): React.ReactNode => {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="space-y-8 md:space-y-10 font-sans">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 0. Image blocks (with extremely generous vertical margins and modern styling)
        if (trimmed.startsWith("![") && trimmed.endsWith(")")) {
          const match = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (match) {
            const alt = match[1];
            const url = match[2];
            return (
              <div key={idx} className="my-12 md:my-16 rounded-3xl overflow-hidden border border-slate-200/50 shadow-md transition-all hover:shadow-lg bg-slate-50">
                <img src={url} alt={alt} className="w-full h-auto max-h-[480px] object-cover" referrerPolicy="no-referrer" />
                {alt && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-white text-center">
                    <p className="text-xs text-slate-400 font-mono tracking-tight">{alt}</p>
                  </div>
                )}
              </div>
            );
          }
        }

        // 1. Horizontal rule
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={idx} className="border-t border-slate-200/80 my-10 md:my-14" />;
        }

        // 2. Headings
        if (trimmed.startsWith("###")) {
          return (
            <h3 key={idx} className="text-base md:text-lg font-bold text-slate-900 tracking-tight mt-10 pt-6 border-t border-slate-100 first:border-0 first:pt-0">
              {parseInlineMarkdown(trimmed.replace(/^###\s*/, ""))}
            </h3>
          );
        }
        if (trimmed.startsWith("####")) {
          return (
            <h4 key={idx} className="text-sm md:text-base font-bold text-slate-800 tracking-tight mt-6">
              {parseInlineMarkdown(trimmed.replace(/^####\s*/, ""))}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h2 key={idx} className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mt-12 mb-4 border-b border-slate-100 pb-3">
              {parseInlineMarkdown(trimmed.replace(/^##\s*/, ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h1 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mt-12 mb-4">
              {parseInlineMarkdown(trimmed.replace(/^#\s*/, ""))}
            </h1>
          );
        }

        // 3. Tables
        if (trimmed.startsWith("|")) {
          const lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean);
          if (lines.length >= 2) {
            const headers = lines[0]
              .split("|")
              .map(cell => cell.trim())
              .filter((_, i, arr) => i > 0 && i < arr.length - 1);
            
            const rows = lines.slice(2).map(rowLine => {
              return rowLine
                .split("|")
                .map(cell => cell.trim())
                .filter((_, i, arr) => i > 0 && i < arr.length - 1);
            });

            return (
              <div key={idx} className="overflow-x-auto my-6 md:my-8 rounded-2xl border border-slate-200/60 shadow-sm bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-xs md:text-sm text-left bg-white">
                  <thead className="bg-slate-50">
                    <tr>
                      {headers.map((header, hIdx) => (
                        <th key={hIdx} className="px-5 py-3.5 font-semibold text-slate-800 font-sans border-b border-slate-200">
                          {parseInlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-5 py-3.5 text-slate-800 font-sans leading-relaxed">
                            {parseInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 4. Bullet list
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean);
          return (
            <ul key={idx} className="list-disc pl-6 space-y-2 text-sm md:text-base text-slate-800 my-4 md:my-5 leading-[1.85]">
              {lines.map((line, lIdx) => {
                const content = line.replace(/^[-*]\s*/, "");
                return <li key={lIdx} className="leading-[1.85]">{parseInlineMarkdown(content)}</li>;
              })}
            </ul>
          );
        }

        // 5. Numbered list
        if (/^\d+\.\s+/.test(trimmed)) {
          const lines = trimmed.split("\n").map(l => l.trim()).filter(Boolean);
          return (
            <ol key={idx} className="list-decimal pl-6 space-y-2 text-sm md:text-base text-slate-800 my-4 md:my-5 leading-[1.85]">
              {lines.map((line, lIdx) => {
                const content = line.replace(/^\d+\.\s*/, "");
                return <li key={lIdx} className="leading-[1.85]">{parseInlineMarkdown(content)}</li>;
              })}
            </ol>
          );
        }

        // 6. Default paragraph
        return (
          <p key={idx} className="text-slate-800 text-sm md:text-base leading-[1.85] md:leading-[1.9] my-4 md:my-5">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Currency context multipliers: 1 unit of foreign currency = X MYR
const rates: Record<string, number> = {
  MYR: 1.0,
  SGD: 3.45,
  USD: 4.65,
  CNY: 0.65
};

export default function App() {
  // Global States
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [currentView, setCurrentView] = useState<string>("home");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  
  const [currency, setCurrency] = useState<string>("MYR");
  const [language, setLanguage] = useState<string>("EN");
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);
  
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Filters State for Listing Page
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBeds, setSelectedBeds] = useState("All");
  const [rtsProximityFilter, setRtsProximityFilter] = useState(false);

  // Blog Search and Filter States
  const [blogSearch, setBlogSearch] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState("All");

  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveUser, setDriveUser] = useState<any>(null);

  // Global FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [selectedMapProject, setSelectedMapProject] = useState<Project | null>(projectsData[0] || null);

  // Hash Routing Logic
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#";
      if (hash === "#" || hash === "#home") {
        setCurrentView("home");
        setActiveSlug(null);
      } else if (hash.startsWith("#projects/")) {
        setCurrentView("project-detail");
        setActiveSlug(hash.replace("#projects/", ""));
      } else if (hash === "#projects") {
        setCurrentView("projects");
        setActiveSlug(null);
      } else if (hash === "#compare") {
        setCurrentView("compare");
        setActiveSlug(null);
      } else if (hash.startsWith("#area/")) {
        setCurrentView("area");
        setActiveSlug(hash.replace("#area/", ""));
      } else if (hash.startsWith("#developer/")) {
        setCurrentView("developer");
        setActiveSlug(hash.replace("#developer/", ""));
      } else if (hash.startsWith("#buying-guides/")) {
        setCurrentView("buying-guides");
        setActiveSlug(hash.replace("#buying-guides/", ""));
      } else if (hash.startsWith("#blog/")) {
        setCurrentView("blog-detail");
        setActiveSlug(hash.replace("#blog/", ""));
      } else if (hash === "#blog") {
        setCurrentView("blog");
        setActiveSlug(null);
      } else if (hash === "#admin") {
        setCurrentView("admin");
        setActiveSlug(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // initial trigger
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: string) => {
    window.location.hash = view;
  };

  // Fetch dynamic projects from server endpoint with direct Google Drive sync trigger
  const fetchLiveProjects = async (activeToken?: string | null) => {
    setIsLoadingProjects(true);

    const attemptFetch = async (retriesLeft: number, currentDelay: number): Promise<any[] | null> => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
        const data = await res.json();
        if (data.success && data.projects) {
          return data.projects;
        }
        throw new Error(data.error || "Invalid response structure");
      } catch (err) {
        console.warn(`Fetch projects attempt failed (${retriesLeft} retries left):`, err);
        if (retriesLeft > 0) {
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          return attemptFetch(retriesLeft - 1, currentDelay * 1.5);
        }
        return null;
      }
    };

    try {
      const fetchedProjects = await attemptFetch(4, 1000);
      if (fetchedProjects) {
        setProjects(fetchedProjects);
        // Direct seamless trigger for Google Drive sync
        const tokenToUse = activeToken !== undefined ? activeToken : driveToken;
        await syncDriveImages(fetchedProjects, setProjects, tokenToUse);
      } else {
        console.error("Error synchronizing project data: All fetch attempts failed.");
      }
    } catch (err) {
      console.error("Error synchronizing project data:", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Synchronize Google Drive Auth state changes and trigger direct automatic sync
  useEffect(() => {
    let initialLoadTriggered = false;
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setDriveUser(currentUser);
        setDriveToken(accessToken);
        initialLoadTriggered = true;
        fetchLiveProjects(accessToken);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
        if (!initialLoadTriggered) {
          initialLoadTriggered = true;
          fetchLiveProjects(null);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // Compare toggling
  const handleCompareToggle = (slug: string) => {
    setComparedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      } else {
        if (prev.length >= 3) {
          alert("You can compare up to 3 projects side-by-side.");
          return prev;
        }
        return [...prev, slug];
      }
    });
  };

  // Price conversion helper
  const convertPriceStr = (priceStr: string, activeCur: string) => {
    if (!priceStr || priceStr.toLowerCase().includes("pending") || priceStr.toLowerCase().includes("verification")) {
      return "Information Pending Verification";
    }
    try {
      const number = parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
      if (number === 0) return priceStr;
      
      const converted = Math.round(number / (rates[activeCur] || 1));
      
      const symbols: Record<string, string> = {
        MYR: "RM ",
        SGD: "S$ ",
        USD: "$ ",
        CNY: "¥ "
      };
      return (symbols[activeCur] || "") + converted.toLocaleString("en-US");
    } catch {
      return priceStr;
    }
  };

  const convertPsfStr = (psfStr: string, activeCur: string) => {
    if (!psfStr || psfStr.toLowerCase().includes("pending") || psfStr.toLowerCase().includes("verification")) {
      return "Information Pending Verification";
    }
    // E.g. "RM1,846" or "RM1,250-RM1,392"
    try {
      const cleaned = psfStr.replace(/RM/g, "").trim();
      const parts = cleaned.split("-");
      const convertedParts = parts.map(part => {
        const val = parseInt(part.replace(/[^0-9]/g, "")) || 0;
        if (val === 0) return part;
        const converted = Math.round(val / (rates[activeCur] || 1));
        const symbol = activeCur === "MYR" ? "RM" : activeCur === "SGD" ? "S$" : activeCur === "USD" ? "$" : "¥";
        return `${symbol}${converted}`;
      });
      return convertedParts.join(" - ") + " psf";
    } catch {
      return psfStr;
    }
  };

  // 1. HOME VIEW RENDER
  const renderHomeView = () => {
    const featuredProjects = projects.slice(0, 3);
    
    return (
      <div className="space-y-20 font-sans pb-10">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-brand-slate py-28 text-white">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-transparent to-brand-slate z-10" />
            <img 
              src={johorBahruHighrise} 
              className="h-full w-full object-cover" 
              alt="Johor Bahru Modern Highrise Skyline"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Subtle Ring Overlay for Real Estate Architectural feel */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <div className="w-[140%] h-[140%] border-[40px] border-white/15 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 text-center space-y-6">
            
            {/* AI Highlight Banner */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg shadow-pink-500/20">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>{getTranslation(language, "rtsTitle")}</span>
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              {getTranslation(language, "heroTitle")}
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              {getTranslation(language, "heroSubtitle")}
            </p>

            {/* Quick Search Widget */}
            <div className="mt-12 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center space-x-2 bg-white rounded-xl px-4 py-3.5 text-slate-800 border border-slate-100">
                <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by Developer, Project, or Area (e.g. UOA, EXSIM, Princess Cove)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs font-semibold focus:outline-none placeholder:text-slate-400 bg-transparent"
                />
              </div>
              <button 
                onClick={() => {
                  navigateTo("projects");
                }}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 shrink-0 flex items-center justify-center space-x-2"
              >
                <span>Launch Listings</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* RTS Commute highlight */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">RTS Transit Duration</span>
                <span className="text-xl font-bold text-white block mt-1">5 Minutes</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Woodlands capacity</span>
                <span className="text-xl font-bold text-white block mt-1">10k / Hour</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">RTS Launch Year</span>
                <span className="text-xl font-bold text-white block mt-1">2026/2027</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">JS-SEZ Status</span>
                <span className="text-xl font-bold text-emerald-400 block mt-1">Operational</span>
              </div>
            </div>

          </div>
        </div>        {/* Johor Bahru Near RTS and CIQ Properties Overview Section */}
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-lg space-y-10 border border-slate-200/40">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              {/* Overview Details */}
              <div className="flex-1 space-y-6">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-blue uppercase block">{getTranslation(language, "overviewSubtitle")}</span>
                <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-brand-slate leading-tight uppercase">
                  {getTranslation(language, "overviewTitle")}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {getTranslation(language, "overviewDesc")}
                </p>

                {/* Micro-market insights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                  <div className="flex items-start space-x-3 bg-white/65 backdrop-blur-md rounded-xl p-4 border border-slate-200/40 shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-slate">Co-Located Customs (CIQ)</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed">Single-point customs clearance means you clear both Malaysia and Singapore immigration at the departure station, saving hours of daily travel time.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 bg-white/65 backdrop-blur-md rounded-xl p-4 border border-slate-200/40 shadow-sm">
                    <Building2 className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-brand-slate">Premium Connectivity Link</h4>
                      <p className="text-slate-500 mt-1 leading-relaxed">Developments in this premier zone feature direct, covered, and sheltered pedestrian link bridges of 400m to 650m directly to the RTS Station and CIQ.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Stats visual box */}
              <div className="w-full lg:w-[400px] shrink-0 bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800 text-left">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
                <h4 className="font-display font-bold text-base tracking-wide uppercase border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span>{getTranslation(language, "marketMetrics")}</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">VS</span>
                </h4>
                
                <div className="space-y-5">
                  {/* Metric 1: Avg Price PSF */}
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">{getTranslation(language, "pricePremium")}</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">JB (RTS)</span>
                        <span className="text-sm font-bold text-emerald-400">~S$ 250 - 400</span>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">SG (Woodlands)</span>
                        <span className="text-sm font-bold text-slate-300">~S$ 1,400 - 2,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2: Avg Rental Yield */}
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">{getTranslation(language, "averageYield")}</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">JB (RTS)</span>
                        <span className="text-sm font-bold text-emerald-400">6.0% - 8.5%</span>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">SG (Average)</span>
                        <span className="text-sm font-bold text-slate-300">2.8% - 3.8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3: Entry Price (1-Bed) */}
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">{getTranslation(language, "timeSaved")}</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">JB (RTS)</span>
                        <span className="text-sm font-bold text-emerald-400">~S$ 150K - 250K</span>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-[9px] block">SG (Woodlands)</span>
                        <span className="text-sm font-bold text-slate-300">~S$ 800K - 1.1M</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono leading-normal">
                  * Leverage 4x to 6x purchasing power with higher yields and lower initial capital outlay by choosing JB RTS corridor.
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-brand-blue uppercase">Premium Curations</span>
              <h3 className="font-display text-3xl font-bold tracking-tight text-brand-slate mt-1 uppercase">Featured Portfolios</h3>
            </div>
            <button 
              onClick={() => navigateTo("projects")}
              className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>Explore All Properties ({projects.length}) &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((proj) => (
              <ProjectCard
                key={proj.slug}
                project={proj}
                onViewDetails={(slug) => navigateTo(`projects/${slug}`)}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedSlugs.includes(proj.slug)}
                activeCurrency={currency}
              />
            ))}
          </div>
        </div>

        {/* Specific Client Buying Pathways (Malaysian, Singaporean, Foreigner) */}
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Targeted Portals</span>
            <h3 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-2">Tailored Acquisition Paths</h3>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Select your legal/residency profile to review tax limits, RPGT regulations, stamp duties and MM2H conditions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Path 1: Malaysian */}
            <div 
              onClick={() => navigateTo("buying-guides/malaysian-buyer")}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-blue-50 text-blue-600 rounded-xl mb-6 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCheck className="h-6 w-6" />
              </div>
              <h4 className="font-sans font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">Malaysian Citizens</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Financing rules, downpayment exemptions, EPF Account 2 withdrawals, and RPGT tax bands explained for locals.</p>
              <span className="text-xs font-bold text-blue-600 group-hover:underline inline-flex items-center space-x-1">
                <span>View Guidelines</span>
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>

            {/* Path 2: Singaporean Commuter */}
            <div 
              onClick={() => navigateTo("buying-guides/singaporean-commuter")}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-purple-50 text-purple-600 rounded-xl mb-6 font-semibold group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Milestone className="h-6 w-6" />
              </div>
              <h4 className="font-sans font-semibold text-lg text-slate-900 group-hover:text-purple-600 transition-colors mb-2">Singaporean Commuters</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Cross-border banking, HDB ownership rulings, RTS Link pass-rates, and SGD-MYR investment opportunities.</p>
              <span className="text-xs font-bold text-purple-600 group-hover:underline inline-flex items-center space-x-1">
                <span>View Guidelines</span>
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>

            {/* Path 3: Foreigner Investor */}
            <div 
              onClick={() => navigateTo("buying-guides/foreigner-investor")}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center bg-amber-50 text-amber-600 rounded-xl mb-6 font-semibold group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Scale className="h-6 w-6" />
              </div>
              <h4 className="font-sans font-semibold text-lg text-slate-900 group-hover:text-amber-600 transition-colors mb-2">Foreign HNWI Investors</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Minimum RM1,000,000 purchase thresholds, MM2H visa options, state levies, and corporate asset ownership structures.</p>
              <span className="text-xs font-bold text-amber-600 group-hover:underline inline-flex items-center space-x-1">
                <span>View Guidelines</span>
                <ChevronRight className="h-3 w-3" />
              </span>
            </div>

          </div>
        </div>

        {/* Global Market Insights & Blogs Section */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 pb-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Analysis Corner</span>
              <h3 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-2">Latest Southern Region Reports</h3>
            </div>
            <button 
              onClick={() => navigateTo("blog")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Explore All Reports</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((rawBlog) => {
              const blog = getTranslatedBlog(rawBlog, language);
              return (
                <div 
                  key={blog.slug} 
                  onClick={() => navigateTo(`blog/${blog.slug}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all text-left flex flex-col"
                >
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        <span>{blog.category}</span>
                        <span>{blog.date}</span>
                      </div>
                      <h4 className="font-sans font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-base leading-snug">
                        {blog.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                        {blog.summary}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:underline block mt-4">Read Complete Report &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Corridor Map Section */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 pb-16">
          <div className="border-b border-slate-100 pb-4 mb-8 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Geographical Location</span>
            <h3 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-2">Interactive Corridor Map</h3>
            <p className="text-slate-500 text-xs mt-1">Explore all major transit-oriented developments along the Johor Bahru RTS transit link corridor.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            {/* Left Panel: Project Selectors */}
            <div className="lg:col-span-4 flex flex-col space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {projects.map((p) => {
                const isSelected = selectedMapProject?.slug === p.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setSelectedMapProject(p)}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col space-y-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
                      isSelected 
                        ? "bg-blue-50 border-blue-200 shadow-sm" 
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <span className="font-sans font-semibold text-xs md:text-sm text-slate-800">{p.project_name}</span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {p.area}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 font-mono mt-1">
                      From {convertPriceStr(p.price_min, currency)}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Right Panel: Interactive OSM Map */}
            <div className="lg:col-span-8">
              {selectedMapProject ? (
                <OSMMap
                  coordinateString={selectedMapProject.coordinate}
                  projectName={selectedMapProject.project_name}
                  address={selectedMapProject.address}
                  priceRange={convertPriceStr(selectedMapProject.price_min, currency)}
                />
              ) : (
                <div className="w-full h-[400px] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-mono text-xs">
                  Select a development to view its map location
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global FAQ Accordion (Fulfills exact requirement of 20 Global FAQs - Show only 6 by default, other via dropdown/Show More) */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 pb-16">
          <div className="border-b border-slate-100 pb-4 mb-8 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Knowledge Base</span>
            <h3 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-2">Frequently Asked Questions</h3>
            <p className="text-slate-500 text-xs mt-1">Everything you need to know about purchasing, owning, and commuting in Johor Bahru's transit-oriented corridor.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {/* First Column */}
            <div className="space-y-4">
              {[
                {
                  q: "Can foreigners legally buy property in Johor?",
                  a: "Yes. Foreigners can legally purchase and own freehold strata properties directly under their own names in Malaysia, subject to minimum price thresholds (typically RM1,000,000 in Johor)."
                },
                {
                  q: "What is the minimum purchase threshold for foreigners in Johor?",
                  a: "In Johor, the standard minimum price threshold for foreign purchasers of residential high-rises is RM1,000,000. However, in designated special economic zones like Medini (Iskandar Puteri), the threshold is waived or lower."
                },
                {
                  q: "How fast is the RTS Link transit between Johor and Singapore?",
                  a: "The RTS Link train ride between Bukit Chagar Terminal (JB) and Woodlands North (Singapore) takes exactly 5 minutes. The high-frequency service runs every 3.6 minutes during peak hours."
                }
              ].map((item, idx) => {
                const globalIdx = idx;
                const isOpen = openFaqIndex === globalIdx;
                return (
                  <div key={globalIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                      className="w-full px-6 py-4 flex items-center justify-between font-sans font-semibold text-slate-800 hover:text-blue-600 transition-colors text-xs md:text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}

              {showAllFaqs && [
                {
                  q: "How does customs clearance work for the RTS Link?",
                  a: "The RTS Link uses a co-located CIQ system. You clear both Malaysia and Singapore customs at the departure station before boarding. Upon arrival, you simply exit the train without further checks, bypassing hours of traffic."
                },
                {
                  q: "What is the difference between Freehold and Leasehold tenures in Malaysia?",
                  a: "Freehold properties grant perpetual ownership of the land and building. Leasehold properties grant ownership for a fixed term (usually 99 years), after which the title reverts to the state unless renewed."
                },
                {
                  q: "Can Singapore HDB owners buy a private property in Johor?",
                  a: "Singapore citizens must fully complete their HDB flat's 5-year Minimum Occupation Period (MOP) before they can legally acquire residential properties locally or overseas."
                },
                {
                  q: "How much is the state consent levy for foreign property buyers in Johor?",
                  a: "Johor imposes a standard State Authority Consent Levy of 2% of the purchase price (or RM20,000, whichever is higher) for foreign buyers acquiring residential titles."
                },
                {
                  q: "Can I obtain a mortgage from a Malaysian bank as a foreigner?",
                  a: "Yes. Foreigners with stable global incomes can secure mortgages from major Malaysian banks. Loan-to-Value (LTV) margins range between 60% and 80%, depending on residency status."
                },
                {
                  q: "What is the standard Defect Liability Period (DLP) for new launches?",
                  a: "Under Malaysia's Housing Development Act (HDA), new residential launches come with a 24-month Defect Liability Period (DLP) from the date you receive vacant possession, during which the developer must repair defects for free."
                },
                {
                  q: "Are short-term rentals like Airbnb permitted in Johor serviced residences?",
                  a: "It depends on the individual project zoning. Commercial-titled properties under HDA (like Causewayz Square Axis Tower) allow professional short-term management, whereas pure own-stay projects (like Dover Tower) restrict transient guests."
                }
              ].map((item, idx) => {
                const globalIdx = idx + 3;
                const isOpen = openFaqIndex === globalIdx;
                return (
                  <div key={globalIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                      className="w-full px-6 py-4 flex items-center justify-between font-sans font-semibold text-slate-800 hover:text-blue-600 transition-colors text-xs md:text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              {[
                {
                  q: "What is Real Property Gains Tax (RPGT) in Malaysia?",
                  a: "RPGT is a tax levied on capital gains from selling real estate. For foreigners, the tax is 30% of the net profit if sold within the first 5 years of acquisition, and drops to 10% from the 6th year onwards."
                },
                {
                  q: "What are the typical maintenance fees for Johor serviced apartments?",
                  a: "Maintenance fees usually range from RM0.30 to RM0.55 per square foot per month, which includes the sinking fund. This covers 24/7 security, high-end pools, gardens, and general building insurance."
                },
                {
                  q: "Can I use Singapore Dollars (SGD) directly in Johor Bahru?",
                  a: "All commercial transactions in Malaysia must be settled in Malaysian Ringgit (MYR). However, money changers and digital multi-currency cards (like Wise or YouTrip) make exchange seamless and highly efficient."
                }
              ].map((item, idx) => {
                const globalIdx = idx + 10;
                const isOpen = openFaqIndex === globalIdx;
                return (
                  <div key={globalIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                      className="w-full px-6 py-4 flex items-center justify-between font-sans font-semibold text-slate-800 hover:text-blue-600 transition-colors text-xs md:text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}

              {showAllFaqs && [
                {
                  q: "What is a dual-key apartment layout and how does it work?",
                  a: "A dual-key unit features a main entrance door opening into a shared foyer, which then splits into two independent keys (e.g. a 2-bedroom suite and a separate self-contained studio), enabling multi-generational living or dual-rental cashflows."
                },
                {
                  q: "What does the JS-SEZ mean for Johor real estate values?",
                  a: "The Johor-Singapore Special Economic Zone (JS-SEZ) drives business integration, tax holidays, and passport-free travel corridors, turning JB into a thriving corporate hub and boosting residential rental demand."
                },
                {
                  q: "How are utility bills structured for commercial under HDA properties?",
                  a: "Serviced apartments with HDA protection can typically apply to transition their utility tariffs (electricity and water) from high commercial rates to lower domestic residential tariffs, saving up to 50% in running costs."
                },
                {
                  q: "What are the requirements for the MM2H Visa program in Johor?",
                  a: "The Malaysia My Second Home (MM2H) program offers multiple tiers (Silver, Gold, Platinum) requiring fixed bank deposits in Malaysia, granting long-term renewable visas (5 to 20 years) and tax-free offshore income status."
                },
                {
                  q: "What is Quit Rent and Assessment Tax in Johor?",
                  a: "Quit Rent (Cukai Tanah) is an annual land tax paid to the state land office. Assessment Tax (Cukai Harta) is a local council rate paid twice a year for public services like garbage collection and street lighting."
                },
                {
                  q: "Is it safe for foreigners to live and walk around Johor Bahru?",
                  a: "Yes. Major transit corridors and commercial districts (like IIBD, Bukit Chagar, and Princess Cove) feature extensive CCTV surveillance, private auxiliary police forces, and 24-hour gated security patrols inside complexes."
                },
                {
                  q: "How does the purchase process differ between under-construction and sub-sale properties?",
                  a: "New launches (under-construction) allow you to pay progressively based on construction completion stages (progressive billing), whereas sub-sale (completed) units require the full outstanding balance to be paid within 3 months of signing the SPA."
                }
              ].map((item, idx) => {
                const globalIdx = idx + 13;
                const isOpen = openFaqIndex === globalIdx;
                return (
                  <div key={globalIdx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : globalIdx)}
                      className="w-full px-6 py-4 flex items-center justify-between font-sans font-semibold text-slate-800 hover:text-blue-600 transition-colors text-xs md:text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-slate-500 leading-relaxed border-t border-slate-50/50">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toggle button to expand/collapse remaining FAQs */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAllFaqs(!showAllFaqs)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs rounded-xl shadow-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/50"
            >
              <span>{showAllFaqs ? "Show Less Questions" : "Show More Questions (14)"}</span>
              <ChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${showAllFaqs ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

      </div>
    );
  };

  // 2. PROJECTS LIST VIEW RENDER
  const renderProjectsView = () => {
    // Collect areas and developers dynamically
    const areas = ["All", ...Array.from(new Set(projects.map((p) => p.area)))];
    const types = ["All", ...Array.from(new Set(projects.map((p) => p.project_type)))];
    const statuses = ["All", ...Array.from(new Set(projects.map((p) => p.completion_status)))];

    // Filter Logic
    const filteredProjects = projects.filter((proj) => {
      const matchSearch = 
        proj.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.area.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchArea = selectedArea === "All" || proj.area === selectedArea;
      const matchType = selectedType === "All" || proj.project_type === selectedType;
      const matchStatus = selectedStatus === "All" || proj.completion_status === selectedStatus;
      
      const matchBeds = selectedBeds === "All" || 
        (selectedBeds === "Studio" && proj.bedrooms.toLowerCase().includes("studio")) ||
        (selectedBeds === "1" && proj.bedrooms.includes("1")) ||
        (selectedBeds === "2" && proj.bedrooms.includes("2")) ||
        (selectedBeds === "3+" && (proj.bedrooms.includes("3") || proj.bedrooms.includes("4") || proj.bedrooms.includes("5")));

      const matchRts = !rtsProximityFilter || 
        proj.transportation.toLowerCase().includes("rts") ||
        proj.transportation.toLowerCase().includes("ciq") ||
        proj.key_features.toLowerCase().includes("rts");

      return matchSearch && matchArea && matchType && matchStatus && matchBeds && matchRts;
    });

    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans">
        
        {/* Header Title */}
        <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Interactive Master Board</span>
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-1">Johor Bahru Properties</h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            {filteredProjects.length} of {projects.length} verified listings indexed
          </p>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-semibold text-sm mb-2">
            <Filter className="h-4.5 w-4.5 text-slate-400" />
            <span>Refine Acquisitions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Area Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Micro Area</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                {areas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Type Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Asset Classification</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Completion Timeline</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Bedroom Size</label>
              <select
                value={selectedBeds}
                onChange={(e) => setSelectedBeds(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-200 px-3 py-2.5 bg-white text-slate-700 focus:outline-none focus:border-blue-600"
              >
                <option value="All">All Bedrooms</option>
                <option value="Studio">Studio Units</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3+">3+ Bedrooms</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative rounded-lg shadow-sm w-full sm:max-w-md bg-white">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by keyword (e.g. Mah Sing, EXSIM, sea view)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 pl-10 pr-3 py-2 text-xs focus:border-blue-500 focus:outline-none font-medium"
              />
            </div>

            {/* Toggle RTS Proximity */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rts-proximity"
                checked={rtsProximityFilter}
                onChange={(e) => setRtsProximityFilter(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rts-proximity" className="ml-2.5 text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>RTS Link Adjacent Only (&lt;1km Direct Transit Corridor)</span>
              </label>
            </div>

          </div>
        </div>

        {/* Results Listings Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
            <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800 text-sm mb-1">No Properties Found</h4>
            <p className="text-xs text-slate-500">Please adjust your refined search terms or remove filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <ProjectCard
                key={proj.slug}
                project={proj}
                onViewDetails={(slug) => navigateTo(`projects/${slug}`)}
                onCompareToggle={handleCompareToggle}
                isCompared={comparedSlugs.includes(proj.slug)}
                activeCurrency={currency}
              />
            ))}
          </div>
        )}

        {/* Floating Compare Selection Panel */}
        {comparedSlugs.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl px-6 py-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-8 max-w-lg w-[90%] font-sans">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-widest">Interactive Compare</span>
              <span className="font-semibold text-sm block mt-0.5">{comparedSlugs.length} of 3 assets selected</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setComparedSlugs([])}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-all"
              >
                Clear
              </button>
              <button
                onClick={() => navigateTo("compare")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all flex items-center space-x-1.5"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

      </div>
    );
  };

  // 3. PROJECT DETAIL VIEW RENDER (GEO target compliance)
  const renderProjectDetailView = () => {
    const project = projects.find((p) => p.slug === activeSlug);
    return (
      <ProjectDetailView
        project={project}
        projects={projects}
        navigateTo={navigateTo}
        currency={currency}
        convertPriceStr={convertPriceStr}
        convertPsfStr={convertPsfStr}
        aiAssistantOpen={aiAssistantOpen}
        setAiAssistantOpen={setAiAssistantOpen}
      />
    );
  };

  // 4. COMPARE VIEW RENDER
  const renderCompareView = () => {
    const selectedProjects = projects.filter((p) => comparedSlugs.includes(p.slug));

    // Determinstic AI Analyst Highlight logic
    const getAISuggestionForCompare = (proj: Project) => {
      const isRts = proj.transportation.toLowerCase().includes("rts") || proj.key_features.toLowerCase().includes("rts");
      const isShortTerm = proj.project_type.toLowerCase().includes("airbnb") || proj.key_features.toLowerCase().includes("airbnb");
      const psfNum = parseInt(proj.price_psf.replace(/[^0-9]/g, "")) || 0;

      if (isRts) {
        return { tag: "Best for Singapore Commuters", notes: "Immediate corridor transit premium makes this the ultimate choice for daily cross-border workers." };
      }
      if (isShortTerm) {
        return { tag: "Best for High-Yield Airbnb", notes: "Zoned specifically to support short-term hotel bookings, yielding superior cashflow returns." };
      }
      if (psfNum > 0 && psfNum < 1000) {
        return { tag: "Best Capital Asset Value", notes: "Extremely competitive entry PSF, providing robust downside protection and capital growth potentials." };
      }
      return { tag: "Premium Own-Stay Luxury", notes: "Low units-per-floor density, high-end finishing spec, and quiet residential zoning." };
    };

    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans">
        
        {/* Header Title */}
        <div className="border-b border-slate-100 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Analysis Matrix</span>
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-1">Side-by-Side Asset Comparison</h2>
          </div>
          <button 
            onClick={() => setComparedSlugs([])}
            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full border border-red-100/30 flex items-center space-x-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Comparative Board</span>
          </button>
        </div>

        {selectedProjects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
            <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800 text-sm mb-1">Comparison Matrix is Empty</h4>
            <p className="text-xs text-slate-500 mb-6">Select up to 3 projects from the listings board to match specs side-by-side.</p>
            <button 
              onClick={() => navigateTo("projects")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm"
            >
              Select Properties
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-100 rounded-2xl overflow-hidden bg-white text-xs text-left shadow-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-sm">
                  <th className="p-4 font-semibold border-b border-slate-800">Specifications</th>
                  {selectedProjects.map((proj) => (
                    <th key={proj.slug} className="p-4 font-semibold border-b border-slate-800 text-center w-72">
                      <div className="font-sans text-base block font-bold truncate">{proj.project_name}</div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block tracking-wider uppercase font-normal">{proj.developer}</span>
                    </th>
                  ))}
                  {/* Empty slots placeholders */}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <th key={idx} className="p-4 border-b border-slate-800 text-slate-500 font-mono font-normal text-center w-72">
                      Slot Empty
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                
                {/* AI Tag Layer row */}
                <tr className="bg-blue-50/30">
                  <td className="p-4 font-bold text-blue-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span>AI Highlight tag</span>
                  </td>
                  {selectedProjects.map((proj) => {
                    const advice = getAISuggestionForCompare(proj);
                    return (
                      <td key={proj.slug} className="p-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 font-extrabold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider mb-2">
                          {advice.tag}
                        </span>
                        <p className="text-[10px] leading-relaxed text-slate-500 text-left max-w-[240px] mx-auto font-sans font-normal">
                          {advice.notes}
                        </p>
                      </td>
                    );
                  })}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Micro Area */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">District Area</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-semibold text-slate-800">{proj.area}</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Price range */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Starting Price</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-bold text-slate-900 text-sm">
                      {convertPriceStr(proj.price_min, currency)}
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Price PSF */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Price PSF</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-mono font-semibold">{convertPsfStr(proj.price_psf, currency)}</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Tenure */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Tenure Land Title</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-semibold">{proj.tenure} ({proj.land_title})</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Bedrooms Space</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-semibold">{proj.bedrooms} Beds</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Built-up */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Built Up Range</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-mono">{proj.built_up_min} - {proj.built_up_max} sqft</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Density (Units per floor) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Density & Lifts</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center">{proj.units_per_floor || "Verified Pending"} units / floor ({proj.lift_per_floor || "N/A"} lifts)</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Maintenance Fee */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Maintenance Levy</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center font-mono">{proj.maintenance_fee || "Verification Pending"}</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Transit connectivity */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Transit Proximity</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-slate-600 text-[10px] leading-relaxed max-w-[200px] text-center mx-auto">{proj.transportation}</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Land Size */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Land Footprint</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center">{proj.land_size || "Verification Pending"}</td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">--</td>
                  ))}
                </tr>

                {/* Actions row */}
                <tr>
                  <td className="p-4 font-semibold text-slate-500 font-mono uppercase">Explore Actions</td>
                  {selectedProjects.map((proj) => (
                    <td key={proj.slug} className="p-4 text-center">
                      <div className="flex flex-col space-y-2 justify-center items-center">
                        <button
                          onClick={() => navigateTo(`projects/${proj.slug}`)}
                          className="bg-slate-900 text-white font-bold px-4 py-2 rounded-full w-44 hover:bg-slate-800 text-[10px] uppercase tracking-wider"
                        >
                          Explore Details
                        </button>
                        <button
                          onClick={() => handleCompareToggle(proj.slug)}
                          className="text-red-600 hover:underline text-[10px]"
                        >
                          Remove Slot
                        </button>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedProjects.length }).map((_, idx) => (
                    <td key={idx} className="p-4 text-slate-400 text-center font-mono">Slot Available</td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>
    );
  };

  // 5. AREA GUIDE DETAIL VIEW RENDER
  const renderAreaView = () => {
    const guide = areaGuides.find((a) => a.slug === activeSlug);
    if (!guide) {
      return (
        <div className="text-center py-20">
          <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">Area Guide Not Found</h3>
          <button onClick={() => navigateTo("home")} className="text-blue-600 text-sm font-semibold underline mt-2">
            Back to Home
          </button>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans space-y-12 text-left">
        <button
          onClick={() => navigateTo("home")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <div className="space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Micro Area Masterclass Guide</span>
          <h2 className="font-sans text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">{guide.name}</h2>
          <p className="text-slate-500 text-sm max-w-xl">{guide.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <span className="text-slate-500 uppercase block">RTS Station Distance</span>
            <span className="text-xl font-bold text-slate-900 block mt-1.5">{guide.rtsDistance}</span>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <span className="text-slate-500 uppercase block">Woodlands CIQ Distance</span>
            <span className="text-xl font-bold text-slate-900 block mt-1.5">{guide.ciqDistance}</span>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <span className="text-slate-500 uppercase block">Connectivity Index</span>
            <span className="text-xl font-bold text-blue-600 block mt-1.5">{guide.connectivityScore}</span>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <span className="text-slate-500 uppercase block">Gross Rental Yield</span>
            <span className="text-xl font-bold text-emerald-600 block mt-1.5">{guide.averageYield}</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-6">
          <h3 className="font-bold text-xl">Connectivity Highlights & Catalysts</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            {guide.highlights.map((hl, i) => (
              <li key={i} className="flex items-start space-x-3">
                <CheckSquare className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Zoned Projects in this area */}
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-xl tracking-tight">Investable Projects in this Micro-market</h3>
          <p className="text-slate-500 text-xs">The following premium property acquisitions are fully zoned and approved within the {guide.name} sector:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.filter(p => {
              const projArea = p.area.toLowerCase();
              const guideName = guide.name.toLowerCase();
              return projArea.includes(guideName) || guideName.includes(projArea) ||
                     (guide.slug === "ciq" && projArea.includes("ciq")) ||
                     (guide.slug === "bukit-chagar" && projArea.includes("chagar")) ||
                     (guide.slug === "rts" && projArea.includes("rts"));
            }).map((p) => (
              <div 
                key={p.slug}
                onClick={() => navigateTo(`projects/${p.slug}`)}
                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 overflow-hidden bg-slate-100">
                    <img src={getProjectCoverImage(p)} alt={p.project_name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">{p.project_type}</span>
                    <h4 className="font-sans font-semibold text-slate-800 group-hover:text-blue-600 text-sm leading-snug truncate">{p.project_name}</h4>
                    <p className="text-slate-400 text-xs font-mono">{p.price_min} - {p.price_max}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Explore Technical Specs</span>
                  <span>&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 6. DEVELOPER PROFILE RENDER
  const renderDeveloperView = () => {
    const profile = developerProfiles.find((d) => d.slug === activeSlug);
    if (!profile) {
      return (
        <div className="text-center py-20">
          <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">Developer Profile Not Found</h3>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans space-y-8 text-left">
        <button
          onClick={() => navigateTo("home")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <div className="space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">Legendary Builder Legacy</span>
          <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">{profile.name}</h2>
          <p className="text-xs text-slate-400 font-mono">Inception Year: {profile.established}</p>
        </div>

        <p className="text-slate-600 leading-relaxed text-sm">{profile.description}</p>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Key Professional Accolades</h3>
          <ul className="space-y-2 text-xs text-slate-600 font-semibold font-mono">
            {profile.awards.map((aw, i) => (
              <li key={i} className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{aw}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer's Active Projects list */}
        <div className="space-y-6 pt-4">
          <h3 className="font-bold text-slate-900 text-xl tracking-tight">Active Developments in Johor Bahru</h3>
          <p className="text-slate-500 text-xs">Explore current luxury high-rise acquisitions masterplanned by {profile.name}:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.filter(p => {
              const projDev = p.developer.toLowerCase();
              const profName = profile.name.toLowerCase();
              // Fuzzy developer match
              return projDev.includes(profName.split(" ")[0]) || profName.includes(projDev.split(" ")[0]);
            }).map((p) => (
              <div 
                key={p.slug}
                onClick={() => navigateTo(`projects/${p.slug}`)}
                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-md transition-all flex items-center space-x-4 shadow-sm"
              >
                <div className="h-16 w-16 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <img src={getProjectCoverImage(p)} alt={p.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-[9px] font-mono font-bold text-blue-600 uppercase block">{p.project_type}</span>
                  <span className="block font-semibold text-slate-800 text-sm truncate">{p.project_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.price_min} - {p.price_max}</span>
                </div>
                <span className="text-blue-600 font-bold text-xs shrink-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 7. BUYING GUIDES VIEW RENDER
  const renderBuyingGuidesView = () => {
    const type = activeSlug; // "malaysian-buyer", "singaporean-commuter", "foreigner-investor"

    return (
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 font-sans space-y-8 text-left leading-relaxed">
        <button
          onClick={() => navigateTo("home")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        {type === "malaysian-buyer" && (
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase">National Acquisition Path</span>
            <h2 className="font-sans text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">Malaysian Citizens Buying Guide</h2>
            
            <p className="text-slate-600 text-sm">
              Malaysian citizens enjoy maximum financing ease and zero state-level minimum purchase restrictions.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2 mt-6">Financing & Lending Terms</h3>
            <p className="text-slate-500 text-sm">
              Local banks comfortably finance up to 90% of the net property valuation for first-time buyers. Annual mortgage interest rates hover between 3.6% to 4.2% based on standard amortization guidelines.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">EPF Account 2 Withdrawal</h3>
            <p className="text-slate-500 text-sm">
              Buyers can withdraw up to 100% of their EPF (Employees Provident Fund) Account 2 balance to offset the initial 10% downpayment or pay down the outstanding bank loan balance.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">RPGT (Real Property Gains Tax)</h3>
            <p className="text-slate-500 text-sm">
              Under current tax structures: Gains on disposal within 3 years of acquisition are taxed at 30%; 4th year is taxed at 20%; 5th year is taxed at 15%; and after 5 years, Malaysian citizens enjoy a 0% RPGT exemption on residential assets.
            </p>
          </div>
        )}

        {type === "singaporean-commuter" && (
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-purple-600 uppercase">Bilateral Transit Path</span>
            <h2 className="font-sans text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">Singaporean Commuters Guide</h2>
            
            <p className="text-slate-600 text-sm">
              A bespoke guide for Singapore Citizens and Permanent Residents looking to leverage the Woodlands RTS Link to enjoy high-quality living at reduced living expenditures.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2 mt-6">RTS Link Commuter Metrics</h3>
            <p className="text-slate-500 text-sm">
              The Rapid Transit System (RTS) Link at Bukit Chagar connects directly to Woodlands North MRT Station in Singapore. With a travel duration of just 5 minutes, daily cross-border commuting is fully reliable, completely avoiding Causeways road congestion.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">HDB Ownership Regulations</h3>
            <p className="text-slate-500 text-sm">
              Under Singapore's HDB regulations, owners of HDB flats must fully satisfy their 5-year Minimum Occupation Period (MOP) before they can legally acquire private properties abroad (including in Johor Bahru).
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">Banking & Cross-Border Wealth</h3>
            <p className="text-slate-500 text-sm">
              Singapore Dollars (SGD) carry a dominant exchange rate premium against the Malaysian Ringgit (MYR). Major global banks offer custom mortgage facilities tailored for foreign income profiles under standard expat lending terms.
            </p>
          </div>
        )}

        {type === "foreigner-investor" && (
          <div className="space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-600 uppercase">Global Capital Path</span>
            <h2 className="font-sans text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">Foreign Investor Acquisition Portal</h2>
            
            <p className="text-slate-600 text-sm">
              A specialized regulatory brief detailing acquisition policies for foreign nationals and international funds.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2 mt-6">Minimum Purchase Threshold (RM 1M Rule)</h3>
            <p className="text-slate-500 text-sm">
              Foreigners are legally permitted to acquire private residential assets in the state of Johor subject to a minimum purchase value threshold of **RM 1,000,000** for standard apartments (or RM 2,000,000 for landed estates in select areas).
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">State Levy Approvals</h3>
            <p className="text-slate-500 text-sm">
              All property acquisitions by foreign buyers require official state consent, which incurs a standard state consent levy of 2% of the purchase price, to be fully settled prior to transaction closing.
            </p>

            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">MM2H (Malaysia My Second Home)</h3>
            <p className="text-slate-500 text-sm">
              The prestigious MM2H visa program provides long-term 5 to 15-year residency passes for foreigners who meet specified financial deposits. MM2H holders enjoy streamlined property consent approvals and tax-friendly capital transfers.
            </p>
          </div>
        )}
      </div>
    );
  };

  // 8. BLOG LIST VIEW RENDER
  const renderBlogView = () => {
    // Get translated and expanded blog posts
    const translatedPosts = blogPosts.map((post) => getTranslatedBlog(post, language));

    // Filtered posts based on search and category
    const filteredPosts = translatedPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                            post.summary.toLowerCase().includes(blogSearch.toLowerCase()) ||
                            post.content.toLowerCase().includes(blogSearch.toLowerCase());
      const matchesCategory = selectedBlogCategory === "All" || post.category === selectedBlogCategory;
      return matchesSearch && matchesCategory;
    });

    // Extract categories
    const categories = ["All", ...Array.from(new Set(translatedPosts.map((p) => p.category)))];

    // Featured Article (the first one)
    const featuredPost = translatedPosts[0];

    // Popular Articles (next 4)
    const popularPosts = translatedPosts.slice(1, 5);

    // Latest Articles (excluding featured if no search, otherwise all matching)
    const latestPosts = blogSearch || selectedBlogCategory !== "All" 
      ? filteredPosts 
      : filteredPosts.filter(p => p.slug !== featuredPost.slug);

    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans space-y-12 text-left">
        {/* Blog Header Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Building2 className="h-96 w-96 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">Strategic Market Intelligence</span>
            <h2 className="font-sans text-3xl md:text-5xl font-semibold tracking-tight leading-tight">Johor Bahru Property Insights Portal</h2>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              In-depth research reports, policy updates, and cross-border real estate guides for Singaporeans, local Malaysians, and international wealth advisory clients.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              placeholder="Search articles, keywords, policy guidelines..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedBlogCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                  selectedBlogCategory === cat
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article Section (Only displayed when no filters are active) */}
        {!blogSearch && selectedBlogCategory === "All" && featuredPost && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span>Editor's Featured Analysis</span>
            </h3>
            <div 
              onClick={() => navigateTo(`blog/${featuredPost.slug}`)}
              className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="lg:col-span-7 h-64 lg:h-96 rounded-2xl overflow-hidden bg-slate-100">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-mono font-bold text-blue-600">
                    <span className="bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">{featuredPost.category}</span>
                    <span>&middot;</span>
                    <span>{featuredPost.date}</span>
                  </div>
                  <h4 className="font-sans font-semibold text-slate-900 text-xl lg:text-3xl leading-snug group-hover:text-blue-600 transition-colors">
                    {featuredPost.title}
                  </h4>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {featuredPost.summary}
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-700">By RTS Editorial Team</span>
                    <span>&middot;</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center space-x-1.5 mt-6 lg:mt-0">
                  <span>Analyze Full Investigation Report</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Primary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Main (8 cols): Articles Grid */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">
              {blogSearch || selectedBlogCategory !== "All" ? "Filtered Research Results" : "Latest Strategic Intel"}
            </h3>

            {latestPosts.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2">
                <Info className="h-8 w-8 mx-auto text-slate-400" />
                <h5 className="font-semibold text-sm text-slate-800">No Articles Match Your Search Criteria</h5>
                <p className="text-xs max-w-md mx-auto">Try typing alternative terms or selecting a different category from the filters above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <div 
                    key={post.slug} 
                    onClick={() => navigateTo(`blog/${post.slug}`)}
                    className="group cursor-pointer rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 overflow-hidden bg-slate-100">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          <span className="text-blue-600 font-bold">{post.category}</span>
                          <span>{post.date}</span>
                        </div>
                        <h4 className="font-sans font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs border-t border-slate-50">
                      <span className="text-slate-400 font-mono">{post.readTime}</span>
                      <span className="font-bold text-blue-600 group-hover:underline flex items-center space-x-1">
                        <span>Read Report</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols): Popular Articles & Related Items */}
          <div className="lg:col-span-4 space-y-10">
            {/* Popular Articles List */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-5">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight border-b border-slate-200/60 pb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Highly Read Analysis</span>
              </h4>
              <div className="space-y-4">
                {popularPosts.map((post, idx) => (
                  <div 
                    key={post.slug}
                    onClick={() => navigateTo(`blog/${post.slug}`)}
                    className="flex items-start space-x-3 group cursor-pointer border-b border-slate-100 pb-3 last:border-none last:pb-0"
                  >
                    <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-blue-600 transition-colors">0{idx + 1}</span>
                    <div className="space-y-1 flex-1">
                      <h5 className="font-sans font-medium text-slate-800 text-xs leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400">{post.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Projects Links */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">Hot Investment Projects</h4>
              <div className="space-y-3">
                {projects.slice(0, 4).map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => navigateTo(`projects/${p.slug}`)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded bg-slate-100 overflow-hidden shrink-0">
                      <img src={getProjectCoverImage(p)} alt={p.project_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate flex-1">
                      <span className="block text-xs font-semibold text-slate-800 truncate">{p.project_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.price_min}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Related Area Guides Links */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">Johor Bahru Area Guides</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {areaGuides.map((guide) => (
                  <button
                    key={guide.slug}
                    onClick={() => navigateTo(`area/${guide.slug}`)}
                    className="p-2 border border-slate-100 hover:border-blue-500 hover:bg-blue-50/20 text-slate-700 font-semibold rounded-xl text-center cursor-pointer transition-all truncate"
                  >
                    {guide.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlogDetailView = () => {
    const rawBlog = blogPosts.find((b) => b.slug === activeSlug);
    if (!rawBlog) {
      return (
        <div className="text-center py-20 font-sans">
          <Info className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800">Article Not Found</h3>
          <button onClick={() => navigateTo("blog")} className="text-blue-600 text-xs font-bold underline mt-2 cursor-pointer">
            Return to Insights List
          </button>
        </div>
      );
    }

    const blog = getTranslatedBlog(rawBlog, language);

    // Related articles (matching same category or general)
    const relatedArticles = blogPosts
      .filter((b) => b.slug !== rawBlog.slug)
      .slice(0, 3)
      .map((b) => getTranslatedBlog(b, language));

    // Schema SEO Description injection simulation
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.summary,
      "image": blog.image,
      "datePublished": blog.date,
      "author": {
        "@type": "Person",
        "name": "RTS Premium Gateway",
        "jobTitle": "Senior Cross-Border Property Analyst"
      }
    };

    return (
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 font-sans space-y-10 text-left">
        {/* Dynamic Schema Injection (Hidden) */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>

        {/* Breadcrumb (Fulfills exact requirement) */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
          <button onClick={() => navigateTo("home")} className="hover:text-blue-600 cursor-pointer">Home</button>
          <span>&rsaquo;</span>
          <button onClick={() => navigateTo("blog")} className="hover:text-blue-600 cursor-pointer">Blog Insights</button>
          <span>&rsaquo;</span>
          <span className="text-slate-800 truncate max-w-xs md:max-w-md">{blog.title}</span>
        </div>

        {/* Back and Author Layout Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigateTo("blog")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Insights</span>
          </button>

          <div className="space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold font-mono uppercase inline-block">
              {blog.category}
            </span>
            <h1 className="font-sans text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Author metadata & specs */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-b border-slate-100 py-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xs">RTS</div>
              <div>
                <span className="block font-semibold text-slate-800">RTS Editorial Team</span>
                <span className="text-slate-400 text-[10px]">Senior Cross-Border Property Analyst</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Published {blog.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Info className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="h-[300px] md:h-[450px] rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40 mb-6 md:mb-10">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>

        {/* Content & Social Share Buttons side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content body (8 cols) */}
          <div className="lg:col-span-9 max-w-none text-slate-700">
            {renderMarkdownContent(blog.content)}
          </div>

          {/* Sticky social share and quick metrics (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Social Share Buttons */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Share Article</span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl font-semibold transition-colors block cursor-pointer"
                >
                  Facebook
                </a>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl font-semibold transition-colors block cursor-pointer"
                >
                  WhatsApp
                </a>
                <a 
                  href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-xl font-semibold transition-colors block col-span-2 cursor-pointer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Quick Agent Callout */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse mb-1" />
              <h5 className="font-semibold text-xs text-slate-200">Got acquisition questions?</h5>
              <a 
                href="https://wa.me/60195598932?text=Hi,%20I%20just%20read%20your%20article%20on%20and%20want%20to%20consult%20buying."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Chat with Advisor (WhatsApp)
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section (Fulfills exact requirement) */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl space-y-6 border border-teal-500/10">
          <div className="relative z-10 space-y-3 max-w-xl">
            <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">{getTranslation(language, "wealthIntel")}</span>
            <h3 className="font-sans text-xl md:text-3xl font-semibold tracking-tight">{getTranslation(language, "personalizedAppraisal")}</h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              {getTranslation(language, "appraisalDesc")}
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4">
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              {getTranslation(language, "consultAdvisor")}
            </button>
            <a
              href="https://wa.me/60195598932?text=Hi,%20I%20want%20a%20personal%20property%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 font-bold text-xs px-6 py-3 rounded-xl transition-all inline-block text-center cursor-pointer"
            >
              Connect via WhatsApp
            </a>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-lg">Recommended Research Reports</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.slug}
                onClick={() => navigateTo(`blog/${rel.slug}`)}
                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-32 overflow-hidden bg-slate-100">
                  <img 
                    src={rel.image} 
                    alt={rel.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[9px] font-mono font-bold uppercase text-blue-600 block">{rel.category}</span>
                  <h5 className="font-sans font-semibold text-slate-900 text-xs leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h5>
                </div>
                <div className="p-4 pt-0 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{rel.readTime}</span>
                  <span className="text-blue-600 font-bold group-hover:underline">Read &rsaquo;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  // 9. ADMIN PANEL VIEW RENDER
  const renderAdminView = () => {
    return (
      <AdminView
        projects={projects}
        setProjects={setProjects}
        fetchLiveProjects={fetchLiveProjects}
      />
    );
  };

  return (
    <div className="min-h-screen bg-brand-light text-brand-slate flex flex-col justify-between selection:bg-brand-blue selection:text-white relative overflow-hidden">
      
      {/* Floating Glowing Blobs for Frosted Glass visual effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-1" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-2" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-1" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* Navigation Top Header */}
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          currency={currency}
          setCurrency={setCurrency}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Main Content viewport */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (activeSlug || "")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {currentView === "home" && renderHomeView()}
              {currentView === "projects" && renderProjectsView()}
              {currentView === "project-detail" && renderProjectDetailView()}
              {currentView === "compare" && renderCompareView()}
              {currentView === "area" && renderAreaView()}
              {currentView === "developer" && renderDeveloperView()}
              {currentView === "buying-guides" && renderBuyingGuidesView()}
              {currentView === "blog" && renderBlogView()}
              {currentView === "blog-detail" && renderBlogDetailView()}
              {currentView === "admin" && renderAdminView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Developer Preview Admin Console Button */}
        {(typeof window !== "undefined" && (
          window.location.hostname.includes("localhost") ||
          window.location.hostname.includes("127.0.0.1") ||
          window.location.hostname.includes("ais-dev-") ||
          window.location.hostname.includes("run.app") ||
          window.location.hash === "#admin"
        )) && (
          <div className="fixed bottom-6 left-6 z-40">
            <button
              onClick={() => navigateTo(currentView === "admin" ? "home" : "admin")}
              className={`flex h-12 items-center space-x-2 rounded-full px-4 text-xs font-bold shadow-2xl hover:scale-105 transition-all border ${
                currentView === "admin"
                  ? "bg-red-600 text-white border-red-500 shadow-red-500/20"
                  : "bg-slate-900/95 backdrop-blur-md text-slate-200 border-slate-800 hover:bg-slate-800 shadow-black/40"
              }`}
              title="Developer Preview Admin Console (Hidden in Public)"
            >
              <Settings className={`h-4.5 w-4.5 ${currentView === "admin" ? "animate-spin" : ""}`} />
              <span>{currentView === "admin" ? "Exit Admin" : "Admin Console"}</span>
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping absolute -top-1 -right-1" />
            </button>
          </div>
        )}

        {/* Global Quick Action Bubble Floating WhatsApp */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          <a
            href="https://wa.me/60195598932?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20this%20Johor%20Bahru%20property%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white shadow-2xl hover:scale-105 transition-all"
            title="Direct Consultant WhatsApp Connection"
          >
            <Phone className="h-6 w-6 animate-pulse" />
          </a>
        </div>

        {/* Premium Footer section */}
        <Footer onNavigate={navigateTo} />
      </div>

    </div>
  );
}
