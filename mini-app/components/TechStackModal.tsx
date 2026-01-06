import React from 'react';
import { X, Server, Database, Brain, Globe, Shield, FileText, Cpu, Code } from 'lucide-react';
import clsx from 'clsx';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export default function TechStackModal({ isOpen, onClose, darkMode }: TechStackModalProps) {
  if (!isOpen) return null;

  const technologies = [
    {
      icon: Globe,
      name: "Next.js & React",
      description: "High-performance frontend framework for responsive, interactive dashboards and real-time data visualization using server-side rendering.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Database,
      name: "PostgreSQL & pgvector",
      description: "Robust relational database handling millions of records, enhanced with vector similarity search for semantic document retrieval and RAG (Retrieval-Augmented Generation).",
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      icon: Brain,
      name: "Ollama & Local LLMs",
      description: "Privacy-focused local AI inference using Qwen, Llama 3, and DeepSeek models for document analysis, summarization, and forensic storytelling without data leaving the infrastructure.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Server,
      name: "Python Automation",
      description: "Advanced scraping network using Playwright and Cloudscraper to bypass anti-bot measures, ensuring continuous data ingestion from government portals.",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      icon: Shield,
      name: "Forensic Algorithms",
      description: "Custom detection logic for 'Ghost Projects' (0% progress vs 100% payment), cost overruns, and statistical anomalies in procurement data.",
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      icon: FileText,
      name: "PDF & OCR Processing",
      description: "Hybrid pipeline using Tesseract and Vision Language Models (VLMs) to extract structured data from scanned, skewed, or low-quality government documents.",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      icon: Cpu,
      name: "Force-Directed Graphs",
      description: "Interactive 2D and 3D network visualization to uncover hidden relationships between contractors, regions, and procurement officers.",
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      icon: Code,
      name: "Open Source Core",
      description: "Built entirely on open technologies to ensure transparency, auditability, and community collaboration in the fight against corruption.",
      color: "text-gray-500",
      bg: "bg-gray-500/10"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={clsx(
        "rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border",
        darkMode ? "bg-[#0f0f0f] border-white/10" : "bg-white border-gray-200"
      )}>
        {/* Header */}
        <div className={clsx(
          "p-6 border-b flex justify-between items-center",
          darkMode ? "border-white/10 bg-white/[0.02]" : "border-gray-100 bg-gray-50"
        )}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg">
               <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={clsx("text-xl font-bold tracking-tight", darkMode ? "text-white" : "text-gray-900")}>
                Powered by <a href="https://openxai.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline hover:text-blue-400 transition-colors">OpenxAI</a>
              </h2>
              <p className={clsx("text-xs font-mono uppercase tracking-widest", darkMode ? "text-gray-400" : "text-gray-500")}>
                Open Source Transparency Stack
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={clsx("transition-colors rounded-lg p-2", darkMode ? "text-gray-500 hover:text-white hover:bg-white/10" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100")}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {technologies.map((tech, idx) => (
              <div 
                key={idx}
                className={clsx(
                  "p-4 rounded-xl border transition-all hover:scale-[1.01]",
                  darkMode ? "bg-white/[0.03] border-white/5 hover:border-white/10" : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx("p-3 rounded-lg shrink-0", tech.bg, tech.color)}>
                    <tech.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={clsx("font-bold mb-1", darkMode ? "text-gray-200" : "text-gray-900")}>
                      {tech.name}
                    </h3>
                    <p className={clsx("text-sm leading-relaxed", darkMode ? "text-gray-400" : "text-gray-600")}>
                      {tech.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={clsx(
            "mt-8 p-6 rounded-xl border text-center",
            darkMode ? "bg-blue-500/5 border-blue-500/20" : "bg-blue-50 border-blue-100"
          )}>
            <h3 className={clsx("font-bold text-lg mb-2", darkMode ? "text-blue-400" : "text-blue-700")}>
              Why Open Source?
            </h3>
            <p className={clsx("text-sm max-w-2xl mx-auto", darkMode ? "text-gray-400" : "text-gray-600")}>
              We believe that the tools used to monitor public funds must themselves be public. 
              OpenxAI ensures that our methodologies, algorithms, and data pipelines are transparent, 
              verifiable, and free from proprietary black boxes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={clsx(
          "p-4 border-t text-center text-xs font-mono",
          darkMode ? "border-white/10 text-gray-500 bg-[#0a0a0a]" : "border-gray-100 text-gray-400 bg-gray-50"
        )}>
          OPENXAI TECHNOLOGY STACK v2.0 • 2025
        </div>
      </div>
    </div>
  );
}
