'use client';

import React, { useState, useEffect } from 'react';
import { FaRobot, FaProjectDiagram, FaCircle, FaChartLine, FaUsers, FaExchangeAlt, FaClipboardList, FaSearch, FaTimes, FaDownload, FaPlay, FaPause, FaCog, FaEye } from 'react-icons/fa';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity' | 'chat'>('dashboard');
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    type: 'user' | 'agent';
    agentType?: string;
  }>>([]);
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
          status: 'idle',
          lastActivity: '5 min ago',
          processedCount: 89,
          skills: ['Regulatory Compliance', 'Report Generation', 'Case Analysis'],
          specialization: 'Suspicious Activity Report generation and compliance'
        }
      ];
    };

    const generateActivityFeed = (): ActivityFeedItem[] => {
      const activities: ActivityFeedItem[] = [];
      const agentNames = ['Transaction Ingest Agent', 'Account Profiler Agent', 'ML Detection Agent', 'SAR Analyst Agent'];
      const actionTypes = ['processing', 'analysis', 'detection', 'collaboration', 'review_required', 'completed'];
      
      for (let i = 0; i < 20; i++) {
        const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
        const type = actionTypes[Math.floor(Math.random() * actionTypes.length)] as any;
        const activity: ActivityFeedItem = {
          id: `activity_${i.toString().padStart(3, '0')}`,
          agentId: `agent_${Math.floor(Math.random() * 4) + 1}`,
          agentName,
          type,
          action: `Processing ${Math.floor(Math.random() * 50) + 10} transactions`,
          description: `Analyzing transaction patterns for suspicious activity detection`,
          timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.7 ? 'pending_review' : 'live',
          requiresHumanReview: Math.random() > 0.8,
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
        {/* Risk Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="space-y-4">
            {[
              { 
                label: 'Critical Risk', 
                range: '90-100', 
                count: accounts.filter(a => a.riskScore >= 90).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 90).length / accounts.length) * 100),
                avgAmount: '$847K',
                flagged: 4,
                color: 'bg-red-500',
                bgColor: 'bg-red-50',
                textColor: 'text-red-600'
              },
              { 
                label: 'High Risk', 
                range: '70-89', 
                count: accounts.filter(a => a.riskScore >= 70 && a.riskScore < 90).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 70 && a.riskScore < 90).length / accounts.length) * 100),
                avgAmount: '$523K',
                flagged: 16,
                color: 'bg-orange-500',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-600'
              },
              { 
                label: 'Medium Risk', 
                range: '40-69', 
                count: accounts.filter(a => a.riskScore >= 40 && a.riskScore < 70).length, 
                percentage: Math.round((accounts.filter(a => a.riskScore >= 40 && a.riskScore < 70).length / accounts.length) * 100),
                avgAmount: '$234K',
                flagged: 18,
                color: 'bg-green-500',
                bgColor: 'bg-green-50',
                textColor: 'text-green-600'
              }
            ].map((risk, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{risk.label}</span>
                    <span className="text-xs text-gray-500">({risk.range})</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${risk.bgColor} ${risk.textColor}`}>
                    {risk.count} accounts
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                  <div className="text-center">
                    <div className="text-gray-500">Percentage</div>
                    <div className="font-medium text-gray-900">{risk.percentage}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Avg Amount</div>
                    <div className="font-medium text-gray-900">{risk.avgAmount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500">Flagged</div>
                    <div className="font-medium text-gray-900">{risk.flagged}</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${risk.color}`}
                    style={{width: `${risk.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Flow Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Patterns</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Large Transfers (over $10K)</span>
                <span className="text-sm font-medium text-gray-900">{transactions.filter(t => t.amount > 10000).length}</span>
              </div>
              <div className="text-xs text-gray-500">Avg: ${(transactions.filter(t => t.amount > 10000).reduce((sum, t) => sum + t.amount, 0) / Math.max(transactions.filter(t => t.amount > 10000).length, 1) / 1000).toFixed(0)}K</div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Cross-Border</span>
                <span className="text-sm font-medium text-gray-900">{Math.floor(transactions.length * 0.23)}</span>
              </div>
              <div className="text-xs text-gray-500">23% of all transactions</div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Rapid Sequences</span>
                <span className="text-sm font-medium text-gray-900">{Math.floor(transactions.length * 0.08)}</span>
              </div>
              <div className="text-xs text-gray-500">Multiple txns under 5min</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Round Numbers</span>
                <span className="text-sm font-medium text-gray-900">{transactions.filter(t => t.amount % 1000 === 0).length}</span>
              </div>
              <div className="text-xs text-gray-500">Potential structuring</div>
            </div>
          </div>
        </div>

        {/* Geographic Risk Analysis */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Risk Analysis</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Live Data</span>
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
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Agent Status</h3>
            <p className="text-sm text-gray-600">Multi-agent system for AML detection</p>
          </div>
          <button 
            onClick={() => setShowAddAgentModal(true)}
            className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <span className="text-lg">+</span>
          </button>
        </div>
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

  const renderActivityFeed = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live AI Activity Feed</h3>
            <p className="text-sm text-gray-600">Real-time agent collaboration and background processing</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {activityFeed.map((activity) => (
            <div 
              key={activity.id} 
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                activity.requiresHumanReview ? 'border-l-4 border-l-yellow-400' : ''
              }`}
              onClick={() => setSelectedActivity(activity)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">AI</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.agentName}</p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / (1000 * 60))} min ago
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-800 mt-1">{activity.action}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  
                  {activity.confidence && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Confidence: {activity.confidence}%</span>
                      {activity.relatedAccountId && <span>Account: {activity.relatedAccountId}</span>}
                    </div>
                  )}
                  
                  {activity.requiresHumanReview && (
                    <div className="mt-2 flex space-x-2">
                      <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Queue</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Reviews</span>
              <span className="text-lg font-bold text-gray-900">
                {activityFeed.filter(a => a.requiresHumanReview && a.status === 'pending_review').length}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {activityFeed.filter(a => a.requiresHumanReview && a.status === 'pending_review').length} pending
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Analytics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Automation Rate</span>
              <span className="text-lg font-bold text-gray-900">
                {Math.round((activityFeed.filter(a => !a.requiresHumanReview).length / activityFeed.length) * 100)}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {activityFeed.filter(a => a.status === 'live').length} active processes
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Collaboration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Handoffs Today</span>
              <span className="text-lg font-bold text-gray-900">
                {activityFeed.filter(a => a.type === 'collaboration').length}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Cross-agent coordination
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatInterface = () => {
    const handleSendMessage = () => {
      if (!chatInput.trim()) return;

      const userMessage = {
        id: `msg_${Date.now()}`,
        sender: 'You',
        message: chatInput,
        timestamp: new Date().toLocaleTimeString(),
        type: 'user' as const
      };

      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');

      // Simulate agent responses
      setTimeout(() => {
        const responses = [
          {
            agent: 'ML Detection Agent',
            type: 'detector',
            message: generateAMLResponse(chatInput, 'detector')
          },
          {
            agent: 'Risk Analyst Agent', 
            type: 'analyst',
            message: generateAMLResponse(chatInput, 'analyst')
          }
        ];

        responses.forEach((response, index) => {
          setTimeout(() => {
            const agentMessage = {
              id: `msg_${Date.now()}_${index}`,
              sender: response.agent,
              message: response.message,
              timestamp: new Date().toLocaleTimeString(),
              type: 'agent' as const,
              agentType: response.type
            };
            setChatMessages(prev => [...prev, agentMessage]);
          }, (index + 1) * 1500);
        });
      }, 1000);
    };

    const generateAMLResponse = (input: string, agentType: string) => {
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('risk') || lowerInput.includes('score')) {
        return agentType === 'detector' 
          ? `Based on current ML models, I have analyzed ${transactions.filter(t => t.flagged).length} high-risk transactions today. The average risk score is ${(transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length).toFixed(1)}/100.`
          : `From a risk analysis perspective, we have ${accounts.filter(a => a.riskScore > 80).length} accounts requiring immediate attention. I recommend prioritizing accounts with scores above 85 for manual review.`;
      }
      
      if (lowerInput.includes('mule') || lowerInput.includes('account')) {
        return agentType === 'detector'
          ? `I have identified ${Math.floor(Math.random() * 5) + 8} potential mule accounts based on transaction velocity and network analysis. These accounts show rapid fund movement patterns typical of money laundering operations.`
          : `The mule account network analysis reveals ${Math.floor(Math.random() * 3) + 2} distinct clusters. I suggest focusing on the central hub accounts that facilitate the majority of suspicious transfers.`;
      }
      
      if (lowerInput.includes('pattern') || lowerInput.includes('behavior')) {
        return agentType === 'detector'
          ? `Current pattern detection shows: ${Math.floor(Math.random() * 20) + 15}% increase in structuring behaviors, ${Math.floor(Math.random() * 10) + 5} round-amount transactions, and ${Math.floor(Math.random() * 8) + 12} velocity anomalies this week.`
          : `Behavioral analysis indicates coordinated activity across ${Math.floor(Math.random() * 4) + 3} account groups. The timing patterns suggest automated or scripted transactions, which is a strong indicator of mule operations.`;
      }

      if (lowerInput.includes('sar') || lowerInput.includes('report')) {
        return agentType === 'analyst'
          ? `I have prepared ${Math.floor(Math.random() * 3) + 2} draft SARs for review. The cases involve high-value structuring ($${Math.floor(Math.random() * 50000) + 25000}), suspected trade-based laundering, and a multi-account layering scheme.`
          : `SAR filing recommendations: ${Math.floor(Math.random() * 2) + 1} immediate filings required, ${Math.floor(Math.random() * 3) + 2} cases need additional evidence gathering, and ${Math.floor(Math.random() * 4) + 3} accounts should continue enhanced monitoring.`;
      }

      // Default responses
      const defaultResponses = {
        detector: [
          `I am continuously monitoring ${transactions.length} transactions and have flagged ${transactions.filter(t => t.flagged).length} for suspicious activity.`,
          `My ML models are detecting anomalies in real-time. Current detection accuracy is running at ${(Math.random() * 5 + 94).toFixed(1)}%.`,
          `I have identified ${Math.floor(Math.random() * 10) + 15} high-risk transaction patterns in the last 24 hours requiring investigation.`
        ],
        analyst: [
          `I am analyzing the flagged cases and preparing compliance reports. ${Math.floor(Math.random() * 3) + 2} cases require immediate SAR filing.`,
          `Based on my analysis, we have ${Math.floor(Math.random() * 5) + 3} accounts showing clear mule behavior patterns that need regulatory reporting.`,
          `I recommend escalating ${Math.floor(Math.random() * 4) + 2} cases to law enforcement due to the sophistication of the layering schemes detected.`
        ]
      };
      
      const responses = defaultResponses[agentType as keyof typeof defaultResponses];
      return responses[Math.floor(Math.random() * responses.length)];
    };

    const quickQuestions = [
      "What are the current high-risk accounts?",
      "Show me today's suspicious transaction patterns", 
      "Which mule accounts need immediate attention?",
      "Generate SAR summary for flagged cases",
      "What's the risk distribution across accounts?",
      "Analyze cross-border transaction anomalies"
    ];

    return (
      <div className="space-y-6">
        {/* Quick Questions */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick AML Inquiries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setChatInput(question)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <span className="text-sm text-gray-700">{question}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white border border-gray-200 rounded-lg flex flex-col h-96">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Multi-Agent AML Chat</h3>
            <p className="text-sm text-gray-600">Collaborate with AI agents for AML investigation</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Start a conversation with the AML agents</p>
                <p className="text-sm mt-2">Ask about risk patterns, suspicious accounts, or compliance requirements</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.type === 'agent' && (
                        <div className="h-4 w-4 bg-black rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">AI</span>
                        </div>
                      )}
                      <span className="text-xs font-medium">{msg.sender}</span>
                      <span className="text-xs opacity-75">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about AML patterns, risk analysis, or compliance..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'activity', label: 'Live Activity', icon: '🔄' },
              { key: 'chat', label: 'Chat', icon: '💬' }
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
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'activity' && renderActivityFeed()}
        {activeTab === 'chat' && renderChatInterface()}
      </div>

      {/* All Modals */}
      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 flex items-center justify-center p-4 z-50">
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
                <button className="px-4 py-2 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors">
                  Generate SAR
                </button>
                <button className="px-4 py-2 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors">
                  Flag Account
                </button>
                <button className="px-4 py-2 bg-white text-black border border-black rounded-full hover:bg-gray-50 transition-colors">
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 flex items-center justify-center p-4 z-50">
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
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 flex items-center justify-center p-4 z-50">
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
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      disabled={!newAgentForm.name || !newAgentForm.mcpEndpoint}
                    >
                      Connect Agent
                    </button>
                    <button
                      onClick={() => {
                        // Test connection logic would go here
                        alert('Testing MCP connection... (Demo mode)');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      disabled={!newAgentForm.mcpEndpoint}
                    >
                      Test Connection
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
        <div className="fixed inset-0 backdrop-blur-md bg-white bg-opacity-20 flex items-center justify-center p-4 z-50">
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
                  <div className="space-y-2">
                    <p><span className="font-medium">Action:</span> {selectedActivity.action}</p>
                    <p><span className="font-medium">Description:</span> {selectedActivity.description}</p>
                    <p><span className="font-medium">Timestamp:</span> {new Date(selectedActivity.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {selectedActivity.requiresHumanReview && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Human Review Required</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 mb-3">
                        This activity requires human oversight before proceeding. Please review the details and take appropriate action.
                      </p>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium">
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium">
                          Reject
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium">
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
    </div>
  );
};

export default AMLInterface;

