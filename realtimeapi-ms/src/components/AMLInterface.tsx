'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FaRobot, FaProjectDiagram, FaCircle, FaChartLine, FaUsers, FaExchangeAlt, FaClipboardList, FaSearch, FaTimes, FaDownload, FaPlay, FaPause, FaCog, FaEye, FaChevronDown } from 'react-icons/fa';
import MarkdownRenderer from './MarkdownRenderer';

interface Agent {
  id: string;
  name: string;
  type: 'ingest' | 'profiler' | 'detector' | 'analyst';
  status: 'active' | 'idle' | 'processing';
  lastActivity: string;
  processedCount: number;
  skills: string[];
  specialization: string;
}

interface Account {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  riskScore: number;
  country: string;
  connections: string[];
  flagged: boolean;
  lastActivity: string;
}

interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  timestamp: string;
  riskScore: number;
  flagged: boolean;
}

interface ActivityFeedItem {
  id: string;
  agentId: string;
  agentName: string;
  type: 'processing' | 'analysis' | 'detection' | 'collaboration' | 'review_required' | 'completed';
  action: string;
  description: string;
  timestamp: string;
  status: 'live' | 'completed' | 'pending_review' | 'approved';
  requiresHumanReview: boolean;
  relatedAccountId?: string;
  relatedTransactionId?: string;
  confidence?: number;
  details?: any;
}

