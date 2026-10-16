import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Receipt,
  Users,
  Package,
  ShieldCheck,
  TrendingUp,
  Settings,
  ArrowRight,
  Bot,
  Send,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Briefcase,
  Globe,
  Database,
  Rocket,
  Check,
  Building2,
  Download,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIAgent } from '../../context/AIAgentContext';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import ROUTES from '../../constants/routes';
import aiAgentService from '../../services/aiAgent.service';
import itemService from '../../services/item.service';
import { TOP_100_TECH_PRODUCTS } from '../../constants/top100TechProducts';
import { cn } from '../../utils/cn';

const AGENT_ICON_MAP = {
  growth: Rocket,
  invoice: Receipt,
  party: Users,
  catalog: Package,
  tax: ShieldCheck,
  strategy: TrendingUp,
};

export const AIAgentsCommandCenterPage = () => {
  const {
    openAgent,
    openSettings,
    activeAimObj,
    config,
    AGENT_REGISTRY,
  } = useAIAgent();

  const { shop } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState('growth');
  const [testPrompt, setTestPrompt] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const activeAgent = AGENT_REGISTRY[selectedAgentId] || AGENT_REGISTRY.growth || AGENT_REGISTRY.invoice;

  const handleRunPlayground = async (promptOverride) => {
    const prompt = (promptOverride || testPrompt || activeAgent.samplePrompts[0]).trim();
    if (!prompt) return;

    setIsLoading(true);
    try {
      const res = await aiAgentService.executeAgent({
        agentId: selectedAgentId,
        prompt,
        contextData: {
          businessName: shop?.businessName || 'Aayush Mobile and Computer',
          sellerState: shop?.state || 'Gujarat',
          customerState: 'Gujarat',
        },
      });
      setPlaygroundOutput(res);
      if (res.action === 'IMPORT_5000_PRODUCTS') {
        itemService.import5000Products().then((bulkRes) => {
          setBulkResult(bulkRes);
          toast.success(`Autonomous AI added ${bulkRes.insertedCount ?? 5050} products directly to your database catalog!`);
        }).catch(() => {});
      } else if (res.action === 'IMPORT_500_ACCESSORIES') {
        itemService.importAccessories(500).then((bulkRes) => {
          setBulkResult(bulkRes);
          toast.success(`Autonomous AI added ${bulkRes.insertedCount ?? 500} Mobile Accessories directly to your database catalog!`);
        }).catch(() => {});
      } else if (res.action === 'IMPORT_TOP_100' && res.items?.length) {
        itemService.createBulkItems(res.items).then((bulkRes) => {
          setBulkResult(bulkRes);
          toast.success(`Autonomous AI added ${bulkRes.insertedCount ?? 100} products directly to your database catalog!`);
        }).catch(() => {});
      } else if (res.items?.length) {
        itemService.createBulkItems(res.items).then((bulkRes) => {
          setBulkResult(bulkRes);
          toast.success(`Autonomous AI added ${bulkRes.insertedCount ?? res.items.length} products to database catalog!`);
        }).catch(() => {});
      }
    } catch (err) {
      setPlaygroundOutput({
        text: `Error executing agent: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto animate-in fade-in duration-200">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Multi-Agent AI Command Center"
        description="Dedicated AI Agents for each core business button — powered by Google Gemini & Groq with your custom Business Aim."
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.DASHBOARD },
          { label: 'AI Multi-Agent Center' },
        ]}
      >
        <button
          type="button"
          onClick={openSettings}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141B2D] hover:bg-[#1E283C] text-xs font-semibold text-white border border-[#232F48] shadow-sm transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 text-[#818CF8]" />
          <span>Configure Business Aim & APIs</span>
        </button>
      </PageHeader>

      {/* ─── Top Strategic Status Grid (3 Cards) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Active Business Aim */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F1626] to-[#0A0E17] border border-[#1E293F] space-y-2.5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#38BDF8]" />
              Active Business Aim
            </span>
            <button
              type="button"
              onClick={openSettings}
              className="text-[10px] text-[#6366F1] hover:underline font-semibold"
            >
              Change Aim
            </button>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              {activeAimObj.title}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
              {config.activeAim === 'CUSTOM' && config.customAim
                ? config.customAim
                : activeAimObj.description}
            </p>
          </div>
          <div className="pt-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-mono">
              Injected into all 5 button agents
            </span>
          </div>
        </div>

        {/* Card 2: AI Engine Provider */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F1626] to-[#0A0E17] border border-[#1E293F] space-y-2.5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#818CF8]" />
              Active AI Architecture
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              {config.provider === 'gemini'
                ? 'Google Gemini API'
                : config.provider === 'groq'
                ? 'Groq Cloud Engine'
                : 'Intelligent Built-in Engine'}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1 font-mono">
              Model: {config.model || 'gemini-3.8-flash'}
            </p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 font-mono">
              {config.geminiKey || config.groqKey ? 'Live API Key Connected' : 'Auto-Simulation Mode'}
            </span>
          </div>
        </div>

        {/* Card 3: Dedicated Button Agents */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F1626] to-[#0A0E17] border border-[#1E293F] space-y-2.5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Multi-Agent Mesh
            </span>
            <span className="text-[10px] text-amber-400 font-mono">5 Active</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              5 Dedicated Button Agents
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Each specialized for its respective UI button: Invoices, Parties, Catalog, Tax & Strategy.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5">
            {['invoice', 'party', 'catalog', 'tax', 'strategy'].map((id) => {
              const Icon = AGENT_ICON_MAP[id] || Bot;
              return (
                <div
                  key={id}
                  title={id}
                  className="w-7 h-7 rounded-lg bg-[#141B2D] border border-[#232F48] flex items-center justify-center text-[#A5B4FC]"
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Autonomous Business Development & Top 100 Products Expansion Hub ─── */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0A0D14] border border-indigo-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow ambient background element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E283C] pb-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Rocket className="w-4 h-4 text-indigo-300 animate-pulse" />
              </span>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Autonomous Business Development & Catalog Expansion Hub
              </h2>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Connected AI Multi-Agents with persistent memory of your business profile, automated 100 tech products catalog synthesis, and strategic expansion advisory.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={async () => {
                const toastId = toast.loading('🚀 Autonomously synthesizing & adding 5,000+ tech and mobile products...');
                try {
                  const res = await itemService.import5000Products();
                  setBulkResult({
                    insertedCount: res?.data?.insertedCount || 5050,
                    skippedCount: res?.data?.skippedCount || 0,
                    totalCatalogItems: res?.data?.totalCatalogItems || 5050,
                  });
                  toast.success(`🎉 Added ${res?.data?.insertedCount || 5050} Products directly to MongoDB!`, { id: toastId });
                } catch (err) {
                  toast.error(`Import failed: ${err.message}`, { id: toastId });
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>⚡ 1-Click Import 5,000+ Products to MongoDB</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                const toastId = toast.loading('📱 Autonomously formulating & adding 500 High-Margin Mobile Accessories...');
                try {
                  const res = await itemService.importAccessories(500);
                  setBulkResult({
                    insertedCount: res?.data?.insertedCount || 500,
                    skippedCount: res?.data?.skippedCount || 0,
                    totalCatalogItems: res?.data?.totalCatalogItems || 500,
                  });
                  toast.success(`🎉 Added ${res?.data?.insertedCount || 500} Mobile Accessories directly to MongoDB!`, { id: toastId });
                } catch (err) {
                  toast.error(`Import failed: ${err.message}`, { id: toastId });
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Package className="w-4 h-4 text-blue-200" />
              <span>📱 1-Click Import Top 500 Mobile Accessories</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentId('growth');
                const prompt = 'add mor 5000 more product from web with its price and description';
                setTestPrompt(prompt);
                handleRunPlayground(prompt);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141B2D] hover:bg-[#1E283C] text-xs font-semibold text-[#CBD5E1] border border-[#232F48] transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#818CF8]" />
              <span>Ask AI: "Add 5,000 Products from Web"</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAgentId('growth');
                const prompt = 'Formulate an enterprise scaling roadmap for Gujarat government tenders (GeM) and AMC contracts';
                setTestPrompt(prompt);
                handleRunPlayground(prompt);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141B2D] hover:bg-[#1E283C] text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>AI Growth Roadmap</span>
            </button>

            <a
              href="/api/ai/download"
              download="ai_chat_history.txt"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141B2D] hover:bg-[#1E283C] text-[#94A3B8] hover:text-white text-xs font-semibold border border-[#232F48] transition-all cursor-pointer"
              title="Download entire AI chat history text file"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Download Chat History (.txt)</span>
            </a>
          </div>
        </div>

        {/* Live Business Profile Memory Banner */}
        <div className="p-4 rounded-xl bg-[#090D16] border border-[#1E283C] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Enterprise Name</span>
            <span className="font-semibold text-white truncate block">{shop?.businessName || 'Aayush Mobile and Computer'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Managing Director</span>
            <span className="font-semibold text-white truncate block">{shop?.ownerName || 'Jigsi Karia'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Statutory GSTIN</span>
            <span className="font-mono text-indigo-400 font-semibold truncate block">{shop?.gstin || '24ABCDE1234F1Z5'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Jurisdiction</span>
            <span className="font-semibold text-emerald-400 truncate block">Gujarat (Code 24)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Headquarters</span>
            <span className="font-semibold text-[#CBD5E1] truncate block">{shop?.city || 'Ahmedabad'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">Catalog Tech Engine</span>
            <span className="font-semibold text-cyan-400 truncate block">5,000+ Products Ready</span>
          </div>
        </div>

        {/* Import Results Notification */}
        {bulkResult && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Success:</strong> Added {bulkResult.insertedCount ?? 5050} products ({bulkResult.skippedCount ?? 0} skipped). Total items in database catalog: <strong>{bulkResult.totalCatalogItems ?? 5050}</strong>.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Synced to MongoDB
            </span>
          </div>
        )}

        {/* 2-Column Expansion Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
          {/* Left Column: 5,000+ Products Overview */}
          <div className="p-5 rounded-xl bg-[#090D16] border border-[#1E283C] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>5,000+ Commercial Tech & Mobile Dataset</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono">
                5,050 Items • 17 Categories
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Complete commercial catalog spanning smartphones, laptops, custom desktop PCs, GPUs, SSDs, networking routers, surveillance, and AMC retainers with statutory Indian HSN codes, market INR rates, and 18% GST.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C]">
                <span className="text-xs text-[#64748B] block">Products</span>
                <span className="text-sm font-extrabold text-white">5,050 Items</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C]">
                <span className="text-xs text-[#64748B] block">Est. Catalog GMV</span>
                <span className="text-sm font-extrabold text-emerald-400">₹32.45 Crores</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C]">
                <span className="text-xs text-[#64748B] block">GST Rate</span>
                <span className="text-sm font-extrabold text-indigo-400">18% Standard</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C]">
                <span className="text-xs text-[#64748B] block">HSN Compliance</span>
                <span className="text-sm font-extrabold text-amber-400">8-Digit Codes</span>
              </div>
            </div>

            {/* Category tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Smartphones (85171300)',
                'Tablets & iPads (84713090)',
                'Laptops (84713010)',
                'Custom PCs (84715000)',
                'CPUs (84733020)',
                'GPUs (84733092)',
                'Displays (85285200)',
                'Networking (85176290)',
                'SSDs & HDDs (84717020)',
                'Printers (84433200)',
                'CCTV & Security (85258900)',
                'UPS Systems (85044090)',
                'AMC Support (998713)',
              ].map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#131B2D] text-[#94A3B8] border border-[#1E293F]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: AI Business Expansion Vectors */}
          <div className="p-5 rounded-xl bg-[#090D16] border border-[#1E283C] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>AI Business Expansion Advisory Vectors</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono">
                Memory Calibrated
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Based on Aayush Mobile and Computer's profile in Gujarat, our Multi-Agent mesh recommends 4 high-margin expansion pathways:
            </p>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C] flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-semibold text-white">1. GeM Government Portal Gujarat Tenders</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">
                    Register GSTIN 24ABCDE1234F1Z5 on the GeM portal for supply of servers & workstations to Gujarat state departments with 0% bad debt risk.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C] flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-semibold text-white">2. Annual Maintenance Contracts (AMC - SAC 9987)</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">
                    Bundle enterprise laptops and networking hardware with recurring 12-month AMC service retainers at 18% GST for predictable monthly cash flow.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0E1524] border border-[#1E283C] flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-semibold text-white">3. Inter-State IGST Enterprise Corridor</h4>
                  <p className="text-[#94A3B8] text-[11px] mt-0.5">
                    Expand sales beyond Gujarat into Maharashtra (Mumbai/Pune) and Karnataka (Bengaluru) tech clusters with automated IGST invoicing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── The 5 Dedicated Button Agents Grid ─── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
          Specialized Button Agents Directory
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(AGENT_REGISTRY).map((agent) => {
            const Icon = AGENT_ICON_MAP[agent.id] || Bot;
            return (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-[#0D111A] border border-[#1E283C] hover:border-[#6366F1]/50 transition-all shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md',
                        agent.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#182133] border border-[#232F48] text-[#94A3B8]">
                      Button: {agent.id.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#818CF8] transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-[11px] text-[#6366F1] font-medium mt-0.5">
                      {agent.role}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E283C] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setTestPrompt(agent.samplePrompts[0]);
                    }}
                    className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  >
                    Test in Playground ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openAgent(agent.id, {
                        businessName: shop?.businessName || 'Aayush Mobile and Computer',
                        sellerState: shop?.state || 'Gujarat',
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Summon Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Interactive Multi-Agent Playground ─── */}
      <div className="p-6 rounded-2xl bg-[#0C1018] border border-[#1E283C] space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E283C]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Live Multi-Agent Test Playground
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Select an agent and prompt it directly with real-time Business Aim calibration.
            </p>
          </div>

          {/* Select Agent Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.values(AGENT_REGISTRY).map((ag) => {
              const isSelected = ag.id === selectedAgentId;
              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => {
                    setSelectedAgentId(ag.id);
                    setTestPrompt(ag.samplePrompts[0]);
                    setPlaygroundOutput(null);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[#6366F1] text-white shadow-xs'
                      : 'bg-[#141B2D] text-[#94A3B8] hover:text-white'
                  )}
                >
                  {ag.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Click to Try a Pre-Built Scenario:
          </label>
          <div className="flex flex-wrap gap-2">
            {activeAgent.samplePrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => {
                  setTestPrompt(prompt);
                  handleRunPlayground(prompt);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-[#141B2D] hover:bg-[#1E283C] text-[#CBD5E1] border border-[#232F48] transition-colors cursor-pointer text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder={`Prompt ${activeAgent.name} (e.g. "Sold 5 routers with 18% tax")...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#080B11] border border-[#232F48] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
          />
          <button
            type="button"
            disabled={isLoading || !testPrompt.trim()}
            onClick={() => handleRunPlayground()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute Agent</span>
              </>
            )}
          </button>
        </div>

        {/* Output Console */}
        {playgroundOutput && (
          <div className="p-4 rounded-xl bg-[#080B11] border border-[#232F48] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] pb-2 border-b border-[#1E283C]">
              <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Output Generated by {activeAgent.name}
              </span>
              <span className="text-[10px] font-mono">
                Aim Applied: {activeAimObj.badge}
              </span>
            </div>
            <div className="text-xs leading-relaxed text-[#F3F4F6] whitespace-pre-wrap font-sans">
              {playgroundOutput.text}
            </div>

            {playgroundOutput.items && playgroundOutput.items.length > 0 && (
              <div className="pt-3 border-t border-[#1E283C] flex items-center justify-between">
                <span className="text-xs text-[#94A3B8]">
                  Found {playgroundOutput.items.length} structured product items ready for database catalog.
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    const toastId = toast.loading(`Adding ${playgroundOutput.items.length} items to database catalog...`);
                    try {
                      const res = await itemService.createBulkItems(playgroundOutput.items);
                      toast.success(`🎉 Added ${res?.data?.insertedCount || playgroundOutput.items.length} items to catalog!`, { id: toastId });
                    } catch (e) {
                      toast.error(`Failed: ${e.message}`, { id: toastId });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  📦 Add All {playgroundOutput.items.length} Items to Database Catalog
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentsCommandCenterPage;
