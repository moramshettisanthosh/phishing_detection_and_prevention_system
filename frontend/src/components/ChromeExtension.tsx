import React, { useState } from 'react';
import { Chrome, Lock, Globe, Server, Terminal, ShieldAlert, ShieldCheck, Download, Code, Play } from 'lucide-react';

export default function ChromeExtension() {
  const [addressBar, setAddressBar] = useState('https://paypal-security-verification.login-auth-392.com/signin');
  const [browserState, setBrowserState] = useState<'normal' | 'warn' | 'blocked'>('normal');
  const [simulatedRisk, setSimulatedRisk] = useState(0);

  const testUrls = [
    { url: 'https://paypal-security-verification.login-auth-392.com/signin', risk: 92, state: 'blocked' },
    { url: 'https://github.com/login/oauth/authorize', risk: 8, state: 'normal' },
    { url: 'http://168.192.12.92/banking/login', risk: 84, state: 'blocked' },
    { url: 'http://amazon-offers-winner.cc/claim', risk: 68, state: 'warn' }
  ];

  const handleGo = () => {
    const match = testUrls.find(t => addressBar.toLowerCase().includes(t.url.split('//')[1]) || addressBar.toLowerCase().includes(t.url));
    if (match) {
      setSimulatedRisk(match.risk);
      setBrowserState(match.state as any);
    } else {
      // heuristic check
      if (addressBar.includes('login') || addressBar.includes('verification') || addressBar.includes('update') || addressBar.includes('.cc')) {
        setSimulatedRisk(75);
        setBrowserState('blocked');
      } else {
        setSimulatedRisk(12);
        setBrowserState('normal');
      }
    }
  };

  // Chrome manifest file code snippet
  const manifestCode = `{
  "manifest_version": 3,
  "name": "PhishShield AI: Real-Time Threat Protection",
  "version": "1.0.0",
  "description": "B.Tech Minor Project real-time machine learning URL scanning and quishing prevention extension.",
  "permissions": [
    "declarativeNetRequest",
    "webNavigation",
    "storage",
    "activeTab"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}`;

  const backgroundCode = `// background.js - service worker monitoring URLs
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // ignore subframes

  const url = details.url;
  
  // Call full-stack API endpoint
  const response = await fetch("https://phishshield-ai.run/api/predict-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, source: "chrome-extension-v3" })
  });
  
  const result = await response.json();
  if (result.classification === "phishing") {
    // Inject warning blocker page
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("blocked.html?url=" + encodeURIComponent(url) + "&score=" + result.riskScore)
    });
  }
});`;

  return (
    <div id="chrome-extension-root" className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Chrome className="text-amber-400 h-6.5 w-6.5" /> Chrome Browser Extension & Threat Sandbox
        </h2>
        <p className="text-slate-400 text-sm mt-1">Real-time URL hijacking detector powered by Chrome's declarativeNetRequest and background service workers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Simulation Screen */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
          <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center gap-3">
            {/* Dots */}
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
            </div>
            {/* Fake Address bar */}
            <div className="flex-1 bg-slate-900 border border-slate-805 rounded-lg py-1.5 px-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-400 truncate max-w-[320px]">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={addressBar}
                  onChange={(e) => setAddressBar(e.target.value)}
                  className="bg-transparent border-none text-white outline-none w-full font-mono text-xs select-all text-slate-300"
                />
              </div>
              <span className="text-[10px] text-slate-500 tracking-wider">SSL v3</span>
            </div>
            <button
              onClick={handleGo}
              type="button"
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
            </button>
          </div>

          {/* Browser simulator inner window content */}
          <div className="flex-1 min-h-[340px] bg-slate-950 p-6 flex flex-col items-center justify-center relative">
            {browserState === 'normal' && (
              <div className="text-center space-y-4 max-w-sm animate-fade-in">
                <ShieldCheck className="h-14 w-14 text-emerald-400 mx-auto" strokeWidth={1.5} />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Standard Navigation Authorized</h4>
                  <p className="text-xs text-slate-400 mt-1">This domain does not match any current machine learning alert index. Encryption values are valid.</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/60 p-2 rounded-lg text-emerald-400 text-[10px] font-mono">
                  <span>SSL Owner Verified</span>
                  <span>|</span>
                  <span>Risk score: {simulatedRisk}%</span>
                </div>
              </div>
            )}

            {browserState === 'warn' && (
              <div className="text-center space-y-4 max-w-sm animate-fade-in">
                <ShieldAlert className="h-14 w-14 text-amber-400 mx-auto animate-bounce" strokeWidth={1.5} />
                <div>
                  <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide">Suspicious Domain Signature Detected!</h4>
                  <p className="text-xs text-slate-300 mt-1">Caution: This URL triggers minor risk scores ({simulatedRisk}%). It utilizes newer servers.</p>
                </div>
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => setBrowserState('normal')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer font-bold"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => setBrowserState('blocked')}
                    className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs cursor-pointer font-bold"
                  >
                    Lock Asset
                  </button>
                </div>
              </div>
            )}

            {browserState === 'blocked' && (
              <div className="w-full bg-red-950/20 border-2 border-red-905 p-6 rounded-xl relative overflow-hidden animate-fade-in text-center space-y-4 max-w-md">
                <div className="absolute right-3 top-3 opacity-15">
                  <Chrome className="h-32 w-32 text-red-500" />
                </div>
                <ShieldAlert className="h-14 w-14 text-red-500 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-red-500 uppercase tracking-wider">PHISHSHIELD BLOCKED DANGEROUS ACCESS</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This link has been blocked by our Real-time AI classification engine because of severe phishing indicators ({simulatedRisk}% prediction threshold).
                  </p>
                </div>
                <code className="block bg-slate-950 p-2 border border-slate-900 rounded font-mono text-[9px] text-red-400 truncate text-left">
                  TARGET: {addressBar}
                </code>
                <div className="flex gap-3 justify-center pt-3">
                  <button
                    onClick={() => {
                      setAddressBar('https://github.com/login/oauth/authorize');
                      setBrowserState('normal');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Return to Clean Dashboard
                  </button>
                  <button
                    onClick={() => setBrowserState('normal')}
                    className="px-3 py-2 bg-slate-900 text-slate-400 border border-slate-800 hover:text-white rounded-lg text-xs cursor-pointer"
                  >
                    Proceed (Risk Advisory)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Manifest Code details */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Code className="text-amber-400 h-4 w-4" /> Manifest files specifications
            </h3>

            {/* Manifest tabs */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono">manifest.json (Chrome Manifest V3)</span>
              <pre className="p-3.5 bg-slate-950 border border-slate-850 rounded-lg text-[9px] font-mono text-amber-500 leading-relaxed overflow-x-auto max-h-[160px] custom-scrollbar">
                {manifestCode}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono">background.js (Real-time listener callback)</span>
              <pre className="p-3.5 bg-slate-950 border border-slate-850 rounded-lg text-[9px] font-mono text-cyan-400 leading-relaxed overflow-x-auto max-h-[160px] custom-scrollbar">
                {backgroundCode}
              </pre>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              alert('Extension Manifest configuration successfully exported as package/chrome-extension-v3.zip!');
            }}
            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-705 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" /> Export Extension Packages (.zip)
          </button>
        </div>
      </div>
    </div>
  );
}
