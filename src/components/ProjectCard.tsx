import React from "react";
import { MapPin, Sparkles, Building, Compass, Plus, Minus, Landmark, CheckSquare, Square } from "lucide-react";
import { Project } from "../types";
import { getDirectDriveImage, getProjectCoverImage } from "../utils";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (slug: string) => void;
  onCompareToggle: (slug: string) => void;
  isCompared: boolean;
  activeCurrency: string;
}

// Exchange rates: 1 unit of foreign currency = X MYR
const rates: Record<string, number> = {
  MYR: 1.0,
  SGD: 3.45,
  USD: 4.65,
  CNY: 0.65
};

export default function ProjectCard({
  project,
  onViewDetails,
  onCompareToggle,
  isCompared,
  activeCurrency,
}: ProjectCardProps) {
  
  // Parse numeric minimum price to calculate conversion
  const parsePrice = (priceStr: string) => {
    try {
      const cleaned = priceStr.replace(/[^0-9]/g, "");
      return parseInt(cleaned) || 0;
    } catch {
      return 0;
    }
  };

  const basePriceNum = parsePrice(project.price_min);
  const convertedPriceNum = Math.round(basePriceNum / (rates[activeCurrency] || 1));

  // Currency Formatter
  const formatVal = (val: number, cur: string) => {
    const symbols: Record<string, string> = {
      MYR: "RM ",
      SGD: "S$ ",
      USD: "$ ",
      CNY: "¥ "
    };
    return (symbols[cur] || "") + val.toLocaleString("en-US");
  };

  // Deterministic "AI Logic Layer" Highlights based on spreadsheet fields
  const getAISuggestedTag = () => {
    const isShortTerm = project.project_type.toLowerCase().includes("airbnb") || project.key_features.toLowerCase().includes("airbnb");
    const isRtsLinked = project.transportation.toLowerCase().includes("rts") || project.transportation.toLowerCase().includes("ciq") || project.key_features.toLowerCase().includes("rts");
    
    if (isRtsLinked) {
      return { text: "Best for Singapore Commuters", style: "from-rose-500 to-purple-600 text-white" };
    }
    if (isShortTerm) {
      return { text: "Best for Airbnb Rental Yield", style: "from-pink-500 to-rose-600 text-white" };
    }
    const psfNum = parseInt(project.price_psf.replace(/[^0-9]/g, "")) || 0;
    if (psfNum > 0 && psfNum < 1000) {
      return { text: "High ROI / Best Value", style: "from-purple-500 to-pink-500 text-white" };
    }
    return { text: "Premium Luxury Layout", style: "from-rose-600 to-purple-700 text-white" };
  };

  const aiTag = getAISuggestedTag();

  const getCoverImage = () => {
    return getProjectCoverImage(project);
  };

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl glass-card glass-card-hover font-sans"
      id={`project-card-${project.slug}`}
    >
      
      {/* Top Image Banner */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={getCoverImage()}
          alt={project.project_name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* AI suggested structural tags overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center space-x-1.5 rounded-full bg-gradient-to-r ${aiTag.style} px-3.5 py-1.5 text-[10px] font-bold shadow-md uppercase tracking-wider`}>
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>{aiTag.text}</span>
          </span>
        </div>

        {/* Selected-for-Compare button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle(project.slug);
          }}
          className="absolute top-4 right-4 z-10 flex h-9 px-3 items-center justify-center space-x-1.5 rounded-full bg-white/75 backdrop-blur-md text-slate-800 hover:bg-white text-[10px] font-semibold shadow-md border border-slate-200/40 transition-all"
          id={`compare-btn-${project.slug}`}
        >
          {isCompared ? (
            <>
              <CheckSquare className="h-3.5 w-3.5 text-brand-blue fill-blue-50" />
              <span className="text-brand-blue font-bold">Selected</span>
            </>
          ) : (
            <>
              <Square className="h-3.5 w-3.5 text-slate-500" />
              <span>Compare</span>
            </>
          )}
        </button>

        {/* Tenure and Completion Status Overlay */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="rounded bg-slate-900/75 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase font-mono tracking-wider border border-white/10">
            {project.tenure}
          </span>
          <span className="rounded bg-brand-blue/75 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase font-mono tracking-wider border border-white/10">
            {project.completion_status}
          </span>
        </div>
      </div>

      {/* Card Content body */}
      <div className="flex flex-1 flex-col p-6">
        
        {/* District and Area details */}
        <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-mono tracking-wide uppercase mb-2">
          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{project.area}</span>
        </div>

        {/* Title */}
        <h3 className="font-sans font-semibold text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2">
          {project.project_name}
        </h3>

        {/* Developer label */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
          <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate font-medium">{project.developer}</span>
        </div>

        {/* Highlights block */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-6 text-sm text-slate-600">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Layout Space</span>
            <span className="font-semibold text-slate-800">{project.bedrooms} Bedrooms</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Built Up</span>
            <span className="font-semibold text-slate-800">{project.built_up_min} - {project.built_up_max} sqft</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Price PSF</span>
            <span className="font-semibold text-slate-800">{project.price_psf}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Finishing Year</span>
            <span className="font-semibold text-slate-800">{project.completion_year}</span>
          </div>
        </div>

        {/* Footer pricing and call-to-action button */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-mono block">Starting Price</span>
            <span className="font-sans text-lg font-bold tracking-tight text-slate-900">
              {formatVal(convertedPriceNum, activeCurrency)}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(project.slug)}
            className="flex items-center space-x-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-full transition-all border border-blue-100/50"
            id={`view-details-${project.slug}`}
          >
            <span>Explore Details</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>

    </div>
  );
}
