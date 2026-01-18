
import React, { useState, useCallback, useEffect } from "react";
import { IpData } from "types";
import { ENDPOINTS, WILL_FAIL_MIXED_CONTENT } from "../../constants";

interface IpLookupFormProps {
  onLookupSuccess: () => void;
  isDemoMode: boolean;
  onEnableDemo: () => void;
}

const IpLookupForm: React.FC<IpLookupFormProps> = ({ onLookupSuccess, isDemoMode, onEnableDemo }) => {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type: 'network' | 'validation' | 'server' | 'mixed-content' } | null>(null);
  const [ipData, setIpData] = useState<IpData | null>(null);

  const performDemoLookup = useCallback(() => {
    const demoData: IpData = {
      id: Math.floor(Math.random() * 999999),
      ipAddress: ip || "4.4.4.4",
      country: "United States",
      city: "Montgomery",
      isp: "Level Parent, LLC",
      latitude: 41.730585,
      longitude: -88.3459048,
      createdAt: new Date().toISOString()
    };
    setIpData(demoData);
    setError(null);
    onLookupSuccess();
  }, [ip, onLookupSuccess]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (ip && !ipRegex.test(ip)) {
        setError({ message: "Invalid IPv4 sequence detected.", type: 'validation' });
        return;
      }

      setLoading(true);
      setError(null);

      if (isDemoMode) {
        setTimeout(() => {
          performDemoLookup();
          setLoading(false);
        }, 800);
        return;
      }

      try {
        if (WILL_FAIL_MIXED_CONTENT) {
          throw new Error("Mixed Content Restriction detected.");
        }

        const response = await fetch(ENDPOINTS.LOOKUP, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ ip }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `API Node rejected the handshake (${response.status})`);
        }

        const rawData = await response.json();
        const data: IpData = {
          ...rawData,
          ipAddress: rawData.ip_address || rawData.ipAddress,
          createdAt: rawData.created_at || rawData.createdAt,
        };
        setIpData(data);
        onLookupSuccess();
      } catch (err: any) {
        console.error("Lookup Failure:", err);
        const errorMessage = err.message || "";
        const isNetworkError = 
          errorMessage.toLowerCase().includes("load failed") || 
          errorMessage.toLowerCase().includes("failed to fetch") || 
          err.name === 'TypeError';

        setError({ 
          message: isNetworkError 
            ? "Sunucuya ulaşılamıyor. Localhost:3000 kapalı olabilir." 
            : errorMessage, 
          type: isNetworkError ? 'network' : 'server' 
        });
      } finally {
        setLoading(false);
      }
    },
    [ip, isDemoMode, onLookupSuccess, performDemoLookup]
  );

  return (
    <div className="w-full space-y-10">
      <div className="relative p-[1px] rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 shadow-2xl">
        <div className="bg-[#0b1120] rounded-[3rem] p-10 lg:p-14 backdrop-blur-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-4">
                  <span className={`w-3 h-10 rounded-full shadow-2xl transition-colors duration-500 ${isDemoMode ? 'bg-amber-500 shadow-amber-500/50' : 'bg-blue-600 shadow-blue-500/50'}`}></span>
                  Scan Terminal
                </h2>
                <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest opacity-60">Input network identifier to begin trace</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800">
                <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-blue-500 animate-pulse'}`}></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{isDemoMode ? 'Demo Mode Active' : 'Awaiting Command'}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-5">
              <div className="relative flex-grow group">
                <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="Target IP (e.g. 4.4.4.4)"
                  disabled={loading}
                  className="w-full pl-16 pr-8 py-7 bg-slate-950/80 border border-slate-800 rounded-[1.5rem] text-white font-black text-xl placeholder:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-14 py-7 font-black rounded-[1.5rem] text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 text-xl group ${isDemoMode ? 'bg-amber-600 shadow-amber-600/20 hover:bg-amber-500' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-500'}`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Execute</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-10 p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] animate-in slide-in-from-top-4">
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-red-500 font-black text-xs uppercase tracking-[0.2em] mb-2">Protocol Failure</h4>
                    <p className="text-slate-400 text-sm font-bold leading-relaxed">{error.message}</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button onClick={onEnableDemo} className="px-6 py-3 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/10">Bypass with Demo Mode</button>
                      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all">Retry Server</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Always render IpInfoCard, pass null if no data yet */}
      <IpInfoCard data={ipData} isDemoMode={isDemoMode} />
    </div>
  );
};

const IpInfoCard: React.FC<{ data: IpData | null; isDemoMode: boolean }> = ({ data, isDemoMode }) => {
  const [copied, setCopied] = useState(false);

  const copyIp = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.ipAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Default to 0,0 if no data
  const lat = data?.latitude ?? 0;
  const lon = data?.longitude ?? 0;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=3&output=embed`;

  // Fix Invalid Date by ensuring data.createdAt is a valid string
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "---";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "---" : d.toLocaleDateString('tr-TR');
  };

  const intelFields = [
    { label: "IP ADDRESS", value: data?.ipAddress || "---" },
    { label: "COUNTRY", value: data?.country || "---" },
    { label: "CITY", value: data?.city || "---" },
    { label: "ISP", value: data?.isp || "---" },
    { label: "COORDINATES", value: data ? `${data.latitude}, ${data.longitude}` : "---" },
    { label: "RECORD DATE", value: formatDate(data?.createdAt) },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000">
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-7 relative h-[450px] lg:h-[700px] bg-black overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/50">
            <iframe 
              title="Intel Satellite"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src={mapUrl}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={`grayscale invert opacity-40 transition-all duration-1000 ${data ? 'contrast-[1.6] scale-[1.2] brightness-[0.7]' : 'contrast-[1.1] scale-[1.0] brightness-[0.4]'}`}
            ></iframe>
            
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent h-1/2 w-full animate-[radar_3s_linear_infinite]"></div>
              {data && (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/20 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_20px_10px_rgba(59,130,246,0.5)]"></div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-12 flex flex-col justify-between bg-gradient-to-b from-slate-900/50 to-slate-950/80">
            <div className="space-y-10">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDemoMode ? 'text-amber-500' : 'text-blue-500'}`}>Target Analysis</h3>
                  <div className="flex items-center gap-3">
                    <p className="text-4xl font-black text-white tracking-tighter truncate max-w-[300px]">
                      {data?.ipAddress || "Awaiting Signal"}
                    </p>
                  </div>
                </div>
                {data && (
                  <button 
                    onClick={copyIp}
                    className="w-12 h-12 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center transition-all group"
                  >
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {intelFields.map((field, idx) => (
                  <div key={idx} className="group/field">
                    <div className="flex items-center gap-3 mb-1.5">
                       <div className={`w-1 h-3 rounded-full transition-colors ${isDemoMode ? 'bg-amber-500/30 group-hover/field:bg-amber-500' : 'bg-blue-500/30 group-hover/field:bg-blue-500'}`}></div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{field.label}</p>
                    </div>
                    <p className={`text-lg font-bold tracking-tight transition-colors duration-300 ${data ? 'text-white group-hover/field:text-blue-400' : 'text-slate-700'}`}>
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800/50">
              <a 
                href={data ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : "#"}
                target={data ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`w-full py-5 font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${data ? 'bg-white text-black hover:bg-slate-100' : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'}`}
              >
                <span>Satellite View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes radar {
          from { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default IpLookupForm;
