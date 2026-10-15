import React, { createContext, useContext, useState, useEffect } from 'react';
import aiAgentService, { BUSINESS_AIMS, AGENT_REGISTRY } from '../services/aiAgent.service';
import { toast } from 'sonner';

const AIAgentContext = createContext(null);

export const AIAgentProvider = ({ children }) => {
  const [config, setConfig] = useState(() => aiAgentService.getConfig());
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [agentContextData, setAgentContextData] = useState({});
  const [onApplyAction, setOnApplyAction] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize on mount and state change
  const updateConfig = (newConfig) => {
    const saved = aiAgentService.saveConfig(newConfig);
    setConfig(saved);
  };

  /**
   * Open dedicated Agent modal for any button
   * @param {string} agentId - 'invoice' | 'party' | 'catalog' | 'tax' | 'strategy'
   * @param {object} contextData - current shop, items, or party state
   * @param {function} onApply - callback if agent generates data that can be applied to current form
   */
  const openAgent = (agentId, contextData = {}, onApply = null) => {
    setActiveAgentId(agentId);
    setAgentContextData(contextData);
    setOnApplyAction(() => onApply);
  };

  const closeAgent = () => {
    setActiveAgentId(null);
    setAgentContextData({});
    setOnApplyAction(null);
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const activeAimObj = BUSINESS_AIMS[config.activeAim] || BUSINESS_AIMS.MAX_MARGIN;

  return (
    <AIAgentContext.Provider
      value={{
        config,
        updateConfig,
        activeAimObj,
        BUSINESS_AIMS,
        AGENT_REGISTRY,
        activeAgentId,
        agentContextData,
        onApplyAction,
        openAgent,
        closeAgent,
        isSettingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </AIAgentContext.Provider>
  );
};

export const useAIAgent = () => {
  const context = useContext(AIAgentContext);
  if (!context) {
    throw new Error('useAIAgent must be used within an AIAgentProvider');
  }
  return context;
};

export default AIAgentContext;
