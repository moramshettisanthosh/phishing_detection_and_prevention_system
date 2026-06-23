import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Shield, RefreshCw, Sparkles, HelpCircle, User } from 'lucide-react';
import { SecBotMessage } from '../types';

export default function SecBot() {
  const [messages, setMessages] = useState<SecBotMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Greetings. I am **PhishShield AI Cyber Advisor**. I can assist with academic explanations about our minor project, explain URL feature engineering calculations (like Shannon entropy value formulations), and evaluate which ML classifiers provide high-precision F1 training metrics on Kaggle datasets.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: SecBotMessage = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error('Chat API error');
      }

      const data = await response.json();
      const assistantMsg: SecBotMessage = {
        id: 'bot-' + Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages(prev => [...prev, {
        id: 'bot-err-' + Math.random().toString(36).substr(2, 9),
        sender: 'assistant',
        text: 'I am running in offline sandbox environment. Here are quick notes:\n- **URL Length**: Lengths over 60 often indicate hidden resource redirection directories.\n- **Ensemble Classifier**: XGBoost models achieve up to 98% recall accuracy when trained on clean UCI standard databases.\nHow else can I help debug your B.Tech systems today?',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (txt: string) => {
    handleSend(txt);
  };

  const suggestions = [
    "What is Quishing and how does a vision model prevent it?",
    "Explain how Shannon Entropy calculates URL string randomness",
    "Which Machine Learning Model excels at detecting phishing and why?",
    "Show IEEE bibliography references for a phishing minor project"
  ];

  return (
    <div id="secbot-root" className="space-y-6 flex flex-col h-[calc(100vh-180px)] min-h-[480px]">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="text-cyan-400 h-6.5 w-6.5" /> LLM Cybersecurity & Research Advisor
        </h2>
        <p className="text-slate-400 text-sm mt-1">Academically tuned Chatbot answering questions on neural architectures, weights, and feature extraction.</p>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        {/* Chat window */}
        <div className="flex-1 flex flex-col justify-between bg-slate-950/40">
          {/* Scrollbox messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[380px] custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-650 text-white' 
                    : 'bg-slate-900 border border-slate-850 text-slate-300'
                }`}>
                  <div className="flex items-center gap-1.5 border-b border-slate-800/60 pb-1 mb-1.5 text-[9px] text-slate-400 font-mono">
                    {m.sender === 'user' ? (
                      <>
                        <User className="h-3 w-3" />
                        <span>OPERATOR</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 text-cyan-400 animate-spin" />
                        <span>PHISHSHIELD CORE ADVISOR</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {/* Markdown rendering simulation (split by markdown symbols) */}
                  <div className="space-y-2 whitespace-pre-wrap">
                    {m.text.split('**').map((item, idx) => (
                      idx % 2 === 1 ? <strong key={idx} className="text-white font-bold">{item}</strong> : item
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 font-mono p-3">
                <RefreshCw className="h-4.5 w-4.5 animate-spin text-cyan-400" /> Computing threat embeddings...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* User input box */}
          <div className="p-3 border-t border-slate-850 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(input);
              }}
              placeholder="Ask about validation techniques, ROC tables, or quishing visual protection..."
              className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg py-2.5 px-4 outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={() => handleSend(input)}
              type="button"
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-lg transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Sidebar */}
        <div className="w-full lg:w-72 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 space-y-4">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" /> Quick-Consult Topics
          </span>
          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="w-full p-2.5 text-left bg-slate-950 hover:bg-slate-850 hover:border-slate-700 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 transition-all font-sans cursor-pointer leading-normal block"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
