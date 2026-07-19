import React, { useEffect, useRef, useState } from "react";
import { MapPin, Info, AlertCircle } from "lucide-react";

interface OSMMapProps {
  coordinateString: string; // e.g. "1.467804, 103.758962"
  projectName: string;
  address: string;
  priceRange: string;
}

// Global cached promise for loading Leaflet assets to prevent race conditions or duplicate script injections
let leafletLoadPromise: Promise<any> | null = null;

function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("DOM is not available"));
  }
  
  if ((window as any).L) {
    return Promise.resolve((window as any).L);
  }

  if (!leafletLoadPromise) {
    leafletLoadPromise = new Promise<any>((resolve, reject) => {
      // Inject Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const cssLink = document.createElement("link");
        cssLink.id = "leaflet-css";
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(cssLink);
      }

      // Inject Leaflet JS
      const script = document.createElement("script");
      script.id = "leaflet-js-script";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        // Polling helper to ensure L is fully attached to window before resolving
        let retries = 0;
        const interval = setInterval(() => {
          const L = (window as any).L;
          if (L) {
            clearInterval(interval);
            resolve(L);
          } else if (retries > 50) {
            clearInterval(interval);
            reject(new Error("Leaflet script loaded, but global L was not found on window."));
          }
          retries++;
        }, 30);
      };
      script.onerror = (err) => {
        leafletLoadPromise = null; // Clear cached promise on failure to allow retry
        reject(err);
      };
      document.body.appendChild(script);
    });
  }

  return leafletLoadPromise;
}

export default function OSMMap({ coordinateString, projectName, address, priceRange }: OSMMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Parse coordinate string safely
  let lat = 1.467804;
  let lng = 103.758962;
  try {
    if (coordinateString) {
      const parts = coordinateString.split(",");
      if (parts.length === 2) {
        lat = parseFloat(parts[0].trim());
        lng = parseFloat(parts[1].trim());
      }
    }
  } catch (err) {
    console.error("Failed to parse coordinate string:", coordinateString, err);
  }

  useEffect(() => {
    // If we're on server side, return
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let mapInstance: any = null;
    let isCancelled = false;

    const loadLeafletAndInit = async () => {
      try {
        const L = await loadLeaflet();
        if (isCancelled || !mapContainerRef.current) return;

        // Empty container before mount to make sure no duplicate initialization occurs
        mapContainerRef.current.innerHTML = "";
        const mapDiv = document.createElement("div");
        mapDiv.style.width = "100%";
        mapDiv.style.height = "100%";
        mapContainerRef.current.appendChild(mapDiv);

        // Initialize map
        mapInstance = L.map(mapDiv, {
          center: [lat, lng],
          zoom: 15,
          scrollWheelZoom: false
        });

        // Add OSM tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        // Custom icon styling
        const customIcon = L.divIcon({
          html: `<div class="flex h-10 w-10 items-center justify-center bg-blue-600 rounded-full border-2 border-white text-white shadow-md animate-bounce">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                 </div>`,
          className: "custom-leaflet-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        // Add Marker
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance);
        
        // Add elegant Popup
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
            <h4 style="margin: 0 0 4px; font-weight: 700; color: #1e293b; font-size: 13px;">${projectName}</h4>
            <p style="margin: 0 0 6px; font-size: 11px; color: #64748b;">${address}</p>
            <div style="font-weight: 600; font-size: 11px; color: #db2777;">Est. ${priceRange}</div>
          </div>
        `, { closeButton: false }).openPopup();

        setIsLoaded(true);
        setMapError(false);
      } catch (err) {
        console.error("Error setting up Leaflet OpenStreetMap:", err);
        if (!isCancelled) {
          setMapError(true);
        }
      }
    };

    loadLeafletAndInit();

    // Cleanup on unmount
    return () => {
      isCancelled = true;
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.warn("Error cleaning up map instance:", e);
        }
      }
    };
  }, [coordinateString, projectName, address, priceRange, lat, lng]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
      
      {/* Map Container mount point */}
      <div ref={mapContainerRef} className="w-full h-full z-10" id="openstreetmap-canvas" />

      {/* Loading Overlay */}
      {!isLoaded && !mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mb-4" />
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">Incepting Free OpenStreetMap coordinates...</p>
        </div>
      )}

      {/* Fallback Static Overlay if Leaflet or connection fails */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-slate-400 mb-3" />
          <h4 className="font-semibold text-slate-800 text-sm mb-1">Interactive Map Offline</h4>
          <p className="text-xs text-slate-500 max-w-sm mb-4">Coordinates: {coordinateString || "Information Pending Verification"}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(projectName + " " + address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
          >
            <span>Open in Google Maps Instead</span>
            <span>&rarr;</span>
          </a>
        </div>
      )}

      {/* Quick Stats Banner overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white rounded-xl p-3 shadow-md text-xs flex items-center space-x-3.5 border border-slate-800 max-w-[calc(100%-2rem)]">
        <div className="bg-blue-600/30 p-1.5 rounded-lg border border-blue-500/20 text-blue-400 shrink-0">
          <MapPin className="h-4 w-4" />
        </div>
        <div>
          <span className="font-semibold block font-mono">GPS Point</span>
          <span className="text-slate-400 text-[10px] font-mono">{coordinateString || "Information Pending Verification"}</span>
        </div>
      </div>

    </div>
  );
}
