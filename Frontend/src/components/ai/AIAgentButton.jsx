import React from 'react';
import { Sparkles } from 'lucide-react';
import { useAIAgent } from '../../context/AIAgentContext';
import { cn } from '../../utils/cn';

/**
 * High-tech button to trigger an AI Agent for any specific button/action
 */
export const AIAgentButton = ({
  agentId = 'invoice',
  contextData = {},
  onApply = null,
  label = 'AI Assist',
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'glow', // 'glow' | 'outline' | 'pill'
}) => {
  const { openAgent, AGENT_REGISTRY } = useAIAgent();
  const agent = AGENT_REGISTRY[agentId] || AGENT_REGISTRY.invoice;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAgent(agentId, contextData, onApply);
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3.5 py-1.5 gap-2',
    lg: 'text-sm px-4 py-2 gap-2.5',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Open ${agent.name}`}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer group active:scale-95 select-none shrink-0',
        sizeClasses[size] || sizeClasses.md,
        variant === 'glow' &&
          'bg-gradient-to-r from-[#4F46E5]/90 via-[#6366F1] to-[#818CF8] hover:from-[#4338CA] hover:to-[#6366F1] text-white shadow-[0_2px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.5)] border border-white/20',
        variant === 'outline' &&
          'bg-[#0D1017]/80 hover:bg-[#151922] text-[#818CF8] hover:text-white border border-[#6366F1]/40 hover:border-[#6366F1] shadow-xs',
        variant === 'pill' &&
          'bg-[#1E1B4B]/70 hover:bg-[#1E1B4B] text-[#A5B4FC] hover:text-white border border-[#6366F1]/30 rounded-full',
        className
      )}
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
      <span>{label}</span>
      <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 bg-white/20 rounded font-mono uppercase tracking-wider ml-0.5">
        Agent
      </span>
    </button>
  );
};

export default AIAgentButton;