const AMLInterface: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityFeedItem | null>(null);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity' | 'network'>('dashboard');
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isAgentStatusCollapsed, setIsAgentStatusCollapsed] = useState(false);
  const [isActivityFeedExpanded, setIsActivityFeedExpanded] = useState(false);
  
  // Network graph smooth values
  const [networkDensity, setNetworkDensity] = useState(0.245);
  const [suspiciousClusters, setSuspiciousClusters] = useState(5);
  const [crossBorderLinks, setCrossBorderLinks] = useState(23);
  const [hubAccounts, setHubAccounts] = useState(6);
  
  // Network graph UI state
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [selectedTransactionFlow, setSelectedTransactionFlow] = useState<any>(null);
  const [graphTransitioning, setGraphTransitioning] = useState(false);
  
  // Generate consistent node positions for realistic connections
  const nodePositions = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 500 + 250,
      y: Math.random() * 350 + 70,
      accountId: `ACC${i.toString().padStart(3, '0')}`
    }));
  }, []); // Empty dependency array means this only runs once
  
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    type: 'user' | 'agent';
    agentType?: string;
  }>>([]);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [newAgentForm, setNewAgentForm] = useState({
    name: '',
    type: 'detector' as const,
    mcpEndpoint: '',
    apiKey: '',
    specialization: '',
    skills: [] as string[],
    provider: 'OpenAI' as string
  });
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    accountNumber: string;
    accountHolder: string;
    riskScore: number;
    balance: number;
    country: string;
    connections: number;
    isHub: boolean;
    transactions: number;
    lastActivity: string;
  } | null>(null);

  // Initialize data
  useEffect(() => {
    const generateMuleAccounts = (): Account[] => {
      const accounts: Account[] = [];
      const countries = ['US', 'UK', 'SG', 'HK', 'CA', 'AU'];
      
      for (let i = 0; i < 50; i++) {
        const account: Account = {
          id: `acc_${i.toString().padStart(3, '0')}`,
          accountNumber: `${Math.random().toString().slice(2, 8)}`,
          accountHolder: `Account Holder ${i + 1}`,
          balance: Math.floor(Math.random() * 1000000) + 10000,
          riskScore: Math.floor(Math.random() * 100),
          country: countries[Math.floor(Math.random() * countries.length)],
          connections: [],
          flagged: Math.random() > 0.7,
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        accounts.push(account);
      }
      
      // Create connections
      accounts.forEach(account => {
        const connectionCount = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < connectionCount; j++) {
          const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
          if (randomAccount.id !== account.id && !account.connections.includes(randomAccount.id)) {
            account.connections.push(randomAccount.id);
          }
        }
      });
      
      return accounts;
    };

    const generateTransactions = (): Transaction[] => {
      const transactions: Transaction[] = [];
      for (let i = 0; i < 100; i++) {
        const transaction: Transaction = {
          id: `txn_${i.toString().padStart(4, '0')}`,
          fromAccount: `acc_${Math.floor(Math.random() * 50).toString().padStart(3, '0')}`,
          toAccount: `acc_${Math.floor(Math.random() * 50).toString().padStart(3, '0')}`,
          amount: Math.floor(Math.random() * 100000) + 1000,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: Math.floor(Math.random() * 100),
          flagged: Math.random() > 0.8
        };
        transactions.push(transaction);
      }
      return transactions;
    };

    const generateAgents = (): Agent[] => {
      return [
        {
          id: 'agent_001',
          name: 'Transaction Ingest Agent',
          type: 'ingest',
          status: 'active',
          lastActivity: '2 min ago',
          processedCount: 1547,
          skills: ['Real-time Processing', 'Data Validation', 'Stream Management'],
          specialization: 'High-volume transaction ingestion'
        },
        {
          id: 'agent_002',
          name: 'Account Profiler Agent',
          type: 'profiler',
          status: 'processing',
          lastActivity: '1 min ago',
          processedCount: 897,
          skills: ['Network Analysis', 'Behavioral Modeling', 'Risk Profiling'],
          specialization: 'Customer behavior and network analysis'
        },
        {
          id: 'agent_003',
          name: 'ML Detection Agent',
          type: 'detector',
          status: 'active',
          lastActivity: '30 sec ago',
          processedCount: 423,
          skills: ['Machine Learning', 'Pattern Recognition', 'Anomaly Detection'],
          specialization: 'Advanced ML-based suspicious activity detection'
        },
        {
          id: 'agent_004',
          name: 'SAR Analyst Agent',
          type: 'analyst',
          status: 'active',
          lastActivity: '2 min ago',
          processedCount: 89,
          skills: ['Regulatory Compliance', 'Report Generation', 'Case Analysis'],
          specialization: 'Suspicious Activity Report generation and compliance'
        }
      ];
    };

    const generateActivityFeed = (): ActivityFeedItem[] => {
      const activities: ActivityFeedItem[] = [];
      const agentNames = ['ML Detection Agent', 'Risk Profiler Agent', 'SAR Analyst Agent', 'Compliance Monitor', 'Network Analyzer'];
      const actionTypes = ['processing', 'analysis', 'detection', 'collaboration', 'review_required', 'completed'];
      const actions = [
        'Analyzed suspicious transaction patterns',
        'Generated risk assessment report',
        'Detected potential money laundering activity',
        'Validated compliance requirements',
        'Processed cross-border transactions',
        'Created suspicious activity report',
        'Optimized detection algorithms',
        'Translated regulatory documents',
        'Generated tax calculation report',
        'Validated account verification',
        'Processed citizen ID verification',
        'Analyzed healthcare eligibility',
        'Created legal document draft',
        'Optimized service routing'
      ];
      
      for (let i = 0; i < 40; i++) {
        const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
        const type = actionTypes[Math.floor(Math.random() * actionTypes.length)] as any;
        const action = actions[Math.floor(Math.random() * actions.length)];
        const activity: ActivityFeedItem = {
          id: `activity_${i.toString().padStart(3, '0')}`,
          agentId: `agent_${Math.floor(Math.random() * 5) + 1}`,
          agentName,
          type,
          action,
          description: action,
          timestamp: new Date(Date.now() - Math.random() * 10 * 60 * 1000).toISOString(), // Last 10 minutes
          status: Math.random() > 0.7 ? 'pending_review' : 'live',
          requiresHumanReview: Math.random() > 0.3, // Increased to 0.3 for consistent 70% review chance
          confidence: Math.floor(Math.random() * 30) + 70
        };
        activities.push(activity);
      }
      return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    setAccounts(generateMuleAccounts());
    setTransactions(generateTransactions());
    setAgents(generateAgents());
    setActivityFeed(generateActivityFeed());
  }, []);

  const getRiskColor = (score: number): string => {
    if (score >= 80) return 'text-gray-800';
    if (score >= 60) return 'text-gray-600';
    return 'text-gray-500';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-gray-600';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              <p className="text-xs text-gray-500 mt-1">+{Math.floor(Math.random() * 5 + 1)} today</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">#</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.filter(a => a.riskScore > 80).length}</p>
              <p className="text-xs text-gray-500 mt-1">{((accounts.filter(a => a.riskScore > 80).length / accounts.length) * 100).toFixed(1)}% of total</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">⚠</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspicious Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.filter(t => t.flagged).length}</p>
              <p className="text-xs text-gray-500 mt-1">Last 24h: ${transactions.filter(t => t.flagged).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">$</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Detection Rate</p>
              <p className="text-2xl font-bold text-gray-900">{((transactions.filter(t => t.flagged).length / transactions.length) * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">ML confidence: 94.2%</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Distribution - Detailed to Match Others */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Data</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { 
                label: 'Critical Risk', 
                range: '(90-100)',
                count: accounts.filter(a => a.riskScore >= 90).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 90).length / accounts.length) * 100),
                avgAmount: '$847K',
                flagged: 4,
                color: 'bg-red-500',
                textColor: 'text-red-600'
              },
              { 
                label: 'High Risk', 
                range: '(70-89)',
                count: accounts.filter(a => a.riskScore >= 70 && a.riskScore < 90).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 70 && a.riskScore < 90).length / accounts.length) * 100),
                avgAmount: '$523K',
                flagged: 16,
                color: 'bg-orange-500',
                textColor: 'text-orange-600'
              },
              { 
                label: 'Medium Risk', 
                range: '(40-69)',
                count: accounts.filter(a => a.riskScore >= 40 && a.riskScore < 70).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 40 && a.riskScore < 70).length / accounts.length) * 100),
                avgAmount: '$234K',
                flagged: 18,
                color: 'bg-green-500',
                textColor: 'text-green-600'
              }
            ].map((risk, index) => (
              <div key={index} className="border border-gray-100 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-gray-700">{risk.label}</span>
                    <span className="text-xs text-gray-500">{risk.range}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{risk.count}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {risk.percentage}% • Avg: {risk.avgAmount} • Flagged: {risk.flagged}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                  <div className="text-gray-500">Percentage:</div>
                  <div className={`font-medium ${risk.textColor}`}>{risk.percentage}%</div>
                  <div className="text-gray-500">Avg Amount:</div>
                  <div className="font-medium text-gray-900">{risk.avgAmount}</div>
                  <div className="text-gray-500">Flagged:</div>
                  <div className="font-medium text-gray-900">{risk.flagged}</div>
                  <div className="text-gray-500">Total Accounts:</div>
                  <div className="font-medium text-gray-900">{risk.count}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${risk.color}`}
                    style={{width: `${risk.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary to match Transaction Patterns */}
          <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-xs">
            <span className="text-gray-500">Total Accounts: <span className="font-medium text-gray-900">{accounts.length}</span></span>
            <span className="text-gray-500">Risk Score Avg: <span className="font-medium text-orange-600">{Math.floor(Math.random() * 15) + 65}</span></span>
          </div>
        </div>

        {/* Transaction Flow Analysis - Condensed */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Patterns</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 24h</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Large Transfers */}
            <div className="border border-gray-100 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Large Transfers</span>
                <span className="text-sm font-bold text-gray-900">{transactions.filter(t => t.amount > 10000).length}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                Avg: ${(transactions.filter(t => t.amount > 10000).reduce((sum, t) => sum + t.amount, 0) / Math.max(transactions.filter(t => t.amount > 10000).length, 1) / 1000).toFixed(0)}K • 
                Vol: ${(transactions.filter(t => t.amount > 10000).reduce((sum, t) => sum + t.amount, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                <div className="text-gray-500">CTR Required:</div>
                <div className="font-medium text-blue-600">{Math.floor(Math.random() * 3) + 5}</div>
                <div className="text-gray-500">Wire Transfers:</div>
                <div className="font-medium text-gray-900">{Math.floor(Math.random() * 8) + 15}</div>
                <div className="text-gray-500">Max Amount:</div>
                <div className="font-medium text-red-600">${Math.floor(Math.random() * 500) + 250}K</div>
                <div className="text-gray-500">Business Days:</div>
                <div className="font-medium text-gray-900">{Math.floor(Math.random() * 3) + 4}</div>
                <div className="text-gray-500">Weekend Txns:</div>
                <div className="font-medium text-orange-600">{Math.floor(Math.random() * 5) + 2}</div>
                <div className="text-gray-500">EDD Required:</div>
                <div className="font-medium text-purple-600">{Math.floor(Math.random() * 3) + 1}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{width: `${Math.min((transactions.filter(t => t.amount > 10000).length / transactions.length) * 100 * 4, 100)}%`}}></div>
              </div>
            </div>
            
            {/* Cross-Border */}
            <div className="border border-gray-100 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Cross-Border</span>
                <span className="text-sm font-bold text-gray-900">{Math.floor(transactions.length * 0.23)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                23% • US→SG • Risk: {Math.floor(Math.random() * 15) + 65}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                <div className="text-gray-500">High-Risk Routes:</div>
                <div className="font-medium text-red-600">{Math.floor(Math.random() * 3) + 2}</div>
                <div className="text-gray-500">Sanctions Check:</div>
                <div className="font-medium text-green-600">Pass</div>
                <div className="text-gray-500">SWIFT Messages:</div>
                <div className="font-medium text-blue-600">{Math.floor(Math.random() * 15) + 45}</div>
                <div className="text-gray-500">Correspondent:</div>
                <div className="font-medium text-gray-900">{Math.floor(Math.random() * 8) + 12}</div>
                <div className="text-gray-500">Time Zones:</div>
                <div className="font-medium text-purple-600">{Math.floor(Math.random() * 3) + 5}</div>
                <div className="text-gray-500">PEP Matches:</div>
                <div className="font-medium text-red-600">{Math.floor(Math.random() * 2)}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-orange-500 h-1 rounded-full" style={{width: '23%'}}></div>
              </div>
            </div>
            
            {/* Rapid Sequences */}
            <div className="border border-gray-100 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Rapid Sequences</span>
                <span className="text-sm font-bold text-gray-900">{Math.floor(transactions.length * 0.08)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                &lt;5min: {Math.floor(transactions.length * 0.05)} • {Math.floor(Math.random() * 8) + 12}/min
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                <div className="text-gray-500">Peak Hour:</div>
                <div className="font-medium text-purple-600">{Math.floor(Math.random() * 12) + 9}:00</div>
                <div className="text-gray-500">Velocity Score:</div>
                <div className="font-medium text-orange-600">{Math.floor(Math.random() * 20) + 75}</div>
                <div className="text-gray-500">Burst Patterns:</div>
                <div className="font-medium text-red-600">{Math.floor(Math.random() * 4) + 3}</div>
                <div className="text-gray-500">Same Account:</div>
                <div className="font-medium text-gray-900">{Math.floor(Math.random() * 6) + 8}</div>
                <div className="text-gray-500">Micro Intervals:</div>
                <div className="font-medium text-blue-600">{Math.floor(Math.random() * 3) + 2}</div>
                <div className="text-gray-500">Alert Threshold:</div>
                <div className="font-medium text-orange-600">85%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{width: '8%'}}></div>
              </div>
            </div>

            {/* Round Numbers */}
            <div className="border border-gray-100 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Round Numbers</span>
                <span className="text-sm font-bold text-gray-900">{transactions.filter(t => t.amount % 1000 === 0).length}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                $10K: {transactions.filter(t => t.amount === 10000).length} • Suspicion: High
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs mb-1">
                <div className="text-gray-500">Structuring Risk:</div>
                <div className="font-medium text-red-600">High</div>
                <div className="text-gray-500">Pattern Match:</div>
                <div className="font-medium text-red-600">{Math.floor(Math.random() * 15) + 85}%</div>
                <div className="text-gray-500">$9K Clusters:</div>
                <div className="font-medium text-orange-600">{Math.floor(Math.random() * 4) + 2}</div>
                <div className="text-gray-500">Sequential:</div>
                <div className="font-medium text-red-600">{Math.floor(Math.random() * 3) + 1}</div>
                <div className="text-gray-500">Just Under:</div>
                <div className="font-medium text-purple-600">{Math.floor(Math.random() * 5) + 3}</div>
                <div className="text-gray-500">SAR Priority:</div>
                <div className="font-medium text-red-600">High</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-red-500 h-1 rounded-full" style={{width: `${Math.min((transactions.filter(t => t.amount % 1000 === 0).length / transactions.length) * 100 * 8, 100)}%`}}></div>
              </div>
            </div>
          </div>
          
          {/* Compact Summary */}
          <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-xs">
            <span className="text-gray-500">ML Confidence: <span className="font-medium text-green-600">{Math.floor(Math.random() * 5) + 94}%</span></span>
            <span className="text-gray-500">Anomaly: <span className="font-medium text-orange-600">{Math.floor(Math.random() * 20) + 15}/100</span></span>
          </div>
        </div>

        {/* Geographic Risk Analysis - Back to Original Better Design */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Risk Analysis</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live Data</span>
          </div>
          <div className="space-y-2">
            {[
              { code: 'US', name: 'United States', risk: 65, txns: 1247, volume: '$2.4M', compliance: 'High', sanctions: 0 },
              { code: 'UK', name: 'United Kingdom', risk: 45, txns: 892, volume: '$1.8M', compliance: 'High', sanctions: 0 },
              { code: 'SG', name: 'Singapore', risk: 72, txns: 634, volume: '$1.2M', compliance: 'Medium', sanctions: 0 },
              { code: 'HK', name: 'Hong Kong', risk: 62, txns: 543, volume: '$980K', compliance: 'Medium', sanctions: 1 },
              { code: 'CA', name: 'Canada', risk: 50, txns: 421, volume: '$750K', compliance: 'High', sanctions: 0 },
              { code: 'AU', name: 'Australia', risk: 54, txns: 312, volume: '$620K', compliance: 'High', sanctions: 0 }
            ].map(country => {
              const getRiskColor = (risk: number) => {
                if (risk >= 70) return 'text-red-600 bg-red-50';
                if (risk >= 50) return 'text-orange-600 bg-orange-50';
                return 'text-green-600 bg-green-50';
              };
              
              const getComplianceColor = (compliance: string) => {
                return compliance === 'High' ? 'text-green-600' : 'text-orange-600';
              };

              return (
                <div key={country.code} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-bold text-gray-900 w-6">{country.code}</span>
                    <span className="text-sm text-gray-600 min-w-0 flex-1">{country.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="text-right">
                      <div className="text-gray-500">Transactions</div>
                      <div className="font-medium text-gray-900">{country.txns.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500">Volume</div>
                      <div className="font-medium text-gray-900">{country.volume}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500">Compliance</div>
                      <div className={`font-medium ${getComplianceColor(country.compliance)}`}>
                        {country.compliance}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${country.risk >= 70 ? 'bg-red-500' : country.risk >= 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{width: `${country.risk}%`}}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getRiskColor(country.risk)}`}>
                        {country.risk}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Additional Geographic Insights */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-gray-500 mb-2">Risk Corridors</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">US → SG</span>
                    <span className="font-medium text-red-600">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HK → CA</span>
                    <span className="font-medium text-orange-600">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UK → AU</span>
                    <span className="font-medium text-green-600">Low</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-2">Regulatory Status</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">FATF Compliance</span>
                    <span className="font-medium text-green-600">6/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CRS Reporting</span>
                    <span className="font-medium text-blue-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sanctions Updates</span>
                    <span className="font-medium text-gray-900">2h ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Total Cross-Border Volume: <span className="font-medium text-gray-900">$8.9M</span></span>
                <span className="text-gray-500">Risk Coverage: <span className="font-medium text-green-600">98.2%</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer flex-1"
            onClick={() => setIsAgentStatusCollapsed(!isAgentStatusCollapsed)}
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Agent Status</h3>
              <p className="text-sm text-gray-600">Multi-agent system for AML detection</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowAddAgentModal(true)}
              className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
              title="Add External Agent"
            >
              <span className="text-lg font-medium">+</span>
            </button>
            <button
              onClick={() => setIsAgentStatusCollapsed(!isAgentStatusCollapsed)}
              className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
              title={isAgentStatusCollapsed ? 'Expand Agent Status' : 'Collapse Agent Status'}
            >
              <FaChevronDown 
                className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                  isAgentStatusCollapsed ? '-rotate-90' : 'rotate-0'
                }`}
              />
            </button>
          </div>
        </div>
        {!isAgentStatusCollapsed && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {agents.map(agent => (
                <div 
                  key={agent.id} 
                  className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">AI</span>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <h4 className="font-medium text-gray-900 text-xs mb-1">{agent.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">Status: {agent.status}</p>
                  <p className="text-xs text-gray-600">Processed: {agent.processedCount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Flagged Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Flagged Transactions</h3>
          <p className="text-sm text-gray-600">High-risk transactions requiring review</p>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.filter(t => t.flagged).map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${transaction.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRiskColor(transaction.riskScore)}`}>
                      {transaction.riskScore}/100
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderActivityAndChat = () => (
    <div className="h-full max-h-screen overflow-y-auto">
      <div className="space-y-4 min-h-full">
        {renderActivityFeed()}
        
        {/* AML Agent Chat - Extended height by 130px total - Moved 10px up */}
        <div className="h-[470px] flex-shrink-0 -mt-2">
          {renderChatInterface()}
        </div>
      </div>
    </div>
  );

  const renderActivityFeed = () => (
    <div className="space-y-6">
      <div className={`bg-white border border-gray-200 rounded-lg ${isActivityFeedExpanded ? 'h-[510px]' : 'h-[310px]'}`}>
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live AI Activity Feed</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
            <button
              onClick={() => setIsActivityFeedExpanded(!isActivityFeedExpanded)}
              className="w-6 h-6 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
              title={isActivityFeedExpanded ? 'Collapse Activity Feed' : 'Expand Activity Feed'}
            >
              <FaChevronDown 
                className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${
                  isActivityFeedExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className={`${isActivityFeedExpanded ? 'h-[450px]' : 'h-[250px]'} overflow-y-auto`}>
          {activityFeed.slice(0, isActivityFeedExpanded ? 15 : 5).map((activity) => {
            const timeAgo = Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / (1000 * 60));
            const timeDisplay = timeAgo < 1 ? 'now' : `${timeAgo} min ago`;
            
            return (
              <div 
                key={activity.id} 
                className={`px-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  activity.requiresHumanReview ? 'border-l-4 border-l-yellow-400' : ''
                }`}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="flex items-center space-x-3">
                  {/* Agent Indicator - smaller circle */}
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.requiresHumanReview ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{activity.agentName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{timeDisplay}</span>
                        {activity.requiresHumanReview && (
                          <>
                            <button 
                              className="px-2 py-1 text-xs bg-white text-blue-700 border border-blue-700 rounded-full hover:bg-blue-50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedActivity(activity);
                              }}
                            >
                              Review
                            </button>
                            <button 
                              className="px-2 py-1 text-xs bg-white text-green-700 border border-green-700 rounded-full hover:bg-green-50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle approve logic here
                              }}
                            >
                              Approve
                            </button>
                          </>
                        )}
                        {activity.status === 'completed' && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Management View - Fixed Heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Agent Collaboration Queue (Fixed for 3 reviews) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-[430px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Agent Collaboration Queue</h3>
            <div className="text-xs text-gray-500 text-right">
              <div>Active agents: {agents.filter(a => a.status === 'active').length}</div>
              <div>Collaboration rate: {Math.round(Math.random() * 20 + 75)}%</div>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Multi-Agent Reviews</span>
              <span className="text-lg font-bold text-gray-900">
                {activityFeed.filter(a => a.requiresHumanReview && a.status === 'pending_review').length}
              </span>
            </div>
            
            {/* Dynamic reviews from live feed - Always show reviews */}
            <div className="space-y-2 flex-1 overflow-hidden">
              {(() => {
                const reviewItems = activityFeed.filter(a => a.requiresHumanReview && a.status === 'pending_review');
                
                // If no reviews available, create some immediately
                if (reviewItems.length === 0) {
                  const fallbackReviews: ActivityFeedItem[] = [
                    {
                      id: `fallback_${Date.now()}_1`,
                      agentId: 'agent_risk_profiler',
                      agentName: 'Risk Profiler Agent',
                      type: 'review_required',
                      action: 'Detected suspicious cross-border activity',
                      description: 'Cross-border transaction pattern requires human review',
                      timestamp: new Date().toISOString(),
                      status: 'pending_review',
                      requiresHumanReview: true,
                      confidence: 78,
                      relatedAccountId: 'ACC' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
                    }
                  ];
                  // Add fallback to activity feed
                  setActivityFeed(prev => [...fallbackReviews, ...prev]);
                  return fallbackReviews.slice(0, 3).map((item, index) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedActivity(item)}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors h-[70px]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs font-medium text-gray-700 truncate">{item.agentName}</span>
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            Review Required
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {Math.floor((Date.now() - new Date(item.timestamp).getTime()) / 60000)}m ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 line-clamp-1 flex-1 min-w-0 pr-2">{item.action}</p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          Confidence: {item.confidence}%
                        </span>
                      </div>
                    </div>
                  ));
                }
                
                // Show actual review items from live feed
                return reviewItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedActivity(item)}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors h-[70px]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-xs font-medium text-gray-700 truncate">{item.agentName}</span>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          Review Required
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {Math.floor((Date.now() - new Date(item.timestamp).getTime()) / 60000)}m ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 line-clamp-1 flex-1 min-w-0 pr-2">{item.action}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        Confidence: {item.confidence}%
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
          </div>
        </div>

        {/* Right Column: Stacked Analytics - Fixed Heights */}
        <div className="space-y-4 h-[450px]">
          {/* Processing Analytics */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Processing Analytics</h3>
              <span className="text-lg font-bold text-gray-900">
                {Math.round((activityFeed.filter(a => !a.requiresHumanReview).length / activityFeed.length) * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">Active</div>
                <div className="font-bold text-gray-900">{activityFeed.filter(a => a.status === 'live').length}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Done</div>
                <div className="font-bold text-green-600">{activityFeed.filter(a => a.status === 'completed').length}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Time</div>
                <div className="font-bold text-gray-900">{Math.floor(Math.random() * 15) + 8}s</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Efficiency</div>
                <div className="font-bold text-blue-600">{Math.floor(Math.random() * 10) + 88}%</div>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-200">
              <span>ML: {Math.floor(Math.random() * 20) + 65}%</span>
              <span>Risk: {Math.floor(Math.random() * 15) + 78}%</span>
              <span>Compliance: {Math.floor(Math.random() * 8) + 92}%</span>
            </div>
          </div>

          {/* Agent Collaboration */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-[120px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Agent Collaboration</h3>
              <span className="text-lg font-bold text-gray-900">
                {activityFeed.filter(a => a.type === 'collaboration').length || Math.floor(Math.random() * 15) + 12}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-500">Success</div>
                <div className="font-bold text-green-600">{Math.floor(Math.random() * 8) + 92}%</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Handoff</div>
                <div className="font-bold text-gray-900">{Math.floor(Math.random() * 3) + 2}min</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Multi</div>
                <div className="font-bold text-purple-600">{Math.floor(Math.random() * 5) + 8}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500">Consensus</div>
                <div className="font-bold text-blue-600">{Math.floor(Math.random() * 6) + 94}%</div>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-200">
              <span>Ingest→Prof: {Math.floor(Math.random() * 8) + 15}</span>
              <span>Prof→Det: {Math.floor(Math.random() * 6) + 12}</span>
              <span>Det→Ana: {Math.floor(Math.random() * 4) + 8}</span>
            </div>
          </div>

          {/* Regulatory Compliance Tracker */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 h-[160px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Compliance Tracker</h3>
              <span className="text-lg font-bold text-gray-900">
                {Math.floor(Math.random() * 3) + 97}%
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">SAR Filings (30d)</span>
                <span className="font-bold text-green-600">{Math.floor(Math.random() * 5) + 23}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">CTR Reports</span>
                <span className="font-bold text-blue-600">{Math.floor(Math.random() * 10) + 156}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">KYC Updates</span>
                <span className="font-bold text-purple-600">{Math.floor(Math.random() * 20) + 89}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Policy Violations</span>
                <span className="font-bold text-red-600">{Math.floor(Math.random() * 3) + 2}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs mt-2 pt-2 border-t border-gray-200">
              <span>Next Audit: {Math.floor(Math.random() * 10) + 15} days</span>
              <span>Compliance Score: A+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNetworkGraph = () => (
    <div className="space-y-6">
      {/* Network Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Network Density</p>
              <p className="text-2xl font-bold text-gray-900">{networkDensity.toFixed(3)}</p>
              <p className="text-xs text-gray-500 mt-1">Connectivity ratio</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">◯</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspicious Clusters</p>
              <p className="text-2xl font-bold text-gray-900">{suspiciousClusters}</p>
              <p className="text-xs text-gray-500 mt-1">High-risk groups</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">⚬</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cross-Border Links</p>
              <p className="text-2xl font-bold text-gray-900">{crossBorderLinks}</p>
              <p className="text-xs text-gray-500 mt-1">International connections</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">↔</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hub Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{hubAccounts}</p>
              <p className="text-xs text-gray-500 mt-1">Central nodes</p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">⊙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Account Network Graph</h3>
            <p className="text-sm text-gray-600">Interactive visualization of account relationships and transaction flows</p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>All Connections</option>
              <option>High Risk Only</option>
              <option>Flagged Accounts</option>
              <option>Cross-Border</option>
            </select>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
              Reset View
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-6">
            {/* D3 Graph Container */}
            <div className={`${selectedNode ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              <div id="network-graph" className="w-full h-[585px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                {/* Simulated Network Nodes with Fade Transitions */}
                <svg width="100%" height="100%" className={`absolute inset-0 transition-opacity duration-300 ${graphTransitioning ? 'opacity-30' : 'opacity-100'}`}>
                  {/* Generate realistic connection lines between actual nodes */}
                  {nodePositions.map((sourceNode, i) => {
                    const connectionCount = Math.floor(Math.random() * 3) + 1; // 1-3 connections per node
                    return Array.from({ length: connectionCount }, (_, j) => {
                      const targetIndex = Math.floor(Math.random() * nodePositions.length);
                      if (targetIndex !== i) { // Don't connect to self
                        const target = nodePositions[targetIndex];
                        return (
                          <line
                            key={`line-${i}-${targetIndex}-${j}`}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={target.x}
                            y2={target.y}
                            stroke="#d1d5db"
                            strokeWidth={1}
                            strokeOpacity={0.3}
                          />
                        );
                      }
                      return null;
                    }).filter(Boolean);
                  }).flat()}
                  
                  {/* Generate network nodes using consistent positions */}
                  {nodePositions.map((nodePos, i) => {
                    const x = nodePos.x;
                    const y = nodePos.y;
                    const size = Math.random() * 16 + 8;
                    const risk = Math.random() * 100;
                    const isHub = Math.random() > 0.85;
                    const isFlagged = risk > 75;
                    const accountId = `ACC${i.toString().padStart(3, '0')}`;
                    
                    const nodeData = {
                      id: accountId,
                      accountNumber: `${Math.random().toString().slice(2, 10)}`,
                      accountHolder: `Account Holder ${i + 1}`,
                      riskScore: Math.round(risk),
                      balance: Math.floor(Math.random() * 500000) + 10000,
                      country: ['US', 'UK', 'SG', 'HK', 'CA', 'AU'][Math.floor(Math.random() * 6)],
                      connections: Math.floor(Math.random() * 8) + 2,
                      isHub,
                      transactions: Math.floor(Math.random() * 200) + 10,
                      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                    };
                    
                    return (
                      <g key={i}>
                        {/* Account nodes */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHub ? size + 3 : size}
                          fill={
                            isFlagged ? "#374151" :
                            risk > 60 ? "#6b7280" :
                            risk > 40 ? "#9ca3af" : "#d1d5db"
                          }
                          stroke={isHub ? "#1f2937" : selectedNode?.id === accountId ? "#1f2937" : "none"}
                          strokeWidth={isHub ? 2 : selectedNode?.id === accountId ? 3 : 0}
                          className="cursor-pointer hover:opacity-80 transition-all"
                          onClick={() => setSelectedNode(nodeData)}
                        />
                        
                        {/* Account labels for ALL nodes */}
                        <text
                          x={x}
                          y={y - size - 5}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#374151"
                          className="font-medium pointer-events-none"
                        >
                          {accountId}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Legend */}
                  <g transform="translate(20, 20)">
                    <rect x="0" y="0" width="180" height="120" fill="white" stroke="#d1d5db" strokeWidth="1" rx="4" />
                    <text x="10" y="15" fontSize="12" fill="#374151" className="font-medium">Network Legend</text>
                    
                    <circle cx="20" cy="35" r="6" fill="#374151" />
                    <text x="35" y="40" fontSize="11" fill="#374151">High Risk (80+)</text>
                    
                    <circle cx="20" cy="55" r="6" fill="#6b7280" />
                    <text x="35" y="60" fontSize="11" fill="#374151">Medium Risk (60-79)</text>
                    
                    <circle cx="20" cy="75" r="6" fill="#9ca3af" />
                    <text x="35" y="80" fontSize="11" fill="#374151">Low Risk (40-59)</text>
                    
                    <circle cx="20" cy="95" r="8" fill="none" stroke="#1f2937" strokeWidth="2" />
                    <text x="35" y="100" fontSize="11" fill="#374151">Hub Account</text>
                  </g>
                </svg>
                
                {/* Interactive overlay message */}
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm text-gray-600">
                  Click nodes for account details
                </div>
              </div>
            </div>

            {/* Node Details Panel */}
            {selectedNode && (
              <div className="w-1/3 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Account Details</h4>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Account ID:</span>
                        <p className="font-medium text-gray-900">{selectedNode.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Account Number:</span>
                        <p className="font-medium text-gray-900">{selectedNode.accountNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Account Holder:</span>
                        <p className="font-medium text-gray-900">{selectedNode.accountHolder}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Country:</span>
                        <p className="font-medium text-gray-900">{selectedNode.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Risk Assessment</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Risk Score:</span>
                        <span className={`text-sm font-medium ${getRiskColor(selectedNode.riskScore)}`}>
                          {selectedNode.riskScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedNode.riskScore >= 80 ? 'bg-gray-700' : 
                            selectedNode.riskScore >= 60 ? 'bg-gray-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${selectedNode.riskScore}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedNode.riskScore >= 80 ? 'bg-gray-200 text-gray-800' : 
                          selectedNode.riskScore >= 60 ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-600'
                        }`}>
                          {selectedNode.riskScore >= 80 ? 'High Risk' : 
                           selectedNode.riskScore >= 60 ? 'Medium Risk' : 'Low Risk'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-medium text-gray-900 mb-2">Account Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Balance:</span>
                        <span className="font-medium text-gray-900">${selectedNode.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Transactions:</span>
                        <span className="font-medium text-gray-900">{selectedNode.transactions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Connections:</span>
                        <span className="font-medium text-gray-900">{selectedNode.connections}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Hub Account:</span>
                        <span className="font-medium text-gray-900">{selectedNode.isHub ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedNode.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                      View Transactions
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                      Flag Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network Analysis Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cluster Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cluster Analysis</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: 'cluster-1',
                name: 'High-Risk Structuring',
                accounts: 12,
                risk: 'Critical',
                pattern: 'Sequential deposits under $10K',
                color: 'bg-white border-red-300 text-red-800',
                riskColor: 'text-red-600',
                reasoning: 'Pattern indicates potential structuring to avoid CTR reporting. Multiple accounts making deposits just under the $10,000 threshold within short timeframes.',
                llmInsight: 'AI Detection: 94.2% confidence. Recommend immediate SAR filing for structured deposits.'
              },
              {
                id: 'cluster-2', 
                name: 'Cross-Border Network',
                accounts: 8,
                risk: 'High',
                pattern: 'International wire transfers',
                color: 'bg-white border-orange-300 text-orange-700',
                riskColor: 'text-orange-600',
                reasoning: 'Coordinated international transfers between accounts in different jurisdictions, potentially indicating trade-based money laundering or sanctions evasion.',
                llmInsight: 'AI Analysis: Cross-jurisdictional patterns detected. Enhanced due diligence required.'
              },
              {
                id: 'cluster-3',
                name: 'Rapid Movement',
                accounts: 15,
                risk: 'High',
                pattern: 'Fast in-out transactions',
                color: 'bg-white border-yellow-400 text-yellow-700',
                riskColor: 'text-yellow-600',
                reasoning: 'Funds entering and leaving accounts within hours, suggesting layering activity to obscure money trail and complicate transaction tracking.',
                llmInsight: 'AI Alert: Velocity patterns indicate sophisticated layering. Monitor for 72 hours.'
              },
              {
                id: 'cluster-4',
                name: 'Shell Network',
                accounts: 6,
                risk: 'Critical',
                pattern: 'Dormant accounts activated',
                color: 'bg-white border-red-300 text-red-800',
                riskColor: 'text-red-600',
                reasoning: 'Previously dormant accounts suddenly activated with large transactions, indicating potential use of shell accounts for money laundering operations.',
                llmInsight: 'AI Warning: Shell account activation detected. Immediate investigation required.'
              },
              {
                id: 'cluster-5',
                name: 'Trade-Based Laundering',
                accounts: 9,
                risk: 'High',
                pattern: 'Over/under-invoicing schemes',
                color: 'bg-white border-purple-300 text-purple-700',
                riskColor: 'text-purple-600',
                reasoning: 'Complex trade transactions with price manipulation, multiple invoices, and goods movement inconsistent with declared values, indicating trade-based money laundering.',
                llmInsight: 'AI Detection: Trade anomalies identified. Cross-reference with customs data required.'
              },
              {
                id: 'cluster-6',
                name: 'Cryptocurrency Bridge',
                accounts: 4,
                risk: 'Critical',
                pattern: 'Crypto-to-fiat conversions',
                color: 'bg-white border-indigo-300 text-indigo-800',
                riskColor: 'text-indigo-600',
                reasoning: 'Frequent cryptocurrency exchanges followed by immediate fiat withdrawals, potentially obscuring fund origins through digital asset conversion.',
                llmInsight: 'AI Alert: Crypto mixing patterns detected. Enhanced blockchain analysis needed.'
              }
            ].map((cluster) => (
              <div
                key={cluster.id}
                onClick={() => setSelectedCluster(cluster)}
                className={`${cluster.color} border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{cluster.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cluster.risk === 'Critical' ? 'bg-red-100 text-red-700' :
                    cluster.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{cluster.risk}</span>
                </div>
                <div className="space-y-1 mb-2">
                  <div className="text-xs opacity-80">
                    <span className="font-medium">{cluster.accounts}</span> accounts
                  </div>
                  <div className="text-xs opacity-70 line-clamp-1">
                    {cluster.pattern}
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    💡 {cluster.llmInsight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Flow Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Flow Patterns</h3>
          <div className="space-y-4">
            {[
              { 
                id: 'fanout',
                pattern: 'Fan-out Pattern', 
                count: 23, 
                description: 'Single source to multiple destinations',
                riskLevel: 'High',
                detectedAccounts: ['ACC001', 'ACC045', 'ACC089', 'ACC156'],
                totalAmount: '$2.4M',
                reasoning: 'Classic money laundering pattern where funds from one account are rapidly distributed to multiple accounts to create distance and obscure the money trail.'
              },
              { 
                id: 'fanin',
                pattern: 'Fan-in Pattern', 
                count: 18, 
                description: 'Multiple sources to single destination',
                riskLevel: 'Critical',
                detectedAccounts: ['ACC023', 'ACC067', 'ACC134', 'ACC201'],
                totalAmount: '$1.8M',
                reasoning: 'Funds from multiple accounts converging into a single account, often indicating collection phase of money laundering or structuring to avoid reporting thresholds.'
              },
              { 
                id: 'circular',
                pattern: 'Circular Flow', 
                count: 12, 
                description: 'Funds returning to origin accounts',
                riskLevel: 'Critical',
                detectedAccounts: ['ACC012', 'ACC078', 'ACC145'],
                totalAmount: '$950K',
                reasoning: 'Highly suspicious circular transactions designed to create artificial transaction volume and complicate audit trails, often used in trade-based money laundering.'
              },
              { 
                id: 'chain',
                pattern: 'Chain Pattern', 
                count: 31, 
                description: 'Sequential account transfers',
                riskLevel: 'High',
                detectedAccounts: ['ACC034', 'ACC091', 'ACC178', 'ACC245', 'ACC289'],
                totalAmount: '$3.2M',
                reasoning: 'Sequential transfers through multiple accounts to create layering effect, making it difficult to trace original source and ultimate destination of funds.'
              }
            ].map((flow, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedTransactionFlow(flow)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{flow.pattern}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flow.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                      flow.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {flow.riskLevel}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {flow.count} detected
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{flow.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Click to view detailed analysis and affected accounts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Add real-time activity updates
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      // Add new activity - increased frequency of reviews
      if (Math.random() > 0.4) {
        const agentNames = ['ML Detection Agent', 'Risk Profiler Agent', 'SAR Analyst Agent', 'Compliance Monitor', 'Network Analyzer'];
        const actions = [
          'Analyzed suspicious transaction patterns',
          'Generated risk assessment report',
          'Detected potential money laundering activity',
          'Validated compliance requirements',
          'Processed cross-border transactions',
          'Created suspicious activity report',
          'Flagged unusual wire transfer sequence',
          'Identified structuring behavior patterns',
          'Detected cross-border risk indicators',
          'Found PEP relationship connections'
        ];
        
        const newActivity: ActivityFeedItem = {
          id: `activity_${Date.now()}`,
          agentId: `agent_${Math.floor(Math.random() * 5) + 1}`,
          agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
          type: 'processing' as any,
          action: actions[Math.floor(Math.random() * actions.length)],
          description: actions[Math.floor(Math.random() * actions.length)],
          timestamp: new Date().toISOString(),
          status: Math.random() > 0.7 ? 'pending_review' : 'live',
          requiresHumanReview: Math.random() > 0.3, // Increased to 0.3 for even more reviews (70% chance)
          confidence: Math.floor(Math.random() * 30) + 70
        };
        
        setActivityFeed(prev => [newActivity, ...prev.slice(0, 39)]);
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Smooth network graph updates with fade transitions
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      // Start fade transition
      setGraphTransitioning(true);
      
      // After fade out, update values
      setTimeout(() => {
        // Small, smooth changes instead of drastic jumps
        setNetworkDensity(prev => {
          const change = (Math.random() - 0.5) * 0.01; // ±0.005 change
          return Math.max(0.15, Math.min(0.45, prev + change));
        });
        
        setSuspiciousClusters(prev => {
          const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return Math.max(3, Math.min(10, prev + change));
        });
        
        setCrossBorderLinks(prev => {
          const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return Math.max(15, Math.min(40, prev + change));
        });
        
        setHubAccounts(prev => {
          const change = Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return Math.max(4, Math.min(8, prev + change));
        });
        
        // End fade transition (fade back in)
        setTimeout(() => setGraphTransitioning(false), 300);
      }, 300);
    }, 15000); // Update every 15 seconds (slower, smoother)
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const renderChatInterface = () => {
    // Align with Agent Status section - use exact same agents and styling
    const amlAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      shortName: agent.name.split(' ')[0], // First word only for compact display
      isOnline: agent.status === 'active' || agent.status === 'processing',
      status: agent.status,
      type: agent.type,
      specialization: agent.specialization
    }));

    const handleSendMessage = async () => {
      if (!chatInput.trim()) return;

      const userMessage = {
        id: `msg_${Date.now()}`,
        sender: 'You',
        message: chatInput,
        timestamp: new Date().toLocaleTimeString(),
        type: 'user' as const
      };

      setChatMessages(prev => [...prev, userMessage]);
      const currentInput = chatInput;
      setChatInput('');

      // Create system prompt with real AML context
      const systemPrompt = `You are an expert AML (Anti-Money Laundering) detection system. Provide detailed, actionable analysis based on the current data.

**Current AML System Status:**
- Total accounts monitored: ${accounts.length}
- High-risk accounts: ${accounts.filter(a => a.riskScore > 80).length}
- Suspicious transactions flagged: ${transactions.filter(t => t.riskScore > 75).length}
- Active monitoring agents: ${agents.filter(a => a.status === 'active').length}

**Your Expertise:**
- Pattern detection and anomaly identification
- Risk assessment and compliance analysis
- Suspicious activity reporting (SAR) recommendations
- Account network analysis and mule detection
- Transaction flow pattern recognition
- Regulatory compliance guidance

**Response Format:**
- Use markdown formatting for clear, professional responses
- Include specific account numbers, amounts, and risk scores when relevant
- Provide actionable recommendations
- Be concise but thorough
- Focus on high-priority risks and immediate actions needed

When asked about specific accounts or transactions, reference the actual data provided. Always prioritize critical risks and compliance requirements.`;

      try {
        const requestBody = {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: currentInput }
          ],
          stream: true
        };
        
        console.log('AML Chat - Sending request:', JSON.stringify(requestBody, null, 2));
        
        // OpenAI API call with streaming
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AML Chat - API error:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const jsonData = JSON.parse(line.slice(6));
                const content = jsonData.choices?.[0]?.delta?.content;
                
                if (content) {
                  accumulatedContent += content;
                  setStreamingMessage(accumulatedContent);
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }

        // Create final message
        const assistantMessage = {
          id: `msg_${Date.now()}_assistant`,
          sender: 'AML Analyst',
          message: accumulatedContent,
          timestamp: new Date().toLocaleTimeString(),
          type: 'agent' as const,
          agentType: 'analyst'
        };

        setChatMessages(prev => [...prev, assistantMessage]);
        setStreamingMessage('');

      } catch (error) {
        console.error('Chat error:', error);
        
        // Fallback to non-streaming
        try {
          const fallbackResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: currentInput }
              ]
            })
          });

          const data = await fallbackResponse.json();
          const assistantMessage = {
            id: `msg_${Date.now()}_fallback`,
            sender: 'AML Analyst',
            message: data.choices?.[0]?.message?.content || data.response || data.content || 'I\'m analyzing your request. Please ensure the AI service is available.',
            timestamp: new Date().toLocaleTimeString(),
            type: 'agent' as const,
            agentType: 'analyst'
          };
          
          setChatMessages(prev => [...prev, assistantMessage]);

        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          const errorMessage = {
            id: `msg_${Date.now()}_error`,
            sender: 'System',
            message: 'Unable to connect to AML analysis service. Please check your connection and try again.',
            timestamp: new Date().toLocaleTimeString(),
            type: 'agent' as const,
            agentType: 'system'
          };
          setChatMessages(prev => [...prev, errorMessage]);
        }
      }
    };

    // Enhanced AML-specific prompts for real LLM integration
    const amlPrompts = [
      "Show me accounts with suspicious velocity patterns",
      "Analyze cross-border transaction networks for layering", 
      "Identify potential structuring behavior in recent transactions",
      "Review high-risk accounts for SAR filing recommendations",
      "Joint effort: Identify coordinated suspicious behaviors",
      "Agent collaboration: Priority case risk assessment"
    ];

    const handleAddAgent = () => {
      setShowAddAgentModal(true);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-full">
        {/* Header with Agent Indicators - Bancassurance Style */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AML Agent Collaboration</h3>
              <p className="text-sm text-gray-600">Multi-agent investigation workspace</p>
            </div>
            
            {/* Agent Indicators - Matching Agent Status Section */}
            <div className="flex items-center gap-2">
              {amlAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-1">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center relative">
                    <span className="text-xs font-medium text-white">AI</span>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${agent.isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border border-white`}></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{agent.shortName}</span>
                </div>
              ))}
              
              {/* Add Agent Button - Matching Agent Status Style */}
              <button
                onClick={handleAddAgent}
                className="w-5 h-5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Add Agent via MCP Protocol"
              >
                <span className="text-xs font-bold">+</span>
              </button>
              
              {/* Reset Chat Button */}
              <button
                onClick={() => setChatMessages([])}
                className="w-5 h-5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors ml-1"
                title="Reset Chat History"
              >
                <span className="text-xs">↻</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick AML Prompts */}
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-25">
          <div className="flex flex-wrap gap-1">
            {amlPrompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                onClick={() => setChatInput(prompt)}
                className="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat Messages - Compact */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-0">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm font-medium text-gray-700">AML Investigation Team Ready</p>
              <p className="text-xs text-gray-500 mt-2">Ask about patterns, risks, or compliance</p>
              <p className="text-xs text-gray-400 mt-1">{amlAgents.filter(a => a.isOnline).length} agents online</p>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.type === 'agent' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className="text-xs font-medium">{msg.sender}</span>
                      <span className="text-xs opacity-75">{msg.timestamp}</span>
                    </div>
                    {msg.type === 'user' ? (
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    ) : (
                      <div className="text-sm">
                        <MarkdownRenderer content={msg.message} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Streaming message */}
              {streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-3 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">AML Analyst</span>
                      <span className="text-xs opacity-75">typing...</span>
                    </div>
                    <div className="text-sm">
                      <MarkdownRenderer content={streamingMessage} />
                      <span className="animate-pulse">▋</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AML agents about patterns, risks, compliance..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AML & Mule Account Detection</h2>
              <p className="text-gray-600">Multi-agent system for anti-money laundering and suspicious activity detection</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center justify-center p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                title={isMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
              >
                {isMonitoring ? <FaPause className="h-4 w-4" /> : <FaPlay className="h-4 w-4" />}
              </button>
              <button className="flex items-center justify-center p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100" title="Settings">
                <FaCog className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '■' },
              { key: 'activity', label: 'Live Activity & Chat', icon: '●' },
              { key: 'network', label: 'Network Graph', icon: '◯' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-gray-600 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 overflow-hidden">
        <div className="h-full">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'activity' && renderActivityAndChat()}
          {activeTab === 'network' && renderNetworkGraph()}
        </div>
      </div>

      {/* All Modals */}
       {/* Transaction Details Modal */}
       {selectedTransaction && (
         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details & Tracing</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Transaction Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Transaction ID:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Amount:</span>
                      <p className="font-medium text-gray-900">${selectedTransaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">From Account:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.fromAccount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">To Account:</span>
                      <p className="font-medium text-gray-900">{selectedTransaction.toAccount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Timestamp:</span>
                      <p className="text-gray-700">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Risk Assessment</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Risk Score:</span>
                      <p className={`font-medium ${getRiskColor(selectedTransaction.riskScore)}`}>
                        {selectedTransaction.riskScore}/100
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <p className="font-medium text-gray-900">
                        {selectedTransaction.flagged ? 'Flagged' : 'Normal'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Pattern Type:</span>
                      <p className="text-gray-700">
                        {selectedTransaction.amount > 10000 ? 'Large Transfer' : 
                         selectedTransaction.amount % 1000 === 0 ? 'Round Amount' : 'Standard'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Transaction Trace & Flow</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Transaction Initiated</p>
                          <p className="text-xs text-gray-600">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Source: {selectedTransaction.fromAccount}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Risk Analysis Started</p>
                          <p className="text-xs text-gray-600">{new Date(Date.now() - 2000).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Agent: ML Detection Agent</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Pattern Matching</p>
                          <p className="text-xs text-gray-600">{new Date(Date.now() - 1500).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Matched: {selectedTransaction.amount > 10000 ? '2 suspicious patterns' : '1 pattern'}</p>
                        </div>
                      </div>

                      {selectedTransaction.flagged && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Transaction Flagged</p>
                            <p className="text-xs text-gray-600">{new Date(Date.now() - 500).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Reason: High risk score ({selectedTransaction.riskScore})</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">AI Risk Analysis & Reasoning</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="border-l-4 border-l-gray-400 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">ML Detection Agent Analysis:</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        {selectedTransaction.amount > 10000 
                          ? `This transaction triggers our large amount threshold (over $10,000). The ML model detected unusual velocity patterns in the sending account, with ${Math.floor(Math.random() * 5) + 3} similar transactions in the past 24 hours.`
                          : selectedTransaction.amount % 1000 === 0
                          ? `Round number transactions ($${selectedTransaction.amount.toLocaleString()}) often indicate structuring behavior. The account shows a pattern of consistent round amounts, suggesting potential layering techniques.`
                          : `Standard transaction amount, but flagged due to network analysis. The receiving account has connections to ${Math.floor(Math.random() * 3) + 2} previously flagged entities.`
                        }
                      </p>
                      <div className="bg-white rounded p-3 mt-2">
                        <p className="text-xs text-gray-600 mb-1"><strong>Risk Factors Identified:</strong></p>
                        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                          {selectedTransaction.amount > 10000 && <li>Transaction amount exceeds reporting threshold</li>}
                          {selectedTransaction.amount % 1000 === 0 && <li>Round number pattern detected (potential structuring)</li>}
                          <li>Account velocity anomaly: {Math.floor(Math.random() * 200) + 50}% above baseline</li>
                          <li>Geographic risk: Cross-border to high-risk jurisdiction</li>
                          <li>Network analysis: Connected to {Math.floor(Math.random() * 3) + 1} flagged entities</li>
                          {selectedTransaction.riskScore > 80 && <li>ML confidence score: {(Math.random() * 0.15 + 0.85).toFixed(3)} (high confidence)</li>}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-l-gray-600 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">Analyst Agent Recommendation:</h5>
                      <p className="text-sm text-gray-700">
                        {selectedTransaction.riskScore > 80 
                          ? "IMMEDIATE REVIEW REQUIRED: High probability of suspicious activity. Recommend filing SAR within 24 hours and consider account restrictions pending investigation."
                          : selectedTransaction.riskScore > 60
                          ? "ENHANCED MONITORING: Moderate risk detected. Continue monitoring for 30 days and flag any additional unusual patterns."
                          : "STANDARD PROCESSING: Low risk transaction. File for routine compliance review cycle."
                        }
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Confidence Level:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${selectedTransaction.riskScore > 80 ? 'bg-gray-700' : selectedTransaction.riskScore > 60 ? 'bg-gray-500' : 'bg-gray-400'}`}
                            style={{ width: `${Math.min(selectedTransaction.riskScore + 10, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{Math.min(selectedTransaction.riskScore + 10, 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Related Transactions & Network</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Related Accounts:</span>
                        <p className="font-medium text-gray-900">{Math.floor(Math.random() * 5) + 2}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Network Depth:</span>
                        <p className="font-medium text-gray-900">{Math.floor(Math.random() * 3) + 2} layers</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <span className="text-sm text-gray-600">Similar Patterns:</span>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-gray-700">• {Math.floor(Math.random() * 8) + 3} similar amounts this week</div>
                        <div className="text-xs text-gray-700">• {Math.floor(Math.random() * 4) + 1} shared IP addresses</div>
                        <div className="text-xs text-gray-700">• {Math.floor(Math.random() * 6) + 2} timing correlations</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors text-sm">
                  Generate SAR
                </button>
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors text-sm">
                  Flag Account
                </button>
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors text-sm">
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Agent Details Modal */}
       {selectedAgent && (
         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agent Details</h3>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Agent Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">AI</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{selectedAgent.name}</h5>
                      <p className="text-sm text-gray-600 capitalize">{selectedAgent.type} Agent</p>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <p className="font-medium text-gray-900 capitalize">{selectedAgent.status}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Specialization:</span>
                      <p className="font-medium text-gray-900">{selectedAgent.specialization}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Processed Count:</span>
                      <p className="font-medium text-gray-900">{selectedAgent.processedCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Last Activity:</span>
                      <p className="font-medium text-gray-900">{selectedAgent.lastActivity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Skills & Capabilities</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full text-sm hover:bg-gray-50 transition-colors">
                  View Logs
                </button>
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full text-sm hover:bg-gray-50 transition-colors">
                  Configure
                </button>
                <button className="px-3 py-1 bg-white text-black border border-black rounded-full text-sm hover:bg-gray-50 transition-colors">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Add Agent Modal */}
       {showAddAgentModal && (
         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add External AML Agent</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available External Agents</h4>
                <div className="space-y-3">
                  {[
                    {
                      name: 'FINCEN Compliance Agent',
                      type: 'analyst',
                      specialization: 'BSA/AML Regulatory Compliance',
                      skills: ['SAR Filing', 'CTR Processing', 'Regulatory Reporting'],
                      provider: 'FinCEN API',
                      status: 'Available'
                    },
                    {
                      name: 'SWIFT Network Monitor',
                      type: 'detector',
                      specialization: 'Cross-border Transaction Analysis',
                      skills: ['SWIFT Message Analysis', 'Correspondent Banking', 'Trade Finance'],
                      provider: 'SWIFT Alliance',
                      status: 'Available'
                    },
                    {
                      name: 'OFAC Sanctions Screener',
                      type: 'profiler',
                      specialization: 'Sanctions Screening & PEP Detection',
                      skills: ['SDN List Screening', 'PEP Identification', 'Watchlist Monitoring'],
                      provider: 'OFAC API',
                      status: 'Available'
                    },
                    {
                      name: 'Blockchain Analytics Agent',
                      type: 'detector',
                      specialization: 'Cryptocurrency Transaction Tracing',
                      skills: ['Bitcoin Tracing', 'Ethereum Analysis', 'DeFi Monitoring'],
                      provider: 'Chainalysis',
                      status: 'Premium'
                    }
                  ].map((agent, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        const newAgent = {
                          id: `agent_${Date.now()}`,
                          name: agent.name,
                          type: agent.type as 'ingest' | 'profiler' | 'detector' | 'analyst',
                          status: 'idle' as const,
                          lastActivity: 'Just connected',
                          processedCount: 0,
                          skills: agent.skills,
                          specialization: agent.specialization
                        };
                        setAgents(prev => [...prev, newAgent]);
                        setShowAddAgentModal(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">AI</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{agent.name}</h5>
                            <p className="text-sm text-gray-600">{agent.specialization}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          agent.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {agent.skills.slice(0, 2).map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {agent.skills.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{agent.skills.length - 2} more
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{agent.provider}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom MCP Configuration */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-3">Custom MCP Agent Configuration</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                      <input
                        type="text"
                        value={newAgentForm.name}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="e.g., Custom Risk Agent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
                      <select
                        value={newAgentForm.type}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="ingest">Ingest Agent</option>
                        <option value="profiler">Profiler Agent</option>
                        <option value="detector">Detector Agent</option>
                        <option value="analyst">Analyst Agent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MCP Endpoint URL</label>
                    <input
                      type="url"
                      value={newAgentForm.mcpEndpoint}
                      onChange={(e) => setNewAgentForm(prev => ({ ...prev, mcpEndpoint: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="https://api.example.com/mcp/v1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={newAgentForm.apiKey}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                      <select
                        value={newAgentForm.provider}
                        onChange={(e) => setNewAgentForm(prev => ({ ...prev, provider: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="OpenAI">OpenAI</option>
                        <option value="Anthropic">Anthropic</option>
                        <option value="Custom">Custom Provider</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={newAgentForm.specialization}
                      onChange={(e) => setNewAgentForm(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="e.g., Real-time fraud detection"
                    />
                  </div>

                   <div className="flex space-x-3 pt-4">
                     <button
                       onClick={() => {
                         if (newAgentForm.name && newAgentForm.mcpEndpoint) {
                           const newAgent = {
                             id: `agent_${Date.now()}`,
                             name: newAgentForm.name,
                             type: newAgentForm.type,
                             status: 'idle' as const,
                             lastActivity: 'Just configured',
                             processedCount: 0,
                             skills: ['MCP Integration', 'Custom Analysis'],
                             specialization: newAgentForm.specialization || 'Custom AML Agent'
                           };
                           setAgents(prev => [...prev, newAgent]);
                           setShowAddAgentModal(false);
                           setNewAgentForm({
                             name: '',
                             type: 'detector' as const,
                             mcpEndpoint: '',
                             apiKey: '',
                             specialization: '',
                             skills: [],
                             provider: 'OpenAI'
                           });
                         }
                       }}
                       className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors font-medium"
                       disabled={!newAgentForm.name || !newAgentForm.mcpEndpoint}
                     >
                       Connect
                     </button>
                     <button
                       onClick={() => {
                         // Test connection logic would go here
                         alert('Testing MCP connection... (Demo mode)');
                       }}
                       className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors font-medium"
                       disabled={!newAgentForm.mcpEndpoint}
                     >
                       Test
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Activity Detail Modal */}
       {selectedActivity && (
         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Agent Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Agent:</span>
                        <span className="ml-2 font-medium">{selectedActivity.agentName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium">{selectedActivity.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium">{selectedActivity.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <span className="ml-2 font-medium">{selectedActivity.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Activity Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Action:</span>
                        <p className="font-medium text-gray-900">{selectedActivity.action}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Priority Level:</span>
                        <p className="font-medium text-gray-900">{selectedActivity.requiresHumanReview ? 'High' : 'Standard'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Description:</span>
                        <p className="font-medium text-gray-900 mt-1">{selectedActivity.description}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Timestamp:</span>
                        <p className="font-medium text-gray-900">{new Date(selectedActivity.timestamp).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Processing Time:</span>
                        <p className="font-medium text-gray-900">{Math.floor(Math.random() * 30) + 5}s</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Related Transaction:</span>
                        <button 
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer bg-transparent border-none p-0 ml-2"
                          onClick={() => {
                            // Find and select the related transaction
                            const relatedTxn = transactions.find(t => t.id === selectedActivity.relatedTransactionId) || transactions[Math.floor(Math.random() * transactions.length)];
                            setSelectedTransaction(relatedTxn);
                            setSelectedActivity(null);
                          }}
                        >
                          {selectedActivity.relatedTransactionId || `txn_${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Impact Assessment:</span>
                        <p className="font-medium text-gray-900 mt-1">
                          {selectedActivity.requiresHumanReview 
                            ? 'Critical: Potential regulatory violation detected. Immediate review required to prevent compliance breach.'
                            : 'Standard: Routine processing completed within normal parameters. No immediate action required.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedActivity.requiresHumanReview && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Human Review Required</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 mb-3">
                        This activity requires human oversight before proceeding. Please review the details and take appropriate action.
                      </p>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-white text-green-700 border border-green-700 rounded-full hover:bg-green-50 transition-colors text-sm font-medium">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-white text-red-700 border border-red-700 rounded-full hover:bg-red-50 transition-colors text-sm font-medium">
                          Reject
                        </button>
                        <button className="px-3 py-1 bg-white text-gray-700 border border-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium">
                          Request More Info
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cluster Analysis Modal */}
      {selectedCluster && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Cluster Analysis Details</h3>
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className={`${selectedCluster.color} border-2 rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold">{selectedCluster.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCluster.risk === 'Critical' ? 'bg-red-100 text-red-700' :
                      selectedCluster.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedCluster.risk} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="opacity-80">Accounts Involved:</span>
                      <span className="ml-2 font-bold text-lg">{selectedCluster.accounts}</span>
                    </div>
                    <div>
                      <span className="opacity-80">Pattern Type:</span>
                      <span className="ml-2 font-medium">{selectedCluster.pattern}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Risk Assessment & Reasoning</h5>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedCluster.reasoning}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Cluster Metrics</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transaction Volume:</span>
                      <span className="font-medium">${(Math.random() * 5000000 + 1000000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Transaction Size:</span>
                      <span className="font-medium">${(Math.random() * 50000 + 10000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Period:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 30) + 7} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Geographic Spread:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 5) + 2} countries</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Recommended Actions</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Enhanced due diligence on all cluster accounts</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Review transaction patterns for last 90 days</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Cross-reference with sanctions and PEP lists</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Consider filing Suspicious Activity Report (SAR)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-white text-red-700 border border-red-700 rounded-full hover:bg-red-50 transition-colors font-medium">
                  Flag All Accounts
                </button>
                <button className="px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-full hover:bg-blue-50 transition-colors font-medium">
                  Generate SAR
                </button>
                <button className="px-4 py-2 bg-white text-green-700 border border-green-700 rounded-full hover:bg-green-50 transition-colors font-medium">
                  Enhanced Monitoring
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 border border-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction Flow Pattern Modal */}
      {selectedTransactionFlow && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Flow Pattern Analysis</h3>
              <button
                onClick={() => setSelectedTransactionFlow(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className={`border-2 rounded-lg p-4 mb-4 ${
                  selectedTransactionFlow.riskLevel === 'Critical' ? 'bg-red-50 border-red-300' :
                  selectedTransactionFlow.riskLevel === 'High' ? 'bg-orange-50 border-orange-300' :
                  'bg-yellow-50 border-yellow-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{selectedTransactionFlow.pattern}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTransactionFlow.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                      selectedTransactionFlow.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedTransactionFlow.riskLevel} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Instances Detected:</span>
                      <span className="ml-2 font-bold text-lg">{selectedTransactionFlow.count}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="ml-2 font-bold text-lg">{selectedTransactionFlow.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Accounts Involved:</span>
                      <span className="ml-2 font-bold text-lg">{selectedTransactionFlow.detectedAccounts.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Pattern Analysis & Risk Assessment</h5>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTransactionFlow.reasoning}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Detected Accounts</h5>
                  <div className="space-y-2">
                    {selectedTransactionFlow.detectedAccounts.map((account: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-mono text-sm">{account}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Risk:</span>
                          <span className={`text-xs font-medium ${
                            Math.random() > 0.5 ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {Math.floor(Math.random() * 20) + 75}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Pattern Metrics</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detection Confidence:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 10) + 85}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Transaction Size:</span>
                      <span className="font-medium">${(Math.random() * 100000 + 50000).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Window:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 14) + 3} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Geographic Spread:</span>
                      <span className="font-medium">{Math.floor(Math.random() * 4) + 2} jurisdictions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Velocity Score:</span>
                      <span className="font-medium text-orange-600">{Math.floor(Math.random() * 30) + 60}/100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-white text-red-700 border border-red-700 rounded-full hover:bg-red-50 transition-colors font-medium">
                  Flag All Accounts
                </button>
                <button className="px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-full hover:bg-blue-50 transition-colors font-medium">
                  Generate Investigation Report
                </button>
                <button className="px-4 py-2 bg-white text-green-700 border border-green-700 rounded-full hover:bg-green-50 transition-colors font-medium">
                  Enhanced Monitoring
                </button>
                <button className="px-4 py-2 bg-white text-purple-700 border border-purple-700 rounded-full hover:bg-purple-50 transition-colors font-medium">
                  Export Pattern Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AMLInterface;
