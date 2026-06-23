import React, { useState } from 'react';
import { Network, FileCode, Check, Copy } from 'lucide-react';

export default function UmlDiagrams() {
  const [activeTab, setActiveTab] = useState<'usecase' | 'activity' | 'sequence' | 'class' | 'dfd' | 'er' | 'architecture'>('architecture');
  const [copied, setCopied] = useState(false);

  // Mermaid markup specifications for each diagram so students can copy it directly to their reports!
  const mermaidCodes = {
    usecase: `autonumber
actor User
actor Admin
rectangle "PhishShield Platform" {
  User -> (Predict URL ML)
  User -> (Upload Email NLP)
  User -> (Scan QR Vision)
  User -> (Analyze Screenshot OCR)
  (Predict URL ML) .> (Explainable AI report) : include
  Admin -> (Audit Logs Monitoring)
  Admin -> (Update Blocklists)
}`,
    activity: `start
:User inputs Asset (URL/Email/QR/Screenshot);
if (Asset is Image (QR/Screenshot)?) then (yes)
  :Vision AI Model OCR processing;
  :Extract target Link;
else (no)
  :Extract Lexical Features inline;
endif
:Compute feature metrics (Entropy, Length, Keywords);
:Validate against trusted Whitelist / Database;
if (In Whitelist?) then (yes)
  :Classify as SAFE (Risk: 0);
else (no)
  :Execute Ensemble Predictor (XGBoost/Random Forest);
  :Compare metrics across 5 algorithms;
  :Select and route to Best Model output;
endif
:Generate Explainable AI security report via Gemini;
:Store event in Database (Audit log);
stop`,
    sequence: `sequenceDiagram
  autonumber
  actor User as End User
  participant FE as Vite React Frontend
  participant BE as Express API Controller
  participant ML as Feature Extractor Engine
  participant AI as Gemini Explainer API

  User->>FE: Inputs Target URL / File
  FE->>BE: POST request /api/predict-url
  BE->>ML: Extract 13 Lexical features
  ML-->>BE: Calculated indicators (Entropy, Length, Age)
  BE->>BE: Compare models (Decision Tree, XGBoost, etc)
  BE->>AI: Request XAI advisory report
  AI-->>BE: Compiled HTML Report
  BE-->>FE: Return cohesive JSON payload
  FE-->>User: Render Dashboard gauges, reports, indicator logs`,
    class: `classDiagram
  class ScannedURL {
    +String id
    +String url
    +DateTime timestamp
    +String classification
    +float riskScore
    +float probability
    +Feature[] features
    +String bestModel
    +String aiReport
  }
  class Feature {
    +String name
    +any value
    +String description
    +String status
  }
  class EmailReport {
    +String sender
    +String subject
    +String body
    +String[] indicators
    +String fullReport
  }
  class AuditLog {
    +String id
    +DateTime timestamp
    +String action
    +String ip
    +String username
    +String status
  }
  ScannedURL "1" *-- "many" Feature`,
    dfd: `graph TD
  User((End User)) -->|Upload Image / Paste URL| FE[Vite React client]
  FE -->|API Call| BE[Express Backend Manager]
  BE -->|Lexical Processing| FE_ENG[Feature Engineering Module]
  FE_ENG -->|Calculated Metrics| CLASSIFIER[Ensemble Classifiers Router]
  CLASSIFIER -->|Scanned Scores & Weights| MONGO_DB[(Local Database / Collections)]
  CLASSIFIER -->|Trigger Heuristics| GEMINI[Gemini AI Explainer]
  GEMINI -->|Advisory Report| BE
  BE -->|Integrated JSON| FE
  FE -->|Render Visual Dashboards| User`,
    er: `erDiagram
  USERS ||--o{ SCANNED_URLS : scans
  USERS {
    string id PK
    string username
    string passwordHash
    string role
  }
  SCANNED_URLS {
    string id PK
    string url
    datetime timestamp
    string classification
    float riskScore
  }
  THREAT_LOGS {
    string id PK
    string url
    string action
    datetime timestamp
  }
  SCANNED_URLS ||--|| THREAT_LOGS : flags`,
    architecture: `graph TB
  Client[React SPA client - Port 3000]
  Proxy[Nginx Ingress reverse router] --> Client
  Client -->|HTTPS requests| Expr[Express Core Controller]
  Expr -->|Trigger metrics| Extract[Syntactic & Lexical Parser]
  Expr -->|API proxy| GenAI[Gemini 3.5 AI APIs]
  Expr -->|DB pipeline| DB[(Simulated In-Memory MongoDB Collections)]`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCodes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="uml-diagrams-root" className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="text-indigo-400 h-6.5 w-6.5" /> Modeling, Architecture & UML Specification Diagrams
        </h2>
        <p className="text-slate-400 text-sm mt-1">Full design architectural diagrams for academic documentation reports including Mermaid code blocks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector menu */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-2">Systems Diagrams INDEX</span>
          {[
            { id: 'architecture', label: 'System Architecture' },
            { id: 'usecase', label: 'Use Case UML' },
            { id: 'activity', label: 'Activity Flow UML' },
            { id: 'sequence', label: 'Sequence UML' },
            { id: 'class', label: 'Class UML' },
            { id: 'dfd', label: 'Data Flow Diagram' },
            { id: 'er', label: 'ER DB Entity Relations' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full p-3 text-left rounded-lg text-xs font-semibold hover:bg-slate-900 cursor-pointer block transition-all ${
                activeTab === item.id ? 'bg-cyan-950/40 border border-cyan-800 text-cyan-400' : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right workspace: Renders custom elegant visual vector diagram on the spot! */}
        <div className="lg:col-span-9 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-6">
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <span className="text-xs font-bold text-slate-300">Visual High-Resolution Blueprint</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 px-2.5 py-1.5 rounded cursor-pointer transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Mermaid!' : 'Copy Mermaid Markup Code'}</span>
              </button>
            </div>

            {/* Custom Visual Graphic Vector implementations for each layout so it compiles and is gorgeous! */}
            <div className="bg-slate-950 p-6 rounded-lg border border-slate-850 flex items-center justify-center min-h-[300px]">
              {activeTab === 'architecture' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* Nodes */}
                  <rect x="180" y="20" width="140" height="40" rx="6" fill="#0891B2" stroke="#22D3EE" strokeWidth="1" />
                  <text x="250" y="45" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Nginx Ingress reverse router</text>
                  
                  <rect x="50" y="100" width="120" height="40" rx="6" fill="#312E81" stroke="#6366F1" strokeWidth="1" />
                  <text x="110" y="125" fill="#E0E7FF" fontSize="10" textAnchor="middle">React client Port 3000</text>

                  <rect x="310" y="100" width="140" height="40" rx="6" fill="#1E1E2F" stroke="#E2E8F0" strokeWidth="1" />
                  <text x="380" y="125" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Express Core Backend</text>

                  <rect x="190" y="180" width="120" height="35" rx="6" fill="#064E3B" stroke="#10B96A" strokeWidth="1" />
                  <text x="250" y="202" fill="#D1FAE5" fontSize="10" textAnchor="middle">Gemini AI Explainer APIs</text>

                  <rect x="340" y="180" width="130" height="35" rx="6" fill="#111827" stroke="#94A3B8" strokeWidth="1" />
                  <text x="405" y="202" fill="white" fontSize="9" textAnchor="middle">Simulated MongoDB Memory</text>

                  {/* Connectors */}
                  <path d="M250,60 L110,100" stroke="#64748B" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                  <path d="M250,60 L380,100" stroke="#64748B" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                  <path d="M170,120 L310,120" stroke="#38BDF8" strokeWidth="1.5" fill="none"/>
                  <path d="M380,140 L250,180" stroke="#64748B" strokeWidth="1" fill="none"/>
                  <path d="M380,140 L405,180" stroke="#64748B" strokeWidth="1" fill="none"/>
                </svg>
              )}

              {activeTab === 'usecase' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* User */}
                  <circle cx="50" cy="100" r="15" fill="#475569" stroke="#94A3B8" />
                  <line x1="50" y1="115" x2="50" y2="150" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="25" y1="125" x2="75" y2="125" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="50" y1="150" x2="35" y2="180" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="50" y1="150" x2="65" y2="180" stroke="#94A3B8" strokeWidth="2" />
                  <text x="50" y="200" fill="#94A3B8" fontSize="10" textAnchor="middle">End User</text>

                  {/* System limits rectangle */}
                  <rect x="150" y="30" width="200" height="180" rx="8" fill="#0B1329" stroke="#1E293B" />
                  <text x="250" y="45" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">PhishShield Core Platform</text>

                  {/* Use Cases */}
                  <ellipse cx="250" cy="80" rx="60" ry="15" fill="#1E293B" stroke="#0891B2" />
                  <text x="250" y="83" fill="#E2E8F0" fontSize="9" textAnchor="middle">Predict URL ML</text>
                  
                  <ellipse cx="250" cy="120" rx="60" ry="15" fill="#1E293B" stroke="#0891B2" />
                  <text x="250" y="123" fill="#E2E8F0" fontSize="9" textAnchor="middle">Scan QR Vision</text>

                  <ellipse cx="250" cy="160" rx="60" ry="15" fill="#1E293B" stroke="#0891B2" />
                  <text x="250" y="163" fill="#E2E8F0" fontSize="9" textAnchor="middle">Explainable Report</text>

                  {/* Connections */}
                  <line x1="75" y1="125" x2="190" y2="80" stroke="#64748B" strokeWidth="1" />
                  <line x1="75" y1="125" x2="190" y2="120" stroke="#64748B" strokeWidth="1" />
                  <path d="M250,95 L250,145" stroke="#64748B" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                </svg>
              )}

              {activeTab === 'activity' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* Flow chart elements */}
                  <circle cx="250" cy="20" r="8" fill="white" />
                  <line x1="250" y1="28" x2="250" y2="50" stroke="#64748B" strokeWidth="1.5" />

                  <rect x="180" y="50" width="140" height="30" rx="4" fill="#312E81" />
                  <text x="250" y="68" fill="white" fontSize="9" textAnchor="middle">User inputs URL/Image</text>
                  <line x1="250" y1="80" x2="250" y2="110" stroke="#64748B" strokeWidth="1.5" />

                  {/* Decision diamond */}
                  <polygon points="250,110 280,125 250,140 220,125" fill="#1E293B" stroke="#0891B2" strokeWidth="1.5" />
                  <text x="250" y="128" fill="white" fontSize="8" textAnchor="middle">Is QR/Image?</text>

                  {/* Yes Branch */}
                  <line x1="280" y1="125" x2="330" y2="125" stroke="#64748B" strokeWidth="1.5" />
                  <rect x="330" y="110" width="120" height="30" rx="4" fill="#1E293B" stroke="#64748B" />
                  <text x="390" y="128" fill="white" fontSize="8" textAnchor="middle">Vision AI OCR decoding</text>

                  {/* No Branch */}
                  <line x1="250" y1="140" x2="250" y2="170" stroke="#64748B" strokeWidth="1.5" />
                  <rect x="180" y="170" width="140" height="30" rx="4" fill="#064E3B" />
                  <text x="250" y="188" fill="white" fontSize="9" textAnchor="middle">Run Ensemble classifier</text>

                  {/* End */}
                  <line x1="250" y1="200" x2="250" y2="220" stroke="#64748B" strokeWidth="1.5" />
                  <circle cx="250" cy="225" r="5" fill="white" />
                  <circle cx="250" cy="225" r="9" fill="none" stroke="white" strokeWidth="1" />
                </svg>
              )}

              {activeTab === 'sequence' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* Lifelines */}
                  <line x1="80" y1="30" x2="80" y2="200" stroke="#1E293B" strokeDasharray="3,3" />
                  <text x="80" y="25" fill="white" fontSize="9" textAnchor="middle">End User</text>

                  <line x1="220" y1="30" x2="220" y2="200" stroke="#1E293B" strokeDasharray="3,3" />
                  <text x="220" y="25" fill="white" fontSize="9" textAnchor="middle">Vite React App</text>

                  <line x1="380" y1="30" x2="380" y2="200" stroke="#1E293B" strokeDasharray="3,3" />
                  <text x="380" y="25" fill="white" fontSize="9" textAnchor="middle">Express Backend</text>

                  {/* Messages */}
                  <path d="M80,60 L220,60" stroke="#6366F1" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <text x="150" y="55" fill="white" fontSize="8" textAnchor="middle">1. Inputs Target URL</text>

                  <path d="M220,95 L380,95" stroke="#38BDF8" strokeWidth="1.5" />
                  <text x="300" y="90" fill="white" fontSize="8" textAnchor="middle">2. POST /api/predict-url</text>

                  <path d="M380,130 L380,155" stroke="#10B981" strokeWidth="1.5" />
                  <text x="430" y="145" fill="white" fontSize="8">3. Extract features & models</text>

                  <path d="M380,180 L220,180" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="300" y="175" fill="white" fontSize="8" textAnchor="middle">4. Return JSON response</text>
                </svg>
              )}

              {activeTab === 'class' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* Class Box 1 */}
                  <rect x="50" y="30" width="160" height="150" rx="4" fill="#0F172A" stroke="#38BDF8" />
                  <text x="130" y="48" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">ScannedURL</text>
                  <line x1="50" y1="58" x2="210" y2="58" stroke="#38BDF8" />
                  <text x="60" y="75" fill="silver" fontSize="8">+String id</text>
                  <text x="60" y="90" fill="silver" fontSize="8">+String url</text>
                  <text x="60" y="105" fill="silver" fontSize="8">+DateTime timestamp</text>
                  <text x="60" y="120" fill="silver" fontSize="8">+float riskScore</text>
                  <line x1="50" y1="130" x2="210" y2="130" stroke="#38BDF8" />
                  <text x="60" y="145" fill="silver" fontSize="8">+GetExplainerReport()</text>

                  {/* Connection */}
                  <line x1="210" y1="100" x2="310" y2="100" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="230" y="92" fill="white" fontSize="10">1</text>
                  <text x="290" y="92" fill="white" fontSize="10">*</text>

                  {/* Class Box 2 */}
                  <rect x="310" y="50" width="140" height="100" rx="4" fill="#0F172A" stroke="#10B981" />
                  <text x="380" y="68" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Feature</text>
                  <line x1="310" y1="78" x2="450" y2="78" stroke="#10B981" />
                  <text x="320" y="95" fill="silver" fontSize="8">+String name</text>
                  <text x="320" y="110" fill="silver" fontSize="8">+any value</text>
                  <text x="320" y="125" fill="silver" fontSize="8">+String status</text>
                </svg>
              )}

              {activeTab === 'dfd' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* circles & processes */}
                  <circle cx="60" cy="120" r="30" fill="#312E81" stroke="#6366F1" />
                  <text x="60" y="123" fill="white" fontSize="10" textAnchor="middle">User</text>

                  <path d="M90,120 L160,120" stroke="#64748B" strokeWidth="1.5" />
                  
                  <rect x="160" y="95" width="110" height="50" rx="6" fill="#1E1E2F" stroke="#E2E8F0" />
                  <text x="215" y="115" fill="white" fontSize="9" textAnchor="middle">React Client</text>
                  <text x="215" y="130" fill="cyan" fontSize="8" fontStyle="italic" textAnchor="middle">(Level 0 DFD)</text>

                  <path d="M270,120 L340,120" stroke="#64748B" strokeWidth="1.5" />

                  <rect x="340" y="95" width="110" height="50" rx="6" fill="#064E3B" stroke="#10B96A" />
                  <text x="395" y="120" fill="white" fontSize="9" textAnchor="middle">Express Engine</text>
                  <text x="395" y="135" fill="silver" fontSize="8" textAnchor="middle">Process Models</text>
                </svg>
              )}

              {activeTab === 'er' && (
                <svg viewBox="0 0 500 240" className="w-full max-w-[450px]">
                  {/* ER design */}
                  <rect x="50" y="80" width="120" height="70" rx="4" fill="#1E293B" stroke="#F59E0B" />
                  <text x="110" y="98" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">USERS</text>
                  <line x1="50" y1="108" x2="170" y2="108" stroke="#F59E0B" />
                  <text x="60" y="123" fill="silver" fontSize="8">username (Unique)</text>
                  <text x="60" y="138" fill="silver" fontSize="8">role</text>

                  <path d="M170,115 L240,115" stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="180" y="107" fill="white" fontSize="8">1</text>
                  <text x="225" y="107" fill="white" fontSize="8">M</text>

                  <rect x="310" y="80" width="140" height="70" rx="4" fill="#1E293B" stroke="#F59E0B" />
                  <text x="380" y="98" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">SCANNED_URLS</text>
                  <line x1="310" y1="108" x2="450" y2="108" stroke="#F59E0B" />
                  <text x="320" y="123" fill="silver" fontSize="8">url_id (PK)</text>
                  <text x="320" y="138" fill="silver" fontSize="8">classification</text>
                </svg>
              )}
            </div>
          </div>

          {/* Bottom representation markup */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-2">Mermaid Markup Representation:</span>
            <pre className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-[9px] font-mono text-cyan-400 select-all overflow-x-auto leading-normal whitespace-pre">
              {mermaidCodes[activeTab]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
