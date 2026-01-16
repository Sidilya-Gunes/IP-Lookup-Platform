"use client";

import React, { useState, useEffect } from "react";
import IpLookupForm from "@/components/IpLookupForm";
import IpHistoryList from "@/components/IpHistoryList";
import { supabase } from "@/lib/supabase";

const App: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleLookupSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('netintel_demo_mode');
    if (savedMode === 'true') setIsDemoMode(true);

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');
      
      if (error) console.error('Error fetching posts:', error);
      else console.log('Posts:', data);
    };

    fetchData();
  }, []);

  const toggleDemoMode = () => {
    const newMode = !isDemoMode;
    setIsDemoMode(newMode);
    localStorage.setItem('netintel_demo_mode', String(newMode));
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] blur-[140px] pointer-events-none transition-colors duration-1000 ${isDemoMode ? 'bg-amber-500/5' : 'bg-blue-600/10'}`}></div>

      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${isDemoMode ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div>
               <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase">NetIntel <span className={isDemoMode ? 'text-amber-500' : 'text-blue-500'}>Pro</span></h1>
               <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-[0.2em]">Intel-Grade Geolocation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleDemoMode}
              className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${isDemoMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">Environment</span>
                <span className="text-xs font-bold leading-none mt-1">{isDemoMode ? 'Demo Mode' : 'Live API'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${isDemoMode ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isDemoMode ? 'left-5' : 'left-1'}`}></div>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{isDemoMode ? 'Simulated' : 'Active'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <IpLookupForm onLookupSuccess={handleLookupSuccess} isDemoMode={isDemoMode} onEnableDemo={() => setIsDemoMode(true)} />
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <IpHistoryList refreshTrigger={refreshTrigger} isDemoMode={isDemoMode} />
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-all"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-black text-white uppercase tracking-widest">Privacy Protocol</h5>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                    Tüm sorgular yerel veritabanınızda şifrelenmiş olarak saklanır. Canlı API modu için backend servisinin aktif olması gerekir.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-24 border-t border-slate-800 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <span className="text-sm font-black text-white tracking-[0.4em] uppercase">NetIntel Pro</span>
          </div>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">© 2024 Global Intelligence Systems</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
