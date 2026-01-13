import React, { useState, useEffect, useCallback } from "react";
import { IpData } from "types";
import { ENDPOINTS, WILL_FAIL_MIXED_CONTENT } from "../../constants";


interface IpHistoryListProps {
  refreshTrigger: number;
  isDemoMode: boolean;
}

const IpHistoryList: React.FC<IpHistoryListProps> = ({ refreshTrigger, isDemoMode }) => {
  const [history, setHistory] = useState<IpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; type: 'network' | 'mixed-content' | 'server' } | null>(null);

  const fetchHistory = useCallback(async () => {
    if (isDemoMode) {
      setLoading(true);
      setTimeout(() => {
        const mockHistory: IpData[] = [
          { id: 101, ipAddress: "8.8.8.8", country: "United States", city: "Mountain View", isp: "Google LLC", latitude: 37.42, longitude: -122.08, createdAt: new Date().toISOString() },
          { id: 102, ipAddress: "1.1.1.1", country: "Australia", city: "Sydney", isp: "Cloudflare", latitude: -33.86, longitude: 151.20, createdAt: new Date().toISOString() },
          { id: 103, ipAddress: "142.250.184.206", country: "Global", city: "Network Node", isp: "Google Core", latitude: 40.71, longitude: -74.00, createdAt: new Date().toISOString() }
        ];
        setHistory(mockHistory);
        setError(null);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      setLoading(true);
      if (WILL_FAIL_MIXED_CONTENT) {
        throw new Error("Mixed Content Restriction: Secured sites cannot call unsecured localhost APIs.");
      }

      const response = await fetch(ENDPOINTS.HISTORY, {
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Backend Node Protocol Error. Status: ${response.status}`);
      
      const data: IpData[] = await response.json();
      setHistory(data);
      setError(null);
    } catch (err: any) {
      console.error("History Sync Detailed Error:", err);
      const errorMessage = err.message || "";
      const isLoadFailed = 
        errorMessage.toLowerCase().includes("load failed") || 
        errorMessage.toLowerCase().includes("failed to fetch") || 
        err.name === 'TypeError';
      
      setError({ 
        message: isLoadFailed ? "Network Outage: Backend node offline." : errorMessage, 
        type: isLoadFailed ? 'network' : 'server' 
      });
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger, fetchHistory, isDemoMode]);

  if (loading && history.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-24 flex flex-col items-center justify-center backdrop-blur-md">
        <div className={`w-14 h-14 border-4 rounded-full animate-spin transition-colors duration-500 ${isDemoMode ? 'border-amber-500/20 border-t-amber-500' : 'border-blue-500/20 border-t-blue-500'}`}></div>
        <p className="mt-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Syncing Encrypted Logs...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] overflow-hidden backdrop-blur-md flex flex-col h-full min-h-[550px] max-h-[850px] shadow-2xl group/list">
      <div className="p-10 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/50 backdrop-blur-2xl z-20">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Audit Vault</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500 animate-pulse' : isDemoMode ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{history.length} Transactions Logged</p>
          </div>
        </div>
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl text-slate-500 transition-all active:scale-90 border border-slate-800 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-5 custom-scrollbar">
        {error && (
          <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[1.5rem] text-center animate-in fade-in duration-500">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Sync Connection Failure</p>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-6 italic">The audit node (localhost:3000) is currently offline or blocking the request.</p>
            <button 
              onClick={fetchHistory}
              className="px-4 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-700 transition-all"
            >
              Attempt Re-sync
            </button>
          </div>
        )}

        {history.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xs font-black uppercase tracking-widest">Vault is empty</p>
          </div>
        )}

        {history.map((item) => (
          <div key={item.id} className="group/item p-6 bg-slate-950/50 border border-slate-800/50 hover:border-blue-500/40 rounded-3xl transition-all duration-500">
            <div className="flex justify-between items-start mb-5">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Target IP</span>
                <p className="text-lg font-black text-white tracking-tight group-hover/item:text-blue-400 transition-colors">
                  {item.ipAddress}
                </p>
              </div>
              <span className="text-[10px] font-black text-slate-700 px-3 py-1 bg-slate-900 rounded-lg">ID-{item.id.toString().slice(-4)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 border-t border-slate-800 pt-5 mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Origin</span>
                <span className="text-xs font-bold text-slate-400 truncate">{item.city || 'GLOBAL'}, {item.country || 'NODAL'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Provider</span>
                <span className="text-xs font-bold text-slate-500 truncate italic">{item.isp || 'PRIVATE'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-8 bg-slate-950/30 border-t border-slate-800/50">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
           <span>Storage: Local Node</span>
           <span className={`transition-colors ${error ? 'text-red-500/50' : 'text-blue-500/50 group-hover/list:text-blue-500'}`}>
             {error ? 'Protocol Offline' : 'Vault Encrypted'}
           </span>
        </div>
      </div>
    </div>
  );
};

export default IpHistoryList;