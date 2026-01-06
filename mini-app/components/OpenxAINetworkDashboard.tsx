'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  Cpu, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Server, 
  Share2, 
  Bot,
  Terminal,
  Sun,
  Moon,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Database,
  FileText,
  Layers,
  HardDrive,
  Radio,
  Wifi,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import XnodeNetworkGraph from './XnodeNetworkGraph';
import TechStackModal from './TechStackModal';

export default function OpenxAINetworkDashboard() {
  const [activeTab, setActiveTab] = useState<'network' | 'workloads' | 'market' | 'about'>('workloads');
  const [darkMode, setDarkMode] = useState(true);
  const [gossipFeed, setGossipFeed] = useState<any[]>([]); // Workloads (Jobs)
  const [gossipLogs, setGossipLogs] = useState<any[]>([]); // Network Overhead (Heartbeats)
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string>('0.1124');
  const [networkStats, setNetworkStats] = useState<any>(null);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
      if (darkMode) {
          document.documentElement.classList.remove('dark');
      } else {
          document.documentElement.classList.add('dark');
      }
  };

  // Price Ticker
  useEffect(() => {
    const fetchPrice = async () => {
        try {
            const res = await fetch('https://api.dexscreener.com/latest/dex/search?q=OPEN%20Base');
            const data = await res.json();
            const pair = data.pairs?.find((p: any) => p.baseToken.symbol === 'OPEN' && p.chainId === 'base');
            if (pair) setTokenPrice(parseFloat(pair.priceUsd).toFixed(4));
        } catch (e) { /* ignore */ }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Network Stats
  useEffect(() => {
    const fetchStats = async () => {
        try {
            let res = await fetch('/api/network-stats');
            if (!res.ok) res = await fetch('https://transparencyseal.com/api/network-stats');
            if (res.ok) setNetworkStats(await res.json());
        } catch (e) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Real Gossip WORKLOAD Feed (Events)
  useEffect(() => {
    const fetchFeed = async () => {
        try {
            let res = await fetch('/api/gossip/feed');
            if (!res.ok) res = await fetch('http://34.170.105.111/api/gossip/feed');
            if (res.ok) {
                const data = await res.json();
                if (data.events?.length > 0) setGossipFeed(data.events);
            }
        } catch (e) {}
    };
    fetchFeed();
    const interval = setInterval(fetchFeed, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Real Gossip NETWORK LOGS (Overhead)
  useEffect(() => {
    const fetchLogs = async () => {
        try {
            let res = await fetch('/api/gossip/logs');
            if (!res.ok) res = await fetch('http://34.170.105.111/api/gossip/logs');
            if (res.ok) {
                const data = await res.json();
                if (data.logs?.length > 0) setGossipLogs(data.logs);
            }
        } catch (e) {}
    };
    if (activeTab === 'network') {
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Calculations
  const calculateDataVolume = (stats: any) => {
      if (!stats) return '...';
      const total = ((stats.projects || 0) * 0.000005) + ((stats.documents || 0) * 0.002);
      return total < 1 ? '< 1 GB' : `${total.toFixed(2)} GB`;
  };
  const calculateTotalDocs = (stats: any) => ((stats?.projects || 0) + (stats?.documents || 0)).toLocaleString();

  return (
    <div className={clsx("min-h-screen transition-colors duration-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden", darkMode ? "bg-[#050505] text-gray-200" : "bg-gray-50 text-gray-900")}>
      
      {/* NAVBAR */}
      <nav className={clsx("sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-colors duration-300", darkMode ? "bg-[#0a0a0a]/80 border-white/5" : "bg-white/80 border-gray-200")}>
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]"><Network className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className={clsx("text-xl font-bold tracking-tight", darkMode ? "text-white" : "text-gray-900")}>OPENXAI <span className="text-blue-500">NETWORK</span></h1>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Decentralized Intelligence</p>
            </div>
          </div>
          
          <div className={clsx("hidden md:flex items-center gap-1 p-1 rounded-lg border", darkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200")}>
            {['workloads', 'network', 'market'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 capitalize", activeTab === tab ? (darkMode ? "bg-white/10 text-white shadow-lg shadow-white/5 border border-white/10" : "bg-white text-gray-900 shadow border border-gray-200") : (darkMode ? "text-gray-500 hover:text-gray-300 hover:bg-white/5" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"))}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <a href="https://openxai.org" target="_blank" rel="noopener noreferrer" className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-mono group", darkMode ? "bg-blue-900/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/40" : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100")}>
                <div className="p-1 rounded-full bg-blue-500 text-white"><TrendingUp className="w-3 h-3" /></div>
                <span className="font-bold">$OPEN</span><span>${tokenPrice}</span>
             </a>
             <button onClick={toggleDarkMode} className={clsx("p-2 rounded-full transition-colors", darkMode ? "bg-white/10 hover:bg-white/20 text-yellow-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600")}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
             <a href="/" className={clsx("text-xs font-mono hover:underline", darkMode ? "text-gray-400" : "text-gray-600")}>← Back Home</a>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* WORKLOADS TAB */}
          {activeTab === 'workloads' && (
              <motion.section key="workloads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
                  {/* WORKLOAD STATS CONTAINER */}
                  <div className={clsx("border rounded-2xl overflow-hidden p-6", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}>
                       <div className="flex justify-between items-center mb-6">
                           <div className="flex items-center gap-3">
                               <div className="p-2 rounded bg-blue-500/20 text-blue-400"><Layers className="w-6 h-6" /></div>
                               <div><h2 className="text-xl font-bold">Active Network Workloads</h2><p className="text-xs text-gray-400">Real-time job distribution across the swarm</p></div>
                           </div>
                           <div className="text-right"><div className="text-2xl font-bold text-green-400">{networkStats?.active_nodes || 5}</div><div className="text-[10px] text-gray-500 uppercase tracking-wider">Active Nodes</div></div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           {/* LEFT: INFO PANEL */}
                           <div className="flex flex-col gap-4">
                               <div className={clsx("p-6 rounded-xl h-full flex flex-col justify-center", darkMode ? "bg-white/5" : "bg-gray-50")}>
                                   <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-400">
                                       <Info className="w-5 h-5" /> Why OpenxAI?
                                   </h3>
                                   <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                       This dashboard visualizes the world's first <strong>decentralized AI compute network</strong>. Unlike closed clouds (AWS, Azure) which are centralized points of failure and censorship, OpenxAI aggregates idle GPU power from consumer devices ("Xnodes") into a unified "Hive Mind".
                                   </p>
                                   <p className="text-sm text-gray-400 leading-relaxed">
                                       This allows for censorship-resistant, privacy-preserving, and ultra-low-cost AI inference. The stats on the right represent real-time data being secured, processed, and embedded by this community-owned infrastructure right now.
                                   </p>
                               </div>
                           </div>

                           {/* RIGHT: STATS GRID */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className={clsx("p-4 rounded-xl border", darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                                   <div className="flex justify-between items-start mb-2"><span className="text-xs text-gray-500 uppercase">Documents Ingested</span><FileText className="w-4 h-4 text-blue-500" /></div>
                                   <div className="text-2xl font-bold">{calculateTotalDocs(networkStats)}</div><div className="text-[10px] text-gray-400">Knowledge Base</div>
                               </div>
                               <div className={clsx("p-4 rounded-xl border", darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                                   <div className="flex justify-between items-start mb-2"><span className="text-xs text-gray-500 uppercase">Data Processed</span><HardDrive className="w-4 h-4 text-purple-500" /></div>
                                   <div className="text-2xl font-bold">{calculateDataVolume(networkStats)}</div><div className="text-[10px] text-gray-400">Secured Volume</div>
                               </div>
                               <div className={clsx("p-4 rounded-xl border", darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                                   <div className="flex justify-between items-start mb-2"><span className="text-xs text-gray-500 uppercase">Vector Embeddings</span><Zap className="w-4 h-4 text-yellow-500" /></div>
                                   <div className="text-2xl font-bold">{networkStats?.embeddings?.toLocaleString() || '...'}</div><div className="text-[10px] text-gray-400">AI Ready (RAG)</div>
                               </div>
                               <div className={clsx("p-4 rounded-xl border", darkMode ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                                   <div className="flex justify-between items-start mb-2"><span className="text-xs text-gray-500 uppercase">Throughput</span><Activity className="w-4 h-4 text-green-500" /></div>
                                   <div className="text-2xl font-bold">{networkStats?.tps || 12} <span className="text-xs font-normal text-gray-500">TPS</span></div><div className="text-[10px] text-gray-400">Tokens / Second</div>
                               </div>
                           </div>
                       </div>
                  </div>

                  {/* ACTIVE JOBS LIST */}
                  <div className={clsx("border rounded-2xl overflow-hidden flex flex-col h-[500px]", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}>
                      <div className="p-4 border-b flex justify-between items-center">
                          <h3 className="font-bold text-sm uppercase tracking-wider">Job Queue (GossipSub)</h3>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span><span className="text-xs text-gray-500">SYNCING</span></div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2">
                          <div className="grid grid-cols-12 text-[10px] text-gray-500 uppercase font-bold px-3 pb-2 border-b border-white/5">
                              <div className="col-span-2">Job Type</div><div className="col-span-3">Model / Task</div><div className="col-span-2">Node</div><div className="col-span-3">Details</div><div className="col-span-2 text-right">Status</div>
                          </div>
                          {gossipFeed.filter(j => j.type !== 'BID').map((job, i) => (
                              <div key={i} className={clsx("grid grid-cols-12 text-xs items-center p-3 rounded border transition-colors", darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-gray-100 hover:bg-gray-100")}>
                                  <div className="col-span-2 font-bold text-gray-300">{job.type}</div>
                                  <div className="col-span-3 text-blue-400">{job.model}</div>
                                  <div className="col-span-2 text-gray-500 font-mono">{job.node}</div>
                                  <div className="col-span-3 text-gray-500 truncate">
                                      {job.details || '-'}
                                      {job.tpm_hash && (
                                          <div className="flex items-center gap-1 mt-1 text-[9px] text-green-500 font-mono">
                                              <ShieldCheck className="w-3 h-3" /> 
                                              TPM: {job.tpm_hash.substring(0, 10)}... (Verified)
                                          </div>
                                      )}
                                  </div>
                                  <div className="col-span-2 text-right">
                                      <span className={clsx("px-2 py-1 rounded-full text-[10px] font-bold", job.status === 'COMPLETED' ? "bg-green-500/20 text-green-400" : job.status === 'PROCESSING' || job.status === 'ACTIVE' ? "bg-blue-500/20 text-blue-400 animate-pulse" : "bg-yellow-500/20 text-yellow-400")}>{job.status}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </motion.section>
          )}

          {/* NETWORK TAB */}
          {activeTab === 'network' && (
             <motion.section key="network" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-6">
               <div className="flex flex-col lg:flex-row gap-6">
                   <div className={clsx("flex-1 border rounded-2xl overflow-hidden relative flex flex-col h-[600px]", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200 shadow-sm")}>
                      <div className="absolute top-4 left-4 z-10 max-w-sm pointer-events-none">
                         <div className="bg-black/60 backdrop-blur-sm p-4 rounded border border-white/10 pointer-events-auto">
                            <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> Decentralized Inference Swarm</h4>
                            <p className="text-xs text-gray-300 leading-relaxed mb-3"><span className="text-blue-400 font-bold">The Killer AI App:</span> OpenxAI is not just another network...</p>
                            <div className="flex gap-2"><span className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">Active Nodes: {networkStats?.active_nodes || 5}</span></div>
                         </div>
                      </div>
                      <div className="flex-1 bg-black relative"><XnodeNetworkGraph height={600} darkMode={darkMode} /></div>
                   </div>
                   <div className={clsx("w-full lg:w-96 border rounded-2xl overflow-hidden flex flex-col h-[600px]", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200 shadow-sm")}>
                       <div className={clsx("p-4 border-b", darkMode ? "border-white/5" : "border-gray-100")}><h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-500" /> Mixture of Agents (MoA)</h3></div>
                       <div className="p-6 space-y-6 overflow-y-auto">
                           <div className="space-y-2"><h4 className="text-sm font-bold text-purple-400">Collaborative Intelligence</h4><p className="text-xs text-gray-400 leading-relaxed">How do we beat GPT-4 with smaller models? The answer is our <strong>Mixture of Agents (MoA)</strong>...</p></div>
                           <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                               <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs">A</div><div><div className="text-xs font-bold text-gray-200">Aggregator Node</div><div className="text-[10px] text-gray-500">Decomposes prompt</div></div></div>
                               <div className="h-4 w-0.5 bg-gray-700 ml-4"></div>
                               <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">P</div><div><div className="text-xs font-bold text-gray-200">Proposer Nodes</div><div className="text-[10px] text-gray-500">Run Llama 3, Qwen...</div></div></div>
                           </div>
                       </div>
                   </div>
               </div>
               
               {/* NETWORK OVERHEAD LOGS */}
               <div className={clsx("border rounded-2xl overflow-hidden flex flex-col h-[300px]", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}>
                   <div className="p-4 border-b flex justify-between items-center">
                       <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Wifi className="w-4 h-4 text-gray-400" /> Live Gossip Protocol (Network Overhead)</h3>
                       <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><span className="text-xs text-gray-500">CONNECTED</span></div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 bg-black font-mono text-[10px] text-green-500 space-y-1">
                       {gossipLogs.length === 0 && <div className="text-gray-600 italic">Waiting for peer discovery events...</div>}
                       {gossipLogs.map((log, i) => (
                           <div key={i} className="opacity-80 hover:opacity-100">
                               <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
                           </div>
                       ))}
                   </div>
               </div>
            </motion.section>
          )}

          {/* MARKET TAB */}
          {activeTab === 'market' && (
             <motion.section key="market" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className={clsx("border rounded-2xl overflow-hidden p-8", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}>
                   <div className="flex items-center gap-3 mb-6"><div className="p-2 rounded bg-yellow-500/20 text-yellow-500"><Zap className="w-6 h-6" /></div><h2 className="text-2xl font-bold">The Gossip Marketplace</h2></div>
                   <div className="space-y-6 text-sm leading-relaxed text-gray-400">
                       <p>The heartbeat of our network is the <span className="text-yellow-400 font-bold">Gossip Protocol</span>. Nodes constantly communicate—gossiping—about their capabilities, availability, and reputation.</p>
                       <p>Real-time bids are broadcasted by latent nodes (Xnodes) competing for workloads. The lowest price/latency wins.</p>
                   </div>
               </div>
               <div className={clsx("border rounded-2xl overflow-hidden flex flex-col h-[500px]", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}>
                   <div className="p-4 border-b flex justify-between items-center">
                       <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Radio className="w-4 h-4 text-yellow-500" /> Live Bid Stream</h3>
                       <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span><span className="text-xs text-gray-500">AUCTION ACTIVE</span></div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-4 space-y-2">
                       <div className="grid grid-cols-12 text-[10px] text-gray-500 uppercase font-bold px-3 pb-2 border-b border-white/5">
                           <div className="col-span-3">Model</div><div className="col-span-3">Node</div><div className="col-span-4">Bid Price</div><div className="col-span-2 text-right">Status</div>
                       </div>
                       {gossipFeed.filter(j => j.type === 'BID').map((job, i) => (
                           <div key={i} className={clsx("grid grid-cols-12 text-xs items-center p-3 rounded border transition-colors", darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-gray-100 hover:bg-gray-100")}>
                               <div className="col-span-3 text-blue-400">{job.model}</div>
                               <div className="col-span-3 text-gray-500 font-mono">{job.node}</div>
                               <div className="col-span-4 text-green-400 font-mono">{job.details}</div>
                               <div className="col-span-2 text-right">
                                   <span className={clsx("px-2 py-1 rounded-full text-[10px] font-bold", job.status === 'ACCEPTED' ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400")}>{job.status}</span>
                               </div>
                           </div>
                       ))}
                       {gossipFeed.filter(j => j.type === 'BID').length === 0 && (
                           <div className="p-8 text-center text-gray-600 text-xs italic">Waiting for bids...</div>
                       )}
                   </div>
               </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* FEATURES & BENEFITS (Always Visible) */}
        <div className="mt-16 pt-12 border-t border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className={clsx("p-6 rounded-2xl border", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}><ShieldCheck className="w-10 h-10 text-green-500 mb-4" /><h3 className="text-lg font-bold mb-2">Trustless Verification</h3><p className="text-sm text-gray-400">Using TPM2 remote attestation to cryptographically prove that code running on Xnodes has not been tampered with.</p></div>
               <div className={clsx("p-6 rounded-2xl border", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}><Server className="w-10 h-10 text-blue-500 mb-4" /><h3 className="text-lg font-bold mb-2">Privacy First</h3><p className="text-sm text-gray-400">Data can be processed on private enclaves (TEE) where even the node operator cannot see the contents.</p></div>
               <div className={clsx("p-6 rounded-2xl border", darkMode ? "bg-[#0f0f0f] border-white/5" : "bg-white border-gray-200")}><Terminal className="w-10 h-10 text-purple-500 mb-4" /><h3 className="text-lg font-bold mb-2">Cost Efficiency</h3><p className="text-sm text-gray-400">By utilizing idle compute power from consumer devices globally, we reduce inference costs by up to 90%.</p></div>
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Powered by <a href="https://openxai.org" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">OpenxAI</a></h2>
                <p className="text-gray-500 max-w-2xl mx-auto mb-8">The future of AI is open, decentralized, and verifiable.</p>
                <button onClick={() => setIsTechStackOpen(true)} className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">View Technical Stack</button>
            </div>
        </div>

        <TechStackModal isOpen={isTechStackOpen} onClose={() => setIsTechStackOpen(false)} darkMode={darkMode} />
      </main>
    </div>
  );
}
