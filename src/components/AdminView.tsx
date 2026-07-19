import React, { useState, useEffect } from "react";
import { Lock, RefreshCw, ExternalLink, LogOut, CheckCircle2, Sparkles, Folder, Image as ImageIcon, Layers } from "lucide-react";
import { Project, Enquiry } from "../types";
import { initAuth, googleSignIn, logout } from "../firebase-auth";
import { fetchAndMapDriveImages } from "../utils/drive-images-fetcher";
import { User } from "firebase/auth";

interface AdminViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  fetchLiveProjects: () => Promise<void>;
}

export default function AdminView({ projects, setProjects, fetchLiveProjects }: AdminViewProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [syncingStatus, setSyncingStatus] = useState(false);

  // Google Drive Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Drive image mapping states
  const [isMapping, setIsMapping] = useState(false);
  const [mappingProgress, setMappingProgress] = useState({ current: 0, total: 0, message: "" });
  const [mappingCompleted, setMappingCompleted] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Authentication failed. Please check popup permissions and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setMappingCompleted(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMapImages = async () => {
    if (!token) {
      alert("Please authenticate with Google first.");
      return;
    }

    setIsMapping(true);
    setMappingCompleted(false);
    try {
      const updated = await fetchAndMapDriveImages(
        projects,
        token,
        (current, total, message) => {
          setMappingProgress({ current, total, message });
        }
      );

      // Build mappings to persist on the server side
      const mappingsToSave: Record<string, any> = {};
      updated.forEach((proj) => {
        if (
          proj.hero_image || 
          proj.gallery_images || 
          proj.floorplan_images || 
          proj.facilities_images || 
          proj.location_images || 
          proj.progress_images
        ) {
          mappingsToSave[proj.slug] = {
            hero_image: proj.hero_image || null,
            overview_images: proj.overview_images || null,
            floorplan_images: proj.floorplan_images || null,
            facilities_images: proj.facilities_images || null,
            location_images: proj.location_images || null,
            progress_images: proj.progress_images || null,
            gallery_images: proj.gallery_images || null,
            image_url: proj.image_url || null,
            image: proj.image || null,
            img: proj.img || null,
            drive_image: proj.drive_image || null,
          };
        }
      });

      // Save mappings permanently on the server side
      const saveRes = await fetch("/api/projects/map-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings: mappingsToSave })
      });
      const saveData = await saveRes.json();
      if (!saveData.success) {
        console.error("Failed to save mappings on the server:", saveData.error);
      }

      setProjects(updated);
      setMappingCompleted(true);
    } catch (err: any) {
      console.error("Error mapping images:", err);
      alert(`Image mapping failed: ${err.message || err}`);
    } finally {
      setIsMapping(false);
    }
  };

  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (data.success && data.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const handleForceSync = async () => {
    setSyncingStatus(true);
    try {
      await fetchLiveProjects();
      alert("Success! Re-fetched Google Sheet data. Active listing prices and specifications refreshed in real-time.");
    } catch {
      alert("Failed to sync sheet.");
    } finally {
      setSyncingStatus(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 font-sans space-y-10 text-left">
      
      {/* Header Title */}
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            <span>RBAC Protected Control Station</span>
          </span>
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-slate-900 mt-1">Property Advisor Control Panel</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleForceSync}
            disabled={syncingStatus}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingStatus ? "animate-spin" : ""}`} />
            <span>Sync Google Sheets API</span>
          </button>
          <button
            onClick={loadEnquiries}
            className="text-slate-600 hover:text-slate-900 font-semibold text-xs border border-slate-200 bg-white px-4 py-2.5 rounded-full shadow-inner cursor-pointer"
          >
            Refresh Leads List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Bento: Mappings & Config */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Admin Stats Cards */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">Synchronizer Status</h4>
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-200/50">
                <span className="text-slate-400">Google Sheet Source</span>
                <span className="font-mono text-blue-600 font-semibold truncate max-w-[140px]" title="1_oL3NH6_trjZQnYnG9pjDnyJ7funxP1uSKehM5Ktv3Q">1_oL3NH6...Ktv3Q</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/50">
                <span className="text-slate-400">Total Loaded Listings</span>
                <span className="font-bold text-slate-800">{projects.length} Projects</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/50">
                <span className="text-slate-400">Total Enquiries Received</span>
                <span className="font-bold text-slate-800">{enquiries.length} Leads</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200/50">
                <span className="text-slate-400">Target Notification Mail</span>
                <span className="font-mono text-slate-600 font-semibold">shyanyeews@gmail.com</span>
              </div>
            </div>
            
            <a 
              href="https://docs.google.com/spreadsheets/d/1_oL3NH6_trjZQnYnG9pjDnyJ7funxP1uSKehM5Ktv3Q/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-blue-600 font-bold hover:underline pt-2"
            >
              <span>Inspect Master Google Sheet</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>

        {/* Right Bento: Leads & Real-time Assets preview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Google Drive Mapped Assets Preview */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 text-left">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <Folder className="h-4 w-4 text-amber-500" />
              <span>Mapped Project Media Assets</span>
            </h4>
            
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
              {projects.map((project) => {
                const hasDrive = project.hero_image || project.gallery_images || project.floorplan_images;
                
                return (
                  <div key={project.slug} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-all">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-sm">{project.project_name}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{project.developer} • {project.area}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {hasDrive ? (
                        <>
                          <div className={`px-2.5 py-1 rounded-full flex items-center space-x-1 text-[10px] ${project.hero_image ? "bg-red-50 text-red-700 border border-red-100" : "bg-slate-50 text-slate-400"}`}>
                            <ImageIcon className="h-3 w-3 shrink-0" />
                            <span>Hero: {project.hero_image ? "Linked" : "None"}</span>
                          </div>
                          
                          <div className={`px-2.5 py-1 rounded-full flex items-center space-x-1 text-[10px] ${project.gallery_images ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-50 text-slate-400"}`}>
                            <ImageIcon className="h-3 w-3 shrink-0" />
                            <span>Gallery: {project.gallery_images?.length || 0}</span>
                          </div>
                          
                          <div className={`px-2.5 py-1 rounded-full flex items-center space-x-1 text-[10px] ${project.floorplan_images ? "bg-green-50 text-green-700 border border-green-100" : "bg-slate-50 text-slate-400"}`}>
                            <Layers className="h-3 w-3 shrink-0" />
                            <span>Floorplans: {project.floorplan_images?.length || 0}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Unmapped (Using Unsplash Fallbacks)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enquiries Leads list */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Real-time Lead Ingress</h4>
            
            {loadingEnquiries ? (
              <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse text-xs text-slate-400">
                Retrieving active database leads...
              </div>
            ) : enquiries.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-400">
                No leads registered in active container memory yet. Form inquiries submit directly.
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm text-xs space-y-2.5 text-left">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div className="font-bold text-slate-900 text-sm">{enq.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">{new Date(enq.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-slate-600 font-medium">
                      <div>Email: <span className="text-slate-900 font-mono">{enq.email}</span></div>
                      <div>Phone: <span className="text-slate-900 font-mono">{enq.phone || "N/A"}</span></div>
                      <div>Project: <span className="text-slate-900 font-semibold">{enq.projectName}</span></div>
                      <div>Budget: <span className="text-slate-900 font-mono">{enq.budget || "N/A"}</span></div>
                      <div>Profile: <span className="text-slate-900">{enq.targetType}</span></div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-500 italic mt-2 text-xs leading-relaxed">
                      Message: "{enq.message || "No custom criteria provided."}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
