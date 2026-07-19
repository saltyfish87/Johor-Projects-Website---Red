import React from "react";
import { Mail, Phone, Youtube, CheckCircle2, Award, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          
          {/* Column 1: Brand Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center bg-gradient-to-br from-brand-blue to-purple-800 rounded-xl text-white font-display font-black text-base shadow-lg border border-white/20 shrink-0 tracking-widest">
                RTS
              </div>
              <div>
                <h3 className="font-display text-base font-bold tracking-tight leading-none uppercase">
                  RTS Premium Gateway
                </h3>
                <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-slate-350 font-bold mt-1.5 leading-none">
                  JB Real Estate Corridor
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Curating premium, high-yield transit-oriented developments (TOD) and luxury apartments in Johor Bahru. Bridging cross-border real estate excellence for Malaysian buyers, Singaporean commuters, and foreign investors.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://www.youtube.com/@shyanyee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-all"
                title="YouTube Profile"
              >
                <Youtube className="h-4.5 w-4.5" />
              </a>
              <a 
                href="mailto:shyanyeews@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all"
                title="Email Agent"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm tracking-wider uppercase">Market Portfolios</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate("projects")} className="hover:text-white transition-colors">
                  All JB Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("compare")} className="hover:text-white transition-colors">
                  Interactive Comparison Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("blog")} className="hover:text-white transition-colors">
                  Buying Guides & Market Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("projects")} className="hover:text-white transition-colors">
                  Transit-Oriented Overviews
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Area Overviews */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm tracking-wider uppercase">High-Growth Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate("area/ibrahim-international-business-district-iibd")} className="hover:text-white transition-colors text-left">
                  IIBD Financial District
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("area/jbcc-ciq-lumba-kuda")} className="hover:text-white transition-colors text-left">
                  RTS Bukit Chagar Terminus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("area/tanjung-puteri-waterfront")} className="hover:text-white transition-colors text-left">
                  Tanjung Puteri Marina
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("area/taman-pelangi-sri-tebrau")} className="hover:text-white transition-colors text-left">
                  Taman Pelangi & Sri Tebrau
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Professional Parameters */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm tracking-wider uppercase">Consultant Office</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2.5">
                <Phone className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-300 font-medium">Gateway Advisory Desk</p>
                  <p className="text-xs text-slate-500">Licensed Property Consultant</p>
                  <a href="tel:+60195598932" className="hover:text-white transition-all text-xs font-mono block mt-0.5">+60 19-559 8932</a>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-300 font-medium">Direct Email</p>
                  <a href="mailto:shyanyeews@gmail.com" className="hover:text-white transition-all text-xs font-mono block mt-0.5">shyanyeews@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-xl p-3 border border-slate-800">
                <Award className="h-5 w-5 text-yellow-500 shrink-0" />
                <span className="text-[11px] leading-tight text-slate-300">
                  Verified Johor-Singapore Special Economic Zone real estate advisor.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Compliance Disclaimers and Licenses */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="shrink-0 text-slate-500/80">
            &copy; {new Date().getFullYear()} RTS Premium Gateway. All rights reserved.
          </p>
        </div>

        {/* Built By signature */}
        <div className="mt-4 pt-4 border-t border-slate-800/30 text-center text-[10px] text-slate-600 flex items-center justify-center space-x-1.5 font-mono uppercase tracking-widest">
          <span>Crafted for cross-border elite investors</span>
          <span>&middot;</span>
          <Heart className="h-3 w-3 text-pink-600" />
          <span>&middot;</span>
          <span>Johor Bahru Southern Corridor</span>
        </div>
      </div>
    </footer>
  );
}
