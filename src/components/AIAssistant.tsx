import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, HelpCircle, AlertTriangle } from "lucide-react";
import { Project } from "../types";

interface AIAssistantProps {
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  buyerType?: string; // "Malaysian", "Singaporean", "Foreigner"
}

// Simple custom Markdown to JSX renderer
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let trimmed = line.trim();
    if (trimmed.startsWith("###")) {
      return <h4 key={idx} className="text-base font-bold text-slate-900 mt-4 mb-2 first:mt-0">{trimmed.replace(/^###\s*/, "")}</h4>;
    }
    if (trimmed.startsWith("##")) {
      return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-5 mb-2 first:mt-0">{trimmed.replace(/^##\s*/, "")}</h3>;
    }
    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      // Bold rendering in lists
      const listContent = trimmed.replace(/^[-*]\s*/, "");
      return (
        <li key={idx} className="ml-5 list-disc text-sm text-slate-700 leading-relaxed mb-1.5">
          {renderTextWithBold(listContent)}
        </li>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-2"></div>;
    }
    return <p key={idx} className="text-sm text-slate-700 leading-relaxed mb-2">{renderTextWithBold(trimmed)}</p>;
  });
}

function renderTextWithBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} className="font-semibold text-slate-900">{part}</strong>;
    }
    return part;
  });
}

export default function AIAssistant({ project, isOpen, onClose, buyerType }: AIAssistantProps) {
  const [messages, setMessages] = useState<{ sender: "ai" | "user"; text: string }[]>([
    {
      sender: "ai",
      text: project 
        ? `Hi! I am the RTS Gateway AI Advisor. I have synchronized all technical specifications for **${project.project_name}** from our master Google Sheet.\n\nAsk me anything! For example:\n- Is this project suitable for long-term rental or Airbnb?\n- What is the exact distance to the RTS Link / CIQ Checkpoints?\n- What are the pros/cons for a **${buyerType || "foreign investor"}**?\n- Let's break down the expected rental yield assumptions.`
        : `Welcome! I am the Johor Bahru Market Analyst. I can answer any questions about the Johor Bahru property market, tax policies (RPGT, MM2H, SG Commuters), RTS infrastructure impact, or compare projects.\n\nWhat would you like to know today?`
    }
  ]);
  
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) setInputText("");
    
    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          project: project || null,
          buyerType: buyerType || "General Investor"
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: `I encountered an issue gathering insights: ${data.error || "Please try again later."}` }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Connection error. Please confirm the server dev environment is fully started." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = project
    ? [
        "Is this project suitable for Airbnb rental yields?",
        "What is the exact distance to Bukit Chagar RTS?",
        "Explain pros and cons for a Singapore commuter.",
        "Compare price PSF and layout efficiency."
      ]
    : [
        "What are the latest tax regulations for Singaporean buyers in JB?",
        "How is the RTS Link changing JB property prices?",
        "Explain the RM 1 Million minimum purchase rule for foreigners.",
        "Which areas have the highest rental yield potential?"
      ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/85 backdrop-blur-xl shadow-2xl border-l border-slate-200/50 flex flex-col font-sans" id="ai-assistant-panel">
      
      {/* Header */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6 bg-brand-slate/95 backdrop-blur-md text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center bg-white/10 border border-white/15 rounded-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm leading-none uppercase tracking-wider">AI Market Advisor</h3>
            <p className="text-[9px] text-slate-400 font-mono mt-1.5 uppercase tracking-widest">RTS Premium Analyst Engine</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.sender === "user" ? "bg-blue-100 text-blue-600" : "bg-slate-900 text-white"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm border ${
              msg.sender === "user" 
                ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" 
                : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
            }`}>
              {msg.sender === "user" ? (
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              ) : (
                <div className="prose prose-slate max-w-none">
                  {renderMarkdown(msg.text)}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <Bot className="h-4 w-4 animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3.5 text-sm shadow-sm border border-slate-100 text-slate-500 flex items-center space-x-2">
              <span className="flex space-x-1">
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="h-2 w-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
              <span className="font-mono text-xs text-slate-400">Analysing market indices...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts if short history */}
      {messages.length < 5 && (
        <div className="px-6 py-3 border-t border-slate-100 bg-white shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">Suggested Inquiries</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                disabled={isLoading}
                className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-3 py-1.5 text-left font-medium border border-slate-200/50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={project ? `Ask about ${project.project_name}...` : "Ask about JB property markets..."}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 disabled:bg-slate-100 disabled:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:bg-slate-100 disabled:text-slate-300 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
