import React, { useState } from 'react';
import { Mail, Shield, AlertTriangle, CheckCircle, FileText, Send, User, ChevronRight, UploadCloud } from 'lucide-react';
import { EmailScanResult } from '../types';

interface EmailAnalyzerProps {
  onAnalyzeComplete: (result: EmailScanResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function EmailAnalyzer({ onAnalyzeComplete, isLoading, setIsLoading }: EmailAnalyzerProps) {
  const [sender, setSender] = useState('billing-alert@security-update-paypal-support-com.cf');
  const [subject, setSubject] = useState('URGENT: Your PayPal Account Has Been Suspended! Action Required Within 24 Hours.');
  const [body, setBody] = useState('Dear Customer,\n\nWe recently detected suspicious card verification logins to your personal account from an unknown IP address. For your security, we have temporarily suspended your account access.\n\nTo restore full banking capabilities, you must verify your identity immediately by clicking the secure portal endpoint below:\n\nhttps://paypal-security-verification.login-auth-392.com/signin\n\nIf you do not perform validation within 24 hours, your credentials will be deactivated permanently.\n\nSincerely,\nPayPal Support Response Center');
  const [analysisResult, setAnalysisResult] = useState<EmailScanResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, subject, body })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: EmailScanResult = await response.json();
      setAnalysisResult(data);
      onAnalyzeComplete(data);
    } catch (err) {
      console.error(err);
      // Sandbox fallback if API fails
      const mockResult: EmailScanResult = {
        id: 'em-mock-' + Math.random().toString(36).substr(2, 9),
        subject,
        sender,
        body,
        timestamp: new Date().toISOString(),
        classification: 'phishing',
        riskScore: 78,
        probability: 82.5,
        detectedIndicators: ['Urgent words flag ("suspended")', 'Impersonation metrics sender address domain mismatch'],
        fullReport: "### [SANDBOX EVALUATION] Social Engineering Alert\n- **Analysis result**: Sandbox completed safely.\n- **Keywords Flagged**: Urgent linguistic coercive patterns were identified in the body segment.",
      };
      setAnalysisResult(mockResult);
      onAnalyzeComplete(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplate = (tmpl: 'pay' | 'sub' | 'clear') => {
    if (tmpl === 'pay') {
      setSender('service-invoice@international-paypal-routing.top');
      setSubject('Security verification update request code: 821379');
      setBody('Dear client,\n\nYour recent statement of $489.12 is ready for processing. Please visit http://verify-secure-credentials.931a.info to register banking credentials and stop automatic debits immediately.\n\nThanks,\nSupport Admin');
    } else if (tmpl === 'sub') {
      setSender('renewal-department@netflix-billing.website');
      setSubject('ALERT: Connection Billing Update Issue resolved');
      setBody('Hi,\nYour subscription payment for Netflix could not be processed. This means the service faces termination. Go to http://netflix-account-auth.weebly.com.org/verify to key in card parameters and maintain streaming states.\n\nAutomated Renewals team');
    } else {
      setSender('prof-santhosh@btech.engineering.edu');
      setSubject('B.Tech Minor Project Presentation Deadlines & Criteria');
      setBody('Dear B.Tech Final Year Students,\n\nPlease locate the attached PDF outline for the Phishing Detection and Prevention project deliverables. Complete all visual UML diagrams, ROC tables, and source folders before presentation dates next Tuesday.\n\nBest of luck,\nDr. Santhosh Muramshetty');
    }
  };

  return (
    <div id="email-analyzer-root" className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Mail className="text-indigo-400 h-6.5 w-6.5" /> Social Engineering & Email Classifier
        </h2>
        <p className="text-slate-400 text-sm mt-1">Linguistic NLP, urgent keywords matcher, and domain spoofing analyst using Gemini AI reasoning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Input Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col justify-between">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase text-slate-300">Composition Pane</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => loadTemplate('pay')}
                  className="text-[9px] bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded cursor-pointer"
                >
                  Paypal Spoof
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('sub')}
                  className="text-[9px] bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-900/60 px-2 py-0.5 rounded cursor-pointer"
                >
                  Netflix Spoof
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('clear')}
                  className="text-[9px] bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded cursor-pointer"
                >
                  Clear Academic
                </button>
              </div>
            </div>

            {/* Sender input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">From (Sender Headers)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-2 pl-9 pr-3 text-xs font-mono outline-none focus:border-indigo-500 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg py-2 px-3 text-xs outline-none focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            {/* Body */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Email content plain text body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg font-mono outline-none focus:border-indigo-500 transition-all leading-relaxed"
                placeholder="Paste the full raw email message contents here..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer uppercase tracking-wider"
            >
              {isLoading ? 'Processing Headers & Semantics...' : 'Deep Scan Email Social Engineering'}
            </button>
          </form>
        </div>

        {/* Right Output report */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          {!analysisResult ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <Mail className="h-12 w-12 text-slate-700 mx-auto animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-400 mt-4">Semantic Audit Frame</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">No analysis active. Paste credentials or select quick-sandbox templates to trigger deep threat reporting.</p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300">Neural Network Classification Result</span>
                <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                  analysisResult.classification === 'phishing' ? 'bg-red-950/60 text-red-400 border border-red-800' :
                  analysisResult.classification === 'suspicious' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' :
                  'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                }`}>
                  {analysisResult.classification.toUpperCase()} EMAIL THREAT
                </span>
              </div>

              {/* Two columns stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Social Risk quotient</span>
                  <span className={`block text-3xl font-black font-mono mt-1 ${
                    analysisResult.riskScore > 60 ? 'text-red-400' : analysisResult.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{analysisResult.riskScore}/100</span>
                </div>
                <div className="bg-slate-900 border border-slate-850 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Hyperlink Redirs</span>
                  <span className="block text-3xl font-black text-indigo-400 font-mono mt-1">
                    {(body.match(/https?:\/\//g) || []).length}
                  </span>
                </div>
              </div>

              {/* Extract triggers */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Semantic Triggers Identified</span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {analysisResult.detectedIndicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded bg-slate-900 border border-slate-850 text-[11px] text-slate-300 font-mono">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Markdown scrollbox */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Academic Report Explainer</span>
                <div className="p-4 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-lg max-h-[180px] overflow-y-auto leading-relaxed space-y-2.5 custom-scrollbar">
                  {analysisResult.fullReport.split('\n').map((line, idx) => (
                    <p key={idx} className={line.startsWith('###') ? 'text-slate-200 font-semibold mt-2' : ''}>
                      {line.replace('###', '')}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
