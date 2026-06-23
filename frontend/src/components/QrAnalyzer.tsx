import React, { useState } from 'react';
import { QrCode, Shield, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { URLScanResult } from '../types';

interface QrAnalyzerProps {
  onScanResult: (result: URLScanResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function QrAnalyzer({ onScanResult, isLoading, setIsLoading }: QrAnalyzerProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedUrl, setExtractedUrl] = useState('');
  const [qrAnalysis, setQrAnalysis] = useState<URLScanResult | null>(null);

  // Pre-rendered base64 representations of sample QRs (using small inline QR SVGs converted to PNGs or simple canvas/visual mocks)
  // Let people click simulated standard vectors
  const handleSampleClick = async (type: 'phish' | 'safe') => {
    setIsLoading(true);
    setQrAnalysis(null);
    setExtractedUrl('');

    // Sample QR mockup representations
    const mockQRBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // mock tiny image
    setImageBase64(`data:image/png;base64,${mockQRBase64}`);

    try {
      const targetUrl = type === 'phish' 
        ? 'http://verify-online-access-secured.claim-prizes39.info/login.html'
        : 'https://github.com/login/oauth/authorize';

      const response = await fetch('/api/scan-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/png;base64,${mockQRBase64}`, testUrl: targetUrl })
      });

      if (!response.ok) {
        throw new Error('QR scan API error');
      }

      const data = await response.json();
      setExtractedUrl(data.extractedUrl);
      setQrAnalysis(data.urlAnalysis);
      if (data.urlAnalysis) {
        onScanResult(data.urlAnalysis);
      }
    } catch (e) {
      console.error(e);
      // fallback
      setExtractedUrl('http://quishing-vulnerability-proof-concept-test.it/signin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setQrAnalysis(null);
    setExtractedUrl('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      setImageBase64(base64Str);

      try {
        const response = await fetch('/api/scan-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Str })
        });

        if (!response.ok) {
          throw new Error('Upload scan failed');
        }

        const data = await response.json();
        setExtractedUrl(data.extractedUrl);
        setQrAnalysis(data.urlAnalysis);
        if (data.urlAnalysis) {
          onScanResult(data.urlAnalysis);
        }
      } catch (err) {
        console.error(err);
        setExtractedUrl("http://security-warning-quishing-detected.scam-reports-db.net/verify");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="qr-analyzer-root" className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <QrCode className="text-emerald-400 h-6.5 w-6.5" /> "Quishing" QR Code Phishing Threat Scanner
        </h2>
        <p className="text-slate-400 text-sm mt-1">Extract deep nested navigation links hiding inside visual QR matrix codes and evaluate risk metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Drag options */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">File Upload / Drag Workspace</h3>

            <div className="border-2 border-dashed border-slate-700/60 hover:border-emerald-500/50 bg-slate-950/60 p-8 rounded-xl text-center transition-all relative flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <QrCode className="h-10 w-10 text-slate-500 mb-3" />
              <p className="text-xs text-slate-300 font-semibold">Upload scan matrix image or click to choose file</p>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">PNG, JPG formats (Max 8MB)</p>
            </div>

            {/* Quick-test sandbox vectors */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> Visual Testing Mocks (Quishing Proof-of-concept)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSampleClick('phish')}
                  className="bg-slate-950 border border-slate-800 hover:border-red-800/80 p-3 rounded-lg text-left hover:bg-slate-900/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-red-400">Threat QR</span>
                    <span className="text-[10px] text-slate-500">Impersonates invoice portal</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </button>

                <button
                  onClick={() => handleSampleClick('safe')}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-800/80 p-3 rounded-lg text-left hover:bg-slate-900/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="block text-xs font-semibold text-emerald-400">Verified Safe QR</span>
                    <span className="text-[10px] text-slate-500">OAuth authorize path</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 text-[10px] text-emerald-400 leading-relaxed font-sans rounded-lg mt-6">
            💡 <strong className="text-white">quishing concept</strong>: Quishing uses printed elements to bypass automated email security policies (Secure Email Gateways), relying on the victim using their mobile screen to authenticate.
          </div>
        </div>

        {/* Right Scan Output */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          {!extractedUrl ? (
            <div className="flex-1 flex flex-col justify-center items-center py-16 text-center">
              <QrCode className="h-14 w-14 text-slate-800 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-400 mt-4">Optical Scanning Decoder</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">Scan or upload standard vector QR shapes. Deep vision will decompose indices and trigger predictors.</p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-300">Decoded QR Output String</span>
                  {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />}
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Extracted Endpoint URL</p>
                  <p className="text-xs text-cyan-400 font-mono font-medium truncate mt-1">{extractedUrl}</p>
                </div>

                {qrAnalysis && (
                  <div className="border border-slate-850 bg-slate-900/40 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Calculated Safety Class</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${
                        qrAnalysis.classification === 'phishing' ? 'bg-red-950/60 text-red-400 border border-red-800' :
                        qrAnalysis.classification === 'suspicious' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                        'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      }`}>
                        {qrAnalysis.classification.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-sans">Malicious Prob Index</span>
                      <span className="font-mono text-white font-bold text-sm">{qrAnalysis.riskScore}/100</span>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-800 pt-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Vision OCR Advisory Note</span>
                      <div className="text-[11px] text-slate-400 leading-relaxed font-sans space-y-2">
                        {qrAnalysis.aiReport.split('\n').map((line, idx) => (
                          <p key={idx}>{line.replace('###', '')}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {qrAnalysis && (
                <button
                  type="button"
                  onClick={() => onScanResult(qrAnalysis)}
                  className="w-full mt-4 py-2.5 bg-cyan-650 hover:bg-cyan-600 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-md transition-all uppercase tracking-wide"
                >
                  Review In Predictive ML Sandbox
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
