import React from "react";
import { Compass, Sparkles, HelpCircle, Phone, Calculator, LayoutGrid, FileText, Settings, Globe } from "lucide-react";
import { getTranslation } from "../utils/translation";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Navbar({
  currentView,
  onNavigate,
  currency,
  setCurrency,
  language,
  setLanguage,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "projects", label: getTranslation(language, "properties"), icon: LayoutGrid },
    { id: "compare", label: getTranslation(language, "compare"), icon: Calculator },
    { id: "blog", label: getTranslation(language, "insights"), icon: FileText },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
        
        {/* Logo and Luxury Branding */}
        <div 
          className="flex cursor-pointer items-center space-x-3 animate-fade-in" 
          onClick={() => handleNavClick("home")}
          id="nav-logo"
        >
          <div className="flex h-11 w-11 items-center justify-center bg-gradient-to-br from-brand-blue to-purple-800 rounded-xl text-white font-display font-black text-base shadow-lg border border-white/20 shrink-0 tracking-widest">
            RTS
          </div>
          <div>
            <h1 className="font-display text-base font-black tracking-tight text-brand-slate leading-none uppercase bg-gradient-to-r from-brand-slate via-slate-700 to-brand-blue bg-clip-text text-transparent">
              RTS Premium Gateway
            </h1>
            <p className="font-sans text-[8px] uppercase tracking-[0.25em] text-brand-blue font-bold mt-1.5 leading-none">
              Johor Bahru Capital Corridor
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || currentView.startsWith(item.id + "/");
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold transition-all py-2 border-b-2 ${
                  isActive
                    ? "border-brand-blue text-brand-blue"
                    : "border-transparent text-slate-500 hover:text-brand-slate"
                }`}
                id={`nav-${item.id}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Controls (Currency, Language, CTA) */}
        <div className="hidden lg:flex items-center space-x-4">
          
          {/* Currency Segment Selector */}
          <div className="flex items-center bg-slate-100/60 backdrop-blur-sm rounded-full p-1 border border-slate-200/50">
            <span className="text-[9px] font-mono font-bold text-slate-500 px-2 uppercase tracking-wider">Currency</span>
            <div className="flex bg-slate-200/50 rounded-full p-0.5 space-x-0.5">
              {["MYR", "SGD", "USD"].map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full transition-all cursor-pointer ${
                    currency === cur
                      ? "bg-white text-brand-blue shadow-sm"
                      : "text-slate-500 hover:text-brand-slate"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/60 hover:bg-slate-100 border border-slate-200/50 text-slate-600 hover:text-brand-slate transition-colors text-xs font-semibold">
              <Globe className="h-3.5 w-3.5" />
              <span className="uppercase">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 border border-slate-100">
              {[
                { code: "EN", name: "English" },
                { code: "ZH", name: "中文 (Chinese)" },
                { code: "JA", name: "日本語 (JPN)" },
                { code: "FR", name: "Français (French)" },
                { code: "AR", name: "العربية (Arabic)" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    language === lang.code
                      ? "bg-brand-blue/10 text-brand-blue font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-slate"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>



          {/* Contact CTA */}
          <a
            href="https://wa.me/60195598932?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20this%20Johor%20Bahru%20property%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/15 hover:shadow-xl transition-all"
            id="nav-cta-whatsapp"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{getTranslation(language, "enquire")}</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-3">
          {/* Small Currency Toggle */}
          <button
            onClick={() => {
              const order = ["MYR", "SGD", "USD"];
              const nextIndex = (order.indexOf(currency) + 1) % order.length;
              setCurrency(order[nextIndex]);
            }}
            className="bg-slate-100/80 active:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-slate uppercase font-mono"
            title="Toggle Currency"
          >
            {currency} ⇄
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-4 shadow-inner">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick("home")}
              className={`flex items-center space-x-2 text-left py-2 font-medium ${
                currentView === "home" ? "text-slate-900 font-semibold" : "text-slate-600"
              }`}
            >
              <span>{language === "ZH" ? "主页" : language === "JA" ? "ホーム" : language === "FR" ? "Accueil" : language === "AR" ? "الرئيسية" : "Home"}</span>
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 text-left py-2 font-medium ${
                    currentView === item.id || currentView.startsWith(item.id + "/") ? "text-slate-900 font-semibold" : "text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Currency</span>
              <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200/50 space-x-0.5">
                {["MYR", "SGD", "USD"].map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      currency === cur ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-brand-slate"
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Language</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { code: "EN", name: "EN" },
                  { code: "ZH", name: "中文" },
                  { code: "JA", name: "日本語" },
                  { code: "FR", name: "FR" },
                  { code: "AR", name: "العربية" }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                      language === lang.code ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/60195598932?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20this%20Johor%20Bahru%20property%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-brand-blue text-white font-semibold py-3 rounded-xl shadow-sm text-sm"
            >
              <Phone className="h-4 w-4" />
              <span>{getTranslation(language, "enquire")}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
