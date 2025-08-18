"use client";

import React, { useState, useEffect } from 'react';
import { FaChartLine, FaShieldAlt, FaUniversity, FaGem, FaBalanceScale, FaHandshake, FaCog } from 'react-icons/fa';
import { CUSTOMER_PROFILES, CONVERSATION_STARTERS, getScenarioPrompt, type CustomerProfile } from '../utils/wealthAdvisorScenarios';
import { getWealthAdvisorPrompt, loadWealthAdvisorSettings, WealthAdvisorPromptSettings } from '../utils/wealthAdvisorSettings';
import WealthAdvisorSettings from './WealthAdvisorSettings';

interface WealthAdvisorInterfaceProps {
  onScenarioSelect: (prompt: string) => void;
  onImmediateAnalysis?: (prompt: string, analysisType: string, clientName: string) => void;
}

export default function WealthAdvisorInterface({ onScenarioSelect, onImmediateAnalysis }: WealthAdvisorInterfaceProps) {
  const [selectedProfile, setSelectedProfile] = useState<CustomerProfile | null>(null);
  const [showScenarios, setShowScenarios] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [promptSettings, setPromptSettings] = useState<WealthAdvisorPromptSettings | null>(null);

  useEffect(() => {
    setPromptSettings(loadWealthAdvisorSettings());
  }, []);

  const scenarioCategories = [
    {
      id: 'portfolio',
      title: 'Portfolio Analysis',
      icon: <FaChartLine />,
      description: 'Asset allocation and rebalancing strategies'
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      icon: <FaShieldAlt />,
      description: 'Risk mitigation and hedging strategies'
    },
    {
      id: 'tax',
      title: 'Tax Strategy',
      icon: <FaBalanceScale />,
      description: 'Tax-efficient wealth management'
    },
    {
      id: 'estate',
      title: 'Estate Planning',
      icon: <FaUniversity />,
      description: 'Wealth transfer and succession'
    },
    {
      id: 'alternatives',
      title: 'Alternative Assets',
      icon: <FaGem />,
      description: 'Private markets and exclusives'
    },
    {
      id: 'crosssell',
      title: 'Private Banking',
      icon: <FaHandshake />,
      description: 'Comprehensive banking solutions'
    }
  ];

  const handleProfileSelect = (profile: CustomerProfile) => {
    setSelectedProfile(profile);
    setShowScenarios(true);
  };

    const handleScenarioSelect = (category: string) => {
    if (!selectedProfile || !promptSettings) return;

    let analysisPrompt = '';
    let analysisType = '';
    const clientProfile = getScenarioPrompt(selectedProfile);
    const allocationDetails = `${selectedProfile.currentPortfolio.stocks}% stocks, ${selectedProfile.currentPortfolio.bonds}% bonds, ${selectedProfile.currentPortfolio.realEstate}% real estate`;

    switch (category) {
      case 'portfolio':
        analysisType = 'Portfolio Analysis';
        analysisPrompt = getWealthAdvisorPrompt('portfolio', selectedProfile.name, clientProfile, allocationDetails);
        break;
      case 'risk':
        analysisType = 'Risk Assessment';
        analysisPrompt = getWealthAdvisorPrompt('risk', selectedProfile.name, clientProfile);
        break;
      case 'tax':
        analysisType = 'Tax Optimization';
        analysisPrompt = getWealthAdvisorPrompt('tax', selectedProfile.name, clientProfile);
        break;
      case 'estate':
        analysisType = 'Estate Planning';
        analysisPrompt = getWealthAdvisorPrompt('estate', selectedProfile.name, clientProfile);
        break;
      case 'alternatives':
        analysisType = 'Alternative Investments';
        analysisPrompt = getWealthAdvisorPrompt('alternatives', selectedProfile.name, clientProfile);
        break;
      case 'crosssell':
        analysisType = 'Private Banking Services';
        analysisPrompt = getWealthAdvisorPrompt('crosssell', selectedProfile.name, clientProfile);
        break;
      default:
        analysisPrompt = clientProfile;
        analysisType = 'General Analysis';
    }

    // Trigger immediate LLM analysis if handler is provided
    if (onImmediateAnalysis) {
      onImmediateAnalysis(analysisPrompt, analysisType, selectedProfile.name);
    } else {
      // Fallback to old behavior
      onScenarioSelect(analysisPrompt);
    }
  };

  const handleQuickStart = (starter: string) => {
    const randomProfile = CUSTOMER_PROFILES[Math.floor(Math.random() * CUSTOMER_PROFILES.length)];
    const profilePrompt = getScenarioPrompt(randomProfile);
    const fullPrompt = `${profilePrompt}\n\nCLIENT REQUEST: "${starter}"\n\nRespond to this request with comprehensive wealth management advice.`;
    onScenarioSelect(fullPrompt);
  };

  const handleSettingsChange = (newSettings: WealthAdvisorPromptSettings) => {
    setPromptSettings(newSettings);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2 flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              Private Wealth Advisory
            </h2>
            <p className="text-slate-600 text-sm">Select client profile and advisory focus</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
          >
            <FaCog className="text-lg" />
            Settings
          </button>
        </div>
      </div>

      {!showScenarios ? (
        <div>
          {/* Client Profiles */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Client Profiles</h3>
            <div className="space-y-3">
              {CUSTOMER_PROFILES.map((profile, index) => (
                <div
                  key={index}
                  onClick={() => handleProfileSelect(profile)}
                  className="p-4 bg-white border border-slate-200 rounded-md hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-800 group-hover:text-slate-900">{profile.name}</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{profile.age} years</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">AUM:</span>
                      <span className="font-medium">{profile.netWorth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income:</span>
                      <span className="font-medium">{profile.annualIncome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Risk:</span>
                      <span className="font-medium">{profile.riskTolerance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Horizon:</span>
                      <span className="font-medium">{profile.timeHorizon}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{profile.investmentGoals.slice(0, 2).join(' • ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Options */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Quick Start Scenarios</h3>
            <div className="space-y-2">
              {CONVERSATION_STARTERS.slice(0, 4).map((starter, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickStart(starter)}
                  className="text-left p-3 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-md transition-all w-full"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Selected Profile Summary */}
          <div className="mb-6 p-4 bg-slate-100 border border-slate-200 rounded-md">
            <h3 className="font-medium text-slate-800 mb-2">Active Client: {selectedProfile?.name}</h3>
            <div className="grid grid-cols-3 gap-4 text-xs text-slate-600">
              <div><span className="text-slate-500">AUM:</span> <span className="font-medium">{selectedProfile?.netWorth}</span></div>
              <div><span className="text-slate-500">Risk:</span> <span className="font-medium">{selectedProfile?.riskTolerance}</span></div>
              <div><span className="text-slate-500">Focus:</span> <span className="font-medium">{selectedProfile?.investmentGoals[0]}</span></div>
            </div>
          </div>

          {/* Scenario Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3 uppercase tracking-wide">Advisory Focus Areas</h3>
            <div className="grid grid-cols-2 gap-3">
              {scenarioCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleScenarioSelect(category.id)}
                  className="p-4 bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm rounded-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-slate-600 group-hover:text-slate-800">{category.icon}</span>
                    <h4 className="font-medium text-sm text-slate-800 group-hover:text-slate-900">{category.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setShowScenarios(false)}
            className="text-slate-600 hover:text-slate-800 text-xs font-medium"
          >
            ← Back to Client Selection
          </button>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettings && promptSettings && (
        <WealthAdvisorSettings
          settings={promptSettings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
