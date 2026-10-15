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
} from 'lucide-react';
import { useAIAgent } from '../../context/AIAgentContext';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/ui/PageHeader';
import ROUTES from '../../constants/routes';
import aiAgentService from '../../services/aiAgent.service';
import { cn } from '../../utils/cn';

const AGENT_ICON_MAP = {
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
  const [selectedAgentId, setSelectedAgentId] = useState('invoice');
  const [testPrompt, setTestPrompt] = useState('');
  const [playgroundOutput, setPlaygroundOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeAgent = AGENT_REGISTRY[selectedAgentId] || AGENT_REGISTRY.invoice;

  const handleRunPlayground = async (promptOverride) => {
    const prompt = (promptOverride || testPrompt || activeAgent.samplePrompts[0]).trim();
    if (!prompt) return;

    setIsLoading(true);
    try {
      const res = await aiAgentService.executeAgent({
        agentId: selectedAgentId,
        prompt,
        contextData: {
          businessName: shop?.businessName || 'Apex Tech Solutions',
          sellerState: shop?.state || 'Arunachal Pradesh',
          customerState: 'Gujarat',
        },
      });
      setPlaygroundOutput(res);
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
              Model: {config.model || 'gemini-1.5-flash'}
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
                        businessName: shop?.businessName || 'Apex Tech Solutions',
                        sellerState: shop?.state || 'Arunachal Pradesh',
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgentsCommandCenterPage;
