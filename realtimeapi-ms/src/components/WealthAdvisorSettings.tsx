"use client";

import React, { useState } from 'react';
import { FaSave, FaUndo, FaTimes } from 'react-icons/fa';
import { WealthAdvisorPromptSettings, saveWealthAdvisorSettings, resetWealthAdvisorSettings, DEFAULT_WEALTH_ADVISOR_PROMPTS } from '../utils/wealthAdvisorSettings';

interface WealthAdvisorSettingsProps {
  settings: WealthAdvisorPromptSettings;
  onSettingsChange: (settings: WealthAdvisorPromptSettings) => void;
  onClose: () => void;
}

export default function WealthAdvisorSettings({ settings, onSettingsChange, onClose }: WealthAdvisorSettingsProps) {
  const [editingSettings, setEditingSettings] = useState<WealthAdvisorPromptSettings>(settings);
  const [activeTab, setActiveTab] = useState<keyof WealthAdvisorPromptSettings>('portfolio');

  const tabs = [
    { key: 'portfolio' as const, label: 'Portfolio Analysis', icon: '📊' },
    { key: 'risk' as const, label: 'Risk Assessment', icon: '🛡️' },
    { key: 'tax' as const, label: 'Tax Optimization', icon: '🏛️' },
    { key: 'estate' as const, label: 'Estate Planning', icon: '💎' },
    { key: 'alternatives' as const, label: 'Alternative Investments', icon: '⚖️' },
    { key: 'crosssell' as const, label: 'Private Banking', icon: '🤝' },
  ];

  const handleSave = () => {
    saveWealthAdvisorSettings(editingSettings);
    onSettingsChange(editingSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = resetWealthAdvisorSettings();
    setEditingSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const handlePromptChange = (category: keyof WealthAdvisorPromptSettings, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800">Wealth Advisor Prompt Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                    activeTab === tab.key
                      ? 'bg-slate-200 text-slate-800 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <span className="text-xl">{tabs.find(t => t.key === activeTab)?.icon}</span>
                {tabs.find(t => t.key === activeTab)?.label} Prompt
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Customize the analysis prompt for this category. Use placeholders: {'{clientName}'}, {'{clientProfile}'}, {'{allocation}'}
              </p>
            </div>

            <textarea
              value={editingSettings[activeTab]}
              onChange={(e) => handlePromptChange(activeTab, e.target.value)}
              className="w-full h-96 p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              placeholder="Enter your custom prompt here..."
            />

            {/* Prompt Info */}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-700 mb-2">Available Placeholders:</h4>
              <div className="text-sm text-slate-600 space-y-1">
                <div><code className="bg-slate-200 px-2 py-1 rounded">{'{clientName}'}</code> - Client's name</div>
                <div><code className="bg-slate-200 px-2 py-1 rounded">{'{clientProfile}'}</code> - Complete client profile and background</div>
                <div><code className="bg-slate-200 px-2 py-1 rounded">{'{allocation}'}</code> - Current portfolio allocation details (portfolio analysis only)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FaUndo className="text-sm" />
            Reset to Defaults
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <FaSave className="text-sm" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
