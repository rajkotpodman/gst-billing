import React, { useState } from 'react';
import {
  X,
  Target,
  Key,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAIAgent } from '../../context/AIAgentContext';
import aiAgentService, { BUSINESS_AIMS } from '../../services/aiAgent.service';
import { cn } from '../../utils/cn';

export const AISettingsModal = () => {
  const { isSettingsOpen, closeSettings, config, updateConfig } = useAIAgent();

  const [provider, setProvider] = useState(config.provider || 'gemini');
  const [geminiKey, setGeminiKey] = useState(config.geminiKey || '');
  const [groqKey, setGroqKey] = useState(config.groqKey || '');
  const [model, setModel] = useState(config.model || 'gemini-1.5-flash');
  const [activeAim, setActiveAim] = useState(config.activeAim || 'MAX_MARGIN');
  const [customAim, setCustomAim] = useState(config.customAim || '');

  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isSettingsOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const keyToTest = provider === 'gemini' ? geminiKey : groqKey;
      const res = await aiAgentService.testConnection(provider, keyToTest, model);
      setTestResult({ success: true, message: res });
      toast.success(res);
    } catch (err) {
      setTestResult({ success: false, message: err.message });
      toast.error(err.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateConfig({
      provider,
      geminiKey,
      groqKey,
      model,
      activeAim,
      customAim,
    });
    toast.success('AI Multi-Agent & Business Aim settings saved successfully!');
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0B0E14] border border-[#1F2736] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1F2736] bg-[#0E131E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Multi-Agent AI & Business Aim Center
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Configure Gemini / Groq API and customize your store's strategic business aim.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Business Aim Strategy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#38BDF8]" />
              <label className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                1. Select Active Business Aim (Injected into every Agent)
              </label>
            </div>
            <p className="text-xs text-[#94A3B8]">
              All button agents (Invoice, Party, Catalog, Tax, Strategy) will calibrate their advice, discounts, and risk audits toward this selected aim.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {Object.values(BUSINESS_AIMS).map((aim) => {
                const isSelected = activeAim === aim.id;
                return (
                  <div
                    key={aim.id}
                    onClick={() => setActiveAim(aim.id)}
                    className={cn(
                      'p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between',
                      isSelected
                        ? 'bg-[#141B2D] border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                        : 'bg-[#0E131E] border-[#1F2736] hover:border-[#2D3748] opacity-80 hover:opacity-100'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{aim.title}</span>
                      <span
                        className={cn(
                          'text-[9px] font-mono px-2 py-0.5 rounded-full uppercase',
                          isSelected
                            ? 'bg-[#6366F1] text-white'
                            : 'bg-[#1B2232] text-[#94A3B8]'
                        )}
                      >
                        {aim.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-tight">
                      {aim.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Aim Input */}
            {activeAim === 'CUSTOM' && (
              <div className="mt-3 p-3 rounded-xl bg-[#0E131E] border border-[#6366F1]/50 space-y-2">
                <label className="text-xs font-semibold text-white">
                  Describe Your Specific Business Goal & Instructions:
                </label>
                <textarea
                  rows={3}
                  value={customAim}
                  onChange={(e) => setCustomAim(e.target.value)}
                  placeholder="e.g. We are a wholesale electronics distributor targeting 15% net profit margin, zero delayed payments beyond 10 days, and strict adherence to Gujarat GST invoicing rules."
                  className="w-full p-2.5 rounded-lg bg-[#080B11] border border-[#1F2736] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            )}
          </div>

          {/* Section 2: AI Provider & Engine */}
          <div className="space-y-3 pt-4 border-t border-[#1F2736]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#818CF8]" />
              <label className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1]">
                2. AI Provider & Models (Gemini / Groq / Smart Engine)
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'gemini', title: 'Google Gemini', desc: 'Gemini 1.5 / 2.0 Flash' },
                { id: 'groq', title: 'Groq Cloud', desc: 'Ultra-fast Llama 3.3 70B' },
                { id: 'simulated', title: 'Smart Engine', desc: 'Zero API key needed' },
              ].map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProvider(p.id);
                      if (p.id === 'gemini') setModel('gemini-1.5-flash');
                      if (p.id === 'groq') setModel('llama-3.3-70b-versatile');
                      setTestResult(null);
                    }}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all cursor-pointer',
                      isSelected
                        ? 'bg-[#141B2D] border-[#6366F1] shadow-xs'
                        : 'bg-[#0E131E] border-[#1F2736] hover:border-[#2D3748]'
                    )}
                  >
                    <div className="text-xs font-bold text-white">{p.title}</div>
                    <div className="text-[10px] text-[#94A3B8]">{p.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Model Selector & Key Input */}
            {provider === 'gemini' && (
              <div className="space-y-3 p-4 rounded-xl bg-[#0E131E] border border-[#1F2736]">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-1">
                    Gemini Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#1F2736] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended, Fast & Free tier)</option>
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Latest Generation)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Deep reasoning)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#CBD5E1]">
                      Google Gemini API Key
                    </label>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#6366F1] hover:underline"
                    >
                      Get Gemini API Key ↗
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full pr-10 pl-3 py-2 rounded-lg bg-[#080B11] border border-[#1F2736] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-white"
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Stored locally in your browser. Leave blank to automatically use our built-in engine.
                  </p>
                </div>
              </div>
            )}

            {provider === 'groq' && (
              <div className="space-y-3 p-4 rounded-xl bg-[#0E131E] border border-[#1F2736]">
                <div>
                  <label className="text-xs font-semibold text-[#CBD5E1] block mb-1">
                    Groq Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#1F2736] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                  >
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (State of the art)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Sub-100ms ultra low latency)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (MoE Architecture)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#CBD5E1]">
                      Groq API Key
                    </label>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#6366F1] hover:underline"
                    >
                      Get Groq API Key ↗
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showGroqKey ? 'text' : 'password'}
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      placeholder="gsk_..."
                      className="w-full pr-10 pl-3 py-2 rounded-lg bg-[#080B11] border border-[#1F2736] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="absolute right-2.5 top-2.5 text-[#64748B] hover:text-white"
                    >
                      {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Direct low-latency inference on Groq LPUs.
                  </p>
                </div>
              </div>
            )}

            {provider === 'simulated' && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Built-in Intelligent Engine Ready</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    No API key or external network account required. The multi-agent engine uses our local GST rule database and domain heuristics to generate accurate invoices, HSN classifications, and compliance audits instantly.
                  </p>
                </div>
              </div>
            )}

            {/* Test Connection Button */}
            {provider !== 'simulated' && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTesting || (provider === 'gemini' && !geminiKey) || (provider === 'groq' && !groqKey)}
                  className="px-3 py-1.5 rounded-lg bg-[#151D2C] hover:bg-[#1E283C] disabled:opacity-40 border border-[#1F2736] text-xs text-white font-medium transition-colors cursor-pointer"
                >
                  {isTesting ? 'Testing API...' : 'Test Connection'}
                </button>

                {testResult && (
                  <span
                    className={cn(
                      'text-xs flex items-center gap-1.5',
                      testResult.success ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{testResult.message}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1F2736] bg-[#0E131E] flex items-center justify-between">
          <div className="text-[11px] text-[#64748B]">
            Aim active across all 5 Button Agents
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeSettings}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#161D2A] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettingsModal;
