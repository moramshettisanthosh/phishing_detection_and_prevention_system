import React, { useState } from 'react';
import { Image, ShieldAlert, Monitor, ChevronRight, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { ScreenshotScanResult } from '../types';

interface ScreenshotAnalyzerProps {
  onAnalyzeComplete: (result: ScreenshotScanResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ScreenshotAnalyzer({ onAnalyzeComplete, isLoading, setIsLoading }: ScreenshotAnalyzerProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ScreenshotScanResult | null>(null);

  // Simulated visual portal trigger options
  const triggerSampleScan = async (portal: 'paypal' | 'wellsfargo') => {
    setIsLoading(true);
    setAnalysisResult(null);

    const dummyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    setImageBase64(`data:image/png;base64,${dummyBase64}`);

    try {
      const response = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/png;base64,${dummyBase64}` })
      });

      if (!response.ok) {
        throw new Error('Screenshot analysis declined');
      }

      const data: ScreenshotScanResult = await response.json();
      setAnalysisResult(data);
      onAnalyzeComplete(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      setImageBase64(base64Str);

      try {
        const response = await fetch('/api/analyze-screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Str })
        });

        if (!response.ok) {
          throw new Error('Vision processing failed');
        }

        const data: ScreenshotScanResult = await response.json();
        setAnalysisResult(data);
        onAnalyzeComplete(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="screenshot-analyzer-root" className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Monitor className="text-indigo-400 h-6.5 w-6.5" /> Visual Portal Logo & Brand Forger Detector
        </h2>
        <p className="text-slate-400 text-sm mt-1">Computer vision and OCR scanning of user forms to detect visual replicas and lookalike clone branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Drag interface */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Screenshot Processing Input</h3>

            <div className="border-2 border-dashed border-slate-700/60 hover:border-indigo-500/50 bg-slate-950/60 p-10 rounded-xl text-center relative flex flex-col items-center justify-center cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Image className="h-10 w-10 text-slate-500 mb-3" />
              <p className="text-xs text-slate-300 font-semibold">Drop website screenshot or click to upload</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Accepts PNG, JPG (OCR parsed instantly)</p>
            </div>

            {/* Quick pre-sets */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Common Spoofed Portals
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => triggerSampleScan('paypal')}
                  className="bg-slate-950 border border-slate-800 hover:border-indigo-800/80 p-3 rounded-lg text-left hover:bg-slate-900/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-white">PayPal Login Portal</span>
                    <span className="text-[10px] text-slate-500">Cloned Auth visual mimic</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </button>

                <button
                  type="button"
                  onClick={() => triggerSampleScan('wellsfargo')}
                  className="bg-slate-950 border border-slate-800 hover:border-indigo-800/80 p-3 rounded-lg text-left hover:bg-slate-900/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-white">Chase Banking Screen</span>
                    <span className="text-[10px] text-slate-500">Fake credential capture card</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/20 border border-indigo-800/40 text-[10px] text-indigo-400 leading-relaxed font-sans rounded-lg mt-6">
            ⚖️ <strong className="text-white">academic validation</strong>: This module uses advanced vision OCR to scan elements (forms, passwords, buttons) and evaluate brand name occurrences in non-registered domain names.
          </div>
        </div>

        {/* Right report outputs */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          {!analysisResult ? (
            <div className="flex-1 flex flex-col justify-center items-center py-16 text-center">
              <ShieldAlert className="h-14 w-14 text-slate-800 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-400 mt-4">Optical Visual Auditor</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload layout captures. High-precision Gemini vision OCR checks strings and blocks clones.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-300">Visual Forgery Classification</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                    analysisResult.classification === 'phishing' ? 'bg-red-950/60 text-red-400 border border-red-800' :
                    analysisResult.classification === 'suspicious' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                    'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                  }`}>
                    {analysisResult.classification.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Visual Forgery Level</span>
                    <span className={`block text-3xl font-black font-mono mt-1 ${
                      analysisResult.riskScore > 60 ? 'text-red-400' : 'text-amber-400'
                    }`}>{analysisResult.riskScore}/100</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Cloned Brand Spoof</span>
                    <span className="block text-xs font-bold text-slate-300 truncate mt-2">
                      {analysisResult.detectedBrand}
                    </span>
                  </div>
                </div>

                {/* OCR text output preview */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Captured OCR Characters</span>
                  <code className="text-[11px] text-slate-400 font-mono italic block leading-relaxed max-h-[80px] overflow-y-auto pr-1">
                    "{analysisResult.extractedText}"
                  </code>
                </div>

                {/* Vision AI explainer text */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> Threat Model Analysis Report
                  </span>
                  <div className="p-4 bg-slate-905 border border-slate-800 text-xs text-slate-400 rounded-lg max-h-[160px] overflow-y-auto leading-relaxed space-y-2 custom-scrollbar">
                    {analysisResult.aiReport.split('\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
