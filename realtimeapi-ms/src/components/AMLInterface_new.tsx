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
      
      const defaultResponses = {
        detector: [
          `I am continuously monitoring ${transactions.length} transactions and have flagged ${transactions.filter(t => t.flagged).length} for suspicious activity.`,
          `My ML models are detecting anomalies in real-time. Current detection accuracy is running at ${(Math.random() * 5 + 94).toFixed(1)}%.`
        ],
        analyst: [
          `I am analyzing the flagged cases and preparing compliance reports. ${Math.floor(Math.random() * 3) + 2} cases require immediate SAR filing.`,
          `Based on my analysis, we have ${Math.floor(Math.random() * 5) + 3} accounts showing clear mule behavior patterns.`
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
                  <h4 className="font-medium text-gray-900 mb-3">AI Risk Analysis</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="border-l-4 border-l-gray-400 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">ML Detection:</h5>
                      <p className="text-sm text-gray-700">
                        {selectedTransaction.amount > 10000 
                          ? `Large amount threshold triggered. Velocity patterns detected with ${Math.floor(Math.random() * 5) + 3} similar transactions.`
                          : `Standard processing with network analysis flagging ${Math.floor(Math.random() * 3) + 2} connected entities.`
                        }
                      </p>
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
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {agent.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AMLInterface;

