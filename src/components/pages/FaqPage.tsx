import React, { useState } from 'react';
import DocsLayout from '../layouts/DocsLayout';
import retailContent from '../../content/docs/faq-retail.md?raw';
import institutionalContent from '../../content/docs/faq-institutional.md?raw';

export default function FaqPage() {
  const [mode, setMode] = useState<"retail" | "inst">("retail");

  const activeContent = mode === "retail" ? retailContent : institutionalContent;
  const activeTitle = mode === "retail" ? "USDGB FAQ - Retail" : "USDGB FAQ - Institutional";

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6 mb-8 flex items-center justify-center space-x-4">
        <button
          onClick={() => setMode("retail")}
          className={`px-6 py-2 rounded-full font-bold transition-all duration-200 ${
            mode === "retail" 
              ? "bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
              : "bg-slate-800 text-gray-400 hover:text-white"
          }`}
        >
          Retail Perspective
        </button>
        <button
          onClick={() => setMode("inst")}
          className={`px-6 py-2 rounded-full font-bold transition-all duration-200 ${
            mode === "inst" 
              ? "bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
              : "bg-slate-800 text-gray-400 hover:text-white"
          }`}
        >
          Institutional Perspective
        </button>
      </div>

      <DocsLayout
        title={activeTitle}
        version="1.0 – March 2026"
        markdownContent={activeContent}
      />
    </div>
  );
}
