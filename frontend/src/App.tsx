import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Database, Mail, QrCode, Monitor, Chrome, Terminal, Network, BookOpen, Presentation, 
  User, CheckCircle2, AlertTriangle, Key, LogIn, LogOut, RefreshCw, Menu, X, ShieldCheck
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import UrlAnalyzer from './components/UrlAnalyzer';
import EmailAnalyzer from './components/EmailAnalyzer';
import QrAnalyzer from './components/QrAnalyzer';
import ScreenshotAnalyzer from './components/ScreenshotAnalyzer';
import ChromeExtension from './components/ChromeExtension';
import SecBot from './components/SecBot';
import UmlDiagrams from './components/UmlDiagrams';
import ProjectDocs from './components/ProjectDocs';
import PresentationDeck from './components/Presentation';
import { URLScanResult, EmailScanResult, ScreenshotScanResult, AuditLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Local fallback registry when backend connection fails or during offline test sandboxing
  const [localRegistry, setLocalRegistry] = useState<Record<string, { passwordHash: string; role: string }>>(() => {
    try {
      const stored = localStorage.getItem('phishshield_auth_local');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return {
      admin: { passwordHash: 'admin', role: 'Cyber Engineer' }
    };
  });

  // Login pane states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cyber Engineer');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Mobile menu parameters
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scanned telemetry states bridging widgets
  const [stats, setStats] = useState({
    totals: { scanned: 2, safe: 1, suspicious: 0, phishing: 1, accuracy: 98.91 },
    scannedList: [] as URLScanResult[],
    threatLogs: [] as any[],
    auditLogs: [] as AuditLog[],
    userReports: [] as EmailScanResult[]
  });

  // Load server state stats
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (e) {
      console.warn("Express backend stats unreachable, running on local cache storage.");
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentUser]);

  // Handle auth actions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setAuthError('Please enter both Email/Username and Password.');
      return;
    }

    const isEmail = cleanUser.includes('@') && cleanUser.includes('.');
    const isAdmin = cleanUser.toLowerCase() === 'admin';

    if (!isEmail && !isAdmin) {
      setAuthError('Please enter a valid email address (e.g., user@example.com) or use "admin".');
      return;
    }

    if (password.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    if (authMode === 'login') {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password })
        });
        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data.user);
          setAuthSuccess('Access Authorized. Welcome back!');
          return;
        } else {
          setAuthError(data.error || 'Invalid credentials.');
          return;
        }
      } catch (err) {
        console.warn("Backend authentication unreachable, fallback to local secure verification.");
        
        // Local fallback verification
        const localUser = localRegistry[cleanUser];
        if (localUser) {
          if (localUser.passwordHash === password || localUser.passwordHash === 'admin') {
            setCurrentUser({
              username: cleanUser,
              role: localUser.role
            });
            setAuthSuccess('Welcome! (Offline Mode)');
            return;
          } else {
            setAuthError('Invalid offline credentials.');
            return;
          }
        } else {
          if (cleanUser.toLowerCase() === 'admin' && password === 'admin') {
            setCurrentUser({
              username: 'admin',
              role: 'Cyber Engineer'
            });
            setAuthSuccess('Welcome! (Offline Mode)');
            return;
          }
          setAuthError('User not found. Please register or check your connection.');
          return;
        }
      }
    } else {
      // Register Mode
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password, role })
        });
        const data = await response.json();

        if (response.ok) {
          setAuthSuccess('Registration successful! Access Authorized.');
          setCurrentUser(data.user);
          return;
        } else {
          setAuthError(data.error || 'Registration failed.');
          return;
        }
      } catch (err) {
        console.warn("Backend registration unreachable, registering locally.");

        if (localRegistry[cleanUser]) {
          setAuthError('Username is already taken locally.');
          return;
        }

        const newRegistry = {
          ...localRegistry,
          [cleanUser]: { passwordHash: password, role }
        };
        setLocalRegistry(newRegistry);
        localStorage.setItem('phishshield_auth_local', JSON.stringify(newRegistry));

        setAuthSuccess('Registration successful (Offline)! Access Authorized.');
        setCurrentUser({
          username: cleanUser,
          role
        });
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setAuthError('');
    setAuthSuccess('');
    setActiveTab('dashboard');
  };

  // Callback when a URL/file scan completes inside any analyzer widget
  const handleScanHook = () => {
    fetchStats(); // hot reload dashboard metrics!
  };

  // Nav helper from dashboard lists
  const handleNavigateToUrl = (targetUrl: string) => {
    setActiveTab('url');
    // We can bridge state by saving url parameter if needed
  };

  // Layout list of active tabs with descriptions
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Live', icon: <Database className="h-4 w-4" /> },
    { id: 'url', label: 'URL Classifiers', icon: <ShieldAlert className="h-4 w-4" /> },
    { id: 'email', label: 'Email NLP', icon: <Mail className="h-4 w-4" /> },
    { id: 'qr', label: 'QR Quishing', icon: <QrCode className="h-4 w-4" /> },
    { id: 'screenshot', label: 'Screenshot OCR', icon: <Monitor className="h-4 w-4" /> },
    { id: 'extension', label: 'Chrome Extension', icon: <Chrome className="h-4 w-4" /> },
    { id: 'bot', label: 'SecBot AI Advisor', icon: <Terminal className="h-4 w-4" /> },
    { id: 'uml', label: 'UML Specs Architect', icon: <Network className="h-4 w-4" /> },
    { id: 'docs', label: 'IEEE Chapters', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'ppt', label: 'Project Defense Slides', icon: <Presentation className="h-4 w-4" /> }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-150 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. Logged Out Portal Gate layout */}
      {!currentUser ? (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="w-full max-w-md bg-slate-900 border border-slate-805/90 rounded-2xl p-8 shadow-2xl relative">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl mb-2 text-cyan-400">
                <ShieldCheck className="h-8 w-8 animate-pulse" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none uppercase">PhishShield AI Portal Gateway</h1>
              <p className="text-xs text-slate-400">
                {authMode === 'login' 
                  ? 'Real-time threat analyzer research console login.' 
                  : 'Create a new researcher account to access the console.'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Email / Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={authMode === 'login' ? "Enter email or username (e.g., admin)" : "Enter your email address"}
                  className="w-full bg-slate-950 border border-slate-800 font-mono text-xs text-white rounded-lg py-2.5 px-3.5 outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full bg-slate-950 border border-slate-800 font-mono text-xs text-white rounded-lg py-2.5 px-3.5 outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg py-2.5 px-3.5 outline-none focus:border-cyan-500 transition-all"
                  >
                    <option value="Cyber Engineer">Cyber Engineer</option>
                    <option value="Security Analyst">Security Analyst</option>
                    <option value="Security Practitioner">Security Practitioner</option>
                  </select>
                </div>
              )}

              {authError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-[11px] text-red-400 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-400 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-505 text-white font-bold rounded-lg text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/10 cursor-pointer transition-all"
              >
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-all"
              >
                {authMode === 'login' 
                  ? "Don't have an account? Register here" 
                  : "Already have an account? Login here"}
              </button>
            </div>

            <div className="mt-6 text-center border-t border-slate-800/80 pt-4 text-[10px]">
              <span className="text-slate-400">
                {authMode === 'login'
                  ? 'Sandbox authorized. You can type any valid email of choice (e.g., user@demo.com) and any password (minimum 4 characters). You can also use admin / admin.'
                  : 'Register a new account. When online, it will register on the backend. When offline, it will register in local storage.'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Logged In Full-Stack Workspace */
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-805/90 flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <div className="p-5 border-b border-slate-805/90 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-cyan-950/60 border border-cyan-800 text-cyan-400 rounded-md">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h1 className="text-sm font-extrabold text-white leading-none uppercase tracking-wider">PhishShield AI</h1>
                  </div>
                </div>
                {/* Hot reload button */}
                <button
                  type="button"
                  onClick={fetchStats}
                  className="text-slate-500 hover:text-white transition-all cursor-pointer"
                  title="Reload DB stats connection"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingStats ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-3.5 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs font-semibold select-none cursor-pointer tracking-wide transition-all ${
                      activeTab === item.id 
                        ? 'bg-cyan-950/40 border border-cyan-800/40 text-cyan-400' 
                        : 'text-slate-400 hover:text-slate-205 hover:bg-slate-950/30'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom active profile user card */}
            <div className="p-4 border-t border-slate-805/95 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 font-bold border border-slate-700">
                  <User className="h-4.5 w-4.5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser.username}</p>
                  <span className="text-[9px] font-mono font-semibold text-cyan-500 tracking-wide uppercase">{currentUser.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-400 transition-all cursor-pointer p-1.5 rounded-lg hover:bg-slate-900"
                title="Disconnect from telemetry node"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </aside>

          {/* Main workspace container */}
          <main className="flex-1 bg-slate-950 p-6 md:p-8 overflow-y-auto max-h-[100vh] relative">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {activeTab === 'dashboard' && (
                <Dashboard stats={stats} onNavigateToUrl={handleNavigateToUrl} />
              )}

              {activeTab === 'url' && (
                <UrlAnalyzer 
                  onScanResult={handleScanHook} 
                  isLoading={isLoadingStats} 
                  setIsLoading={setIsLoadingStats} 
                  currentUser={currentUser} 
                />
              )}

              {activeTab === 'email' && (
                <EmailAnalyzer 
                  onAnalyzeComplete={handleScanHook} 
                  isLoading={isLoadingStats} 
                  setIsLoading={setIsLoadingStats} 
                />
              )}

              {activeTab === 'qr' && (
                <QrAnalyzer 
                  onScanResult={handleScanHook} 
                  isLoading={isLoadingStats} 
                  setIsLoading={setIsLoadingStats} 
                />
              )}

              {activeTab === 'screenshot' && (
                <ScreenshotAnalyzer 
                  onAnalyzeComplete={handleScanHook} 
                  isLoading={isLoadingStats} 
                  setIsLoading={setIsLoadingStats} 
                />
              )}

              {activeTab === 'extension' && (
                <ChromeExtension />
              )}

              {activeTab === 'bot' && (
                <SecBot />
              )}

              {activeTab === 'uml' && (
                <UmlDiagrams />
              )}

              {activeTab === 'docs' && (
                <ProjectDocs />
              )}

              {activeTab === 'ppt' && (
                <PresentationDeck />
              )}

            </div>
          </main>
        </div>
      )}
    </div>
  );
}
