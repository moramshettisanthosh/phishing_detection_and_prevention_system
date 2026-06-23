import React, { useState } from 'react';
import { Presentation as PresIcon, ChevronLeft, ChevronRight, Play, Terminal, Cpu, ShieldAlert, Award } from 'lucide-react';

export default function Presentation() {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "Real-Time AI/ML-Based Phishing Detection and Prevention System",
      undertitle: "B.Tech Final Year Minor Project Defense Presentation",
      category: "TECHNICAL PROJECT SHOWCASE",
      bullets: [
        "Candidate Name: B.Tech Final Year Engineering Student",
        "Domain Focus: Deep Machine Learning, Optical Character Recognition, NLP, and Browser Extension Security APIs",
        "Institution: Department of Computer Science & Engineering"
      ],
      icon: <Award className="h-12 w-12 text-yellow-400 mx-auto animate-pulse" />
    },
    {
      title: "Introduction and Problem Statement",
      undertitle: "The expanding boundaries of credential phishing",
      category: "THE PROBLEM VECTOR",
      bullets: [
        "Dynamic URLs bypass traditional text classifiers through newly registered DNS names.",
        "Social Engineering bypasses secure gateways by mimicking brand layouts visuals.",
        "QR Code hijack 'Quishing' routes malicious indicators through off-band mobile scans, completely evading firewalls."
      ],
      icon: <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
    },
    {
      title: "Proposed Unified Defense Architecture",
      undertitle: "A complete full-stack predictive gateway on Port 3000",
      category: "SYSTEM METHODOLOGY",
      bullets: [
        "Extracts 13 lexical indicators (entropy index, digits length, SSL presence) from entered URLs.",
        "Vision OCR OCR-Engine reads uploaded layouts for logo spoofing signals.",
        "LLM Explainable AI Explainer compiles instant cybersecurity hazard reports for end users."
      ],
      icon: <Cpu className="h-12 w-12 text-cyan-400 mx-auto" />
    },
    {
      title: "URL Feature Engineering",
      undertitle: "Transforming raw strings to predictive vectors",
      category: "FEATURE EXTRACTION",
      bullets: [
        "Subdomain Dots, hyphens, and slashes depth indicators count.",
        "Shannon Entropy is calculated to assess character randomness values.",
        "Verification database checks against domain ages to avoid false alerts for giants."
      ],
      icon: <Terminal className="h-12 w-12 text-indigo-400 mx-auto" />
    },
    {
      title: "Machine Learning Evaluation Matrix",
      undertitle: "Evaluating classifiers output on PhishTank and Kaggle",
      category: "CLASSIFIER RESULTS",
      bullets: [
        "Evaluated 5 distinct algorithms: XGBoost, Random Forest, Decision Tree, Logistic Regression, and SVM.",
        "Ensemble XGBoost algorithm outperformed with 98.91% Accuracy rating.",
        "A Posteriori Probability is routed directly to XAI reporting panels."
      ],
      icon: <Play className="h-12 w-12 text-emerald-400 mx-auto" strokeWidth={1} />
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) setSlide(slide + 1);
  };

  const handlePrev = () => {
    if (slide > 0) setSlide(slide - 1);
  };

  return (
    <div id="presentation-root" className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <PresIcon className="text-cyan-400 h-6.5 w-6.5" /> Academic Slide Deck & Defense Slides
        </h2>
        <p className="text-slate-400 text-sm mt-1">Immersive Horizontal PDF Presentation to defend B.Tech Final Year specifications successfully.</p>
      </div>

      {/* Slide frame */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[380px] p-8 relative">
        <div className="absolute top-4 right-6 text-xs font-semibold text-slate-500 font-mono tracking-widest bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          SLIDE {slide + 1} / {slides.length}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
            {slides[slide].category}
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight pt-2">
            {slides[slide].title}
          </h3>
          <p className="text-slate-400 text-xs italic font-medium">
            {slides[slide].undertitle}
          </p>
        </div>

        {/* Visual content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center py-6">
          <div className="col-span-1 border-r border-slate-800/50 pr-4 text-center">
            {slides[slide].icon}
          </div>
          <div className="col-span-3 space-y-3 pl-2">
            {slides[slide].bullets.map((b, index) => (
              <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                <span className="text-cyan-500 text-sm font-black mt-0.5">•</span>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <button
            onClick={handlePrev}
            type="button"
            disabled={slide === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold select-none cursor-pointer border ${
              slide === 0 
                ? 'bg-slate-950 border-slate-900 text-slate-700' 
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> Previous Slide
          </button>

          <div className="flex gap-1">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  idx === slide ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            type="button"
            disabled={slide === slides.length - 1}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold select-none cursor-pointer border ${
              slide === slides.length - 1 
                ? 'bg-slate-950 border-slate-900 text-slate-700' 
                : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-100'
            }`}
          >
            Next Slide <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
