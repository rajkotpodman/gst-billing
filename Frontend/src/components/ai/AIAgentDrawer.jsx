import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Settings,
  Bot,
  Copy,
  Check,
  CheckCircle2,
  Receipt,
  Users,
  Package,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAIAgent } from '../../context/AIAgentContext';
import aiAgentService from '../../services/aiAgent.service';
import itemService from '../../services/item.service';
import { cn } from '../../utils/cn';

const AGENT_ICONS = {
  invoice: Receipt,
  party: Users,
  catalog: Package,
  tax: ShieldCheck,
  strategy: TrendingUp,
};

export const AIAgentDrawer = () => {
  const {
    activeAgentId,
    agentContextData,
    onApplyAction,
    closeAgent,
    openAgent,
    config,
    activeAimObj,
    openSettings,
    AGENT_REGISTRY,
  } = useAIAgent();

  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const currentAgent = AGENT_REGISTRY[activeAgentId] || AGENT_REGISTRY.invoice;
  const AgentIcon = AGENT_ICONS[activeAgentId] || Bot;

  // Initialize greeting whenever agent changes
  useEffect(() => {
    if (activeAgentId) {
      setMessages([
        {
          role: 'agent',
          agentId: activeAgentId,
          content: `👋 **Greetings! I am the ${currentAgent.name}**.
I am actively calibrated to your **Business Aim**: *"${activeAimObj.title}"*.

How can I assist your business action today? Pick a quick suggestion below or enter any request:`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [activeAgentId, config.activeAim]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!activeAgentId) return null;

  const handleSend = async (textToSend) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isTyping) return;

    const userMsg = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await aiAgentService.executeAgent({
        agentId: activeAgentId,
        prompt,
        contextData: agentContextData,
      });

      const agentMsg = {
        role: 'agent',
        agentId: activeAgentId,
        content: response.text,
        payload: response,
        items: response.items,
        party: response.party,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          agentId: activeAgentId,
          content: `❌ **Error**: ${err.message || 'Unable to process request'}. Please check your API key or connection in settings.`,
          timestamp: new Date(),
        },
      ]);
      toast.error('Agent query error. Try checking your API key in AI Settings.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApplyItems = (items) => {
    if (!items || !items.length) return;
    if (onApplyAction) {
      onApplyAction(items);
      toast.success(`✨ Successfully applied ${items.length} items directly to the invoice!`);
      closeAgent();
    } else {
      toast.info('Item list copied. Navigate to Create Bill to insert.');
      navigator.clipboard.writeText(JSON.stringify(items, null, 2));
    }
  };

  const handleApplyParty = (party) => {
    if (!party) return;
    if (onApplyAction) {
      onApplyAction(party);
      toast.success(`✨ Customer details populated!`);
      closeAgent();
    } else {
      toast.info('Party data copied to clipboard.');
      navigator.clipboard.writeText(JSON.stringify(party, null, 2));
    }
  };

  const handleImport100Products = async (itemsToImport) => {
    if (!itemsToImport || !itemsToImport.length) return;
    setIsImporting(true);
    try {
      const res = await itemService.createBulkItems(itemsToImport);
      const insertedCount = res?.data?.insertedCount || itemsToImport.length;
      toast.success(`🎉 Successfully added ${insertedCount} Top Tech Products to your catalog!`);
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (err) {
      toast.error(`Import failed: ${err.message || 'Error adding items'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Background backdrop click to close */}
      <div className="flex-1 cursor-pointer" onClick={closeAgent} />

      {/* Drawer Panel */}
      <div className="w-full max-w-[560px] h-full bg-[#080B11] border-l border-[#1F2736] flex flex-col shadow-2xl text-[#F3F4F6] relative z-10 animate-in slide-in-from-right duration-200">
        {/* ─── Top Drawer Header ─── */}
        <div className="p-4 border-b border-[#1F2736] bg-[#0C1018]/90 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-md',
                  currentAgent.color
                )}
              >
                <AgentIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{currentAgent.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#818CF8] font-mono border border-[#6366F1]/30">
                    Dedicated Agent
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{currentAgent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openSettings}
                title="AI & Business Aim Settings"
                className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2A] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeAgent}
                title="Close Agent"
                className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#161D2A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Agent Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.values(AGENT_REGISTRY).map((ag) => {
              const Icon = AGENT_ICONS[ag.id] || Bot;
              const isSelected = ag.id === activeAgentId;
              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => openAgent(ag.id, agentContextData, onApplyAction)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 shrink-0 transition-all cursor-pointer',
                    isSelected
                      ? 'bg-[#6366F1] text-white shadow-xs'
                      : 'bg-[#121722] text-[#94A3B8] hover:text-white hover:bg-[#182030] border border-[#1F2736]'
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{ag.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Business Aim & Model Active Status Banner */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0F1420] border border-[#1F2736] text-[11px]">
            <button
              type="button"
              onClick={openSettings}
              className="flex items-center gap-1.5 text-[#38BDF8] hover:underline cursor-pointer truncate max-w-[260px]"
            >
              <Target className="w-3.5 h-3.5 shrink-0 text-[#38BDF8]" />
              <span className="font-semibold truncate">Aim: {activeAimObj.title}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] shrink-0 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {config.provider === 'gemini'
                  ? config.geminiKey
                    ? `Gemini ${config.model}`
                    : 'Gemini (Auto-Engine)'
                  : config.provider === 'groq'
                  ? config.groqKey
                    ? 'Groq Cloud'
                    : 'Groq (Auto-Engine)'
                  : 'Intelligent Engine'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Chat Messages Viewport ─── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isAgent = msg.role === 'agent';
            return (
              <div
                key={idx}
                className={cn('flex flex-col', isAgent ? 'items-start' : 'items-end')}
              >
                <div
                  className={cn(
                    'max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed space-y-3',
                    isAgent
                      ? 'bg-[#111724] border border-[#20293A] text-[#F3F4F6] shadow-sm'
                      : 'bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-md'
                  )}
                >
                  {/* Message body with basic markdown style */}
                  <div className="whitespace-pre-wrap space-y-2 break-words">
                    {msg.content}
                  </div>

                  {/* 🚀 If 100 Tech Products were generated, offer direct 1-Click Catalog Import */}
                  {isAgent && (msg.payload?.action === 'IMPORT_TOP_100' || msg.items?.length === 100) ? (
                    <div className="pt-3 border-t border-[#1F2736] space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-blue-950/80 border border-purple-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-white">
                              Autonomous 100 Tech Products Ready
                            </span>
                          </div>
                          <p className="text-[11px] text-purple-200">
                            100 Verified items with HSN codes, Indian market pricing & 18% GST
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isImporting}
                          onClick={() => handleImport100Products(msg.items)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {isImporting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Adding 100 Items...</span>
                            </>
                          ) : (
                            <>
                              <Package className="w-3.5 h-3.5 text-yellow-300" />
                              <span>🚀 Add All 100 to Catalog</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : isAgent && msg.items && msg.items.length > 0 && (
                    <div className="pt-2 border-t border-[#1F2736] flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyItems(msg.items)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✨ Apply {msg.items.length} Items directly to Form</span>
                      </button>
                    </div>
                  )}

                  {/* If party details were generated */}
                  {isAgent && msg.party && (
                    <div className="pt-2 border-t border-[#1F2736] flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyParty(msg.party)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✨ Fill Customer Form ({msg.party.name})</span>
                      </button>
                    </div>
                  )}

                  {/* Message footer with copy button */}
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isAgent && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.content, idx)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#111724] border border-[#20293A] w-fit text-xs text-[#94A3B8]">
              <Sparkles className="w-3.5 h-3.5 text-[#6366F1] animate-spin" />
              <span>{currentAgent.name} is calculating GST & business aim...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── Suggestion Prompts Bar ─── */}
        <div className="px-4 py-2 bg-[#0A0D14] border-t border-[#1F2736]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
            Suggested Actions for this Button:
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {currentAgent.samplePrompts.map((sample, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleSend(sample)}
                className="px-2.5 py-1 rounded-full bg-[#131924] hover:bg-[#1E2535] border border-[#20293A] hover:border-[#6366F1]/40 text-[11px] text-[#CBD5E1] whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Bottom Chat Input ─── */}
        <div className="p-3 bg-[#0C1018] border-t border-[#1F2736]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${currentAgent.name.split(' ')[0]} (e.g. "Draft invoice for 3 laptops at 45000")...`}
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#121723] border border-[#20293A] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:hover:bg-[#6366F1] text-white shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-2 px-1">
            <span>Powered by Gemini & Groq Multi-Agent Architecture</span>
            <button
              type="button"
              onClick={openSettings}
              className="text-[#6366F1] hover:underline"
            >
              Configure API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentDrawer;
