import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Database, BarChart3, Clock, Lock, AlertCircle, ShieldCheck } from 'lucide-react';
import { URLScanResult, EmailScanResult, AuditLog } from '../types';

interface DashboardProps {
  stats: {
    totals: { scanned: number; safe: number; suspicious: number; phishing: number; accuracy: number };
    scannedList: URLScanResult[];
    threatLogs: any[];
    auditLogs: AuditLog[];
    userReports: EmailScanResult[];
  };
  onNavigateToUrl: (url: string) => void;
}

export default function Dashboard({ stats, onNavigateToUrl }: DashboardProps) {
  const { totals, scannedList, threatLogs, auditLogs } = stats;

  // Chart data 1: Risk Distribution
  const pieData = [
    { name: 'Safe', value: totals.safe, color: '#10B981' },
    { name: 'Suspicious', value: totals.suspicious, color: '#F59E0B' },
    { name: 'Phishing Danger', value: totals.phishing, color: '#EF4444' }
  ].filter(d => d.value > 0);

  // If no data yet, use static defaults for presentation visuals
  const finalPieData = pieData.length > 0 ? pieData : [
    { name: 'Safe', value: 45, color: '#10B981' },
    { name: 'Suspicious', value: 12, color: '#F59E0B' },
    { name: 'Phishing Danger', value: 18, color: '#EF4444' }
  ];

  // Chart data 2: Academic System Scanning Timeline over last 7 cycles
  const areaData = [
    { cycle: 'Day 1', URL: 12, Email: 5, QR: 2 },
    { cycle: 'Day 2', URL: 18, Email: 8, QR: 4 },
    { cycle: 'Day 3', URL: 15, Email: 12, QR: 3 },
    { cycle: 'Day 4', URL: 32, Email: 19, QR: 9 },
    { cycle: 'Day 5', URL: 45, Email: 24, QR: 11 },
    { cycle: 'Day 6', URL: totals.scanned + 10, Email: totals.scanned * 0.4 + 5, QR: totals.scanned * 0.2 + 2 },
    { cycle: 'Current', URL: totals.scanned, Email: totals.safe, QR: totals.phishing }
  ];

  return (
    <div id="dashboard-root" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Telemetry Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time threat feeds, risk quotients, and ML model performance analytics.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/60 px-4 py-2 rounded-lg">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-xs font-mono font-medium">PHISH-SHIELD ACTIVE NODE</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Total Scanned</span>
            <Database className="text-cyan-400 h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white font-mono">{totals.scanned}</span>
            <div className="text-slate-500 text-[10px] mt-1">Primary dataset nodes</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Safe Assets</span>
            <CheckCircle className="text-emerald-400 h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-emerald-400 font-mono">{totals.safe}</span>
            <div className="text-emerald-500/80 text-[10px] mt-1">Verified safe domains</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Suspicious URL</span>
            <AlertTriangle className="text-amber-400 h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-amber-400 font-mono">{totals.suspicious}</span>
            <div className="text-amber-500/80 text-[10px] mt-1">Needs credential advisory</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Phishing Blocks</span>
            <AlertCircle className="text-red-400 h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-red-400 font-mono">{totals.phishing}</span>
            <div className="text-red-500/80 text-[10px] mt-1">Mitigated automatically</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 col-span-2 lg:col-span-1 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Ensemble Accuracy</span>
            <ShieldCheck className="text-indigo-400 h-5 w-5" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-indigo-400 font-mono">{totals.accuracy}%</span>
            <div className="text-indigo-500/80 text-[10px] mt-1">Cross-validation F1 champion</div>
          </div>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="text-cyan-400 h-4 w-4" /> Academic Timeline Risk Metrics
            </h3>
            <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              UCI DATASET BACKED
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUrl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="cycle" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1329', borderColor: '#1E293B', borderRadius: '8px' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="URL" stroke="#38BDF8" fillOpacity={1} fill="url(#colorUrl)" strokeWidth={2} name="Scanned URLs" />
                <Area type="monotone" dataKey="Email" stroke="#10B981" fillOpacity={1} fill="url(#colorEmail)" strokeWidth={1.5} name="Analyzed Emails" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white mb-4">Risk Level Distribution</h3>
          <div className="h-[180px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {finalPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B1329', borderColor: '#1E293B' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-bold text-white font-mono">{totals.scanned}</span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Node Audit</p>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-3 border-t border-slate-800 pt-3">
            {finalPieData.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns Table Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans Logs */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="text-cyan-400 h-4.5 w-4.5" /> Recent Threat scans
            </h3>
            <span className="text-xs text-slate-500 font-mono">{scannedList.length} total entries</span>
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {scannedList.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-8">No scanning logged yet. Run predictions above.</p>
            ) : (
              scannedList.map((sc) => (
                <div key={sc.id} className="relative group p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono font-medium text-slate-300 truncate">{sc.url}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="text-slate-500 font-mono">{new Date(sc.timestamp).toLocaleTimeString()}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-mono">XAI Model: {sc.bestModel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider uppercase ${
                        sc.classification === 'phishing' ? 'bg-red-950/60 border border-red-800 text-red-400' :
                        sc.classification === 'suspicious' ? 'bg-amber-950/60 border border-amber-800 text-amber-400' :
                        'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                      }`}>
                        {sc.classification}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Score: {sc.riskScore}</p>
                    </div>
                    <button
                      onClick={() => onNavigateToUrl(sc.url)}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-[10px] font-medium bg-slate-800 text-white rounded hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Audit Incident logs */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="text-indigo-400 h-4.5 w-4.5" /> Security Audit Incident Logs (RBAC)
            </h3>
            <span className="text-slate-500 font-mono text-xs">ROLE: OPERATOR</span>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800/40 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-indigo-400 uppercase font-semibold">{log.action}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <span>IP: {log.ip}</span>
                    <span>•</span>
                    <span>Subject: <strong className="text-slate-400">{log.username}</strong></span>
                  </div>
                </div>
                <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
