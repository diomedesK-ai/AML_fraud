"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, 
  FaChartLine, 
  FaShieldAlt, 
  FaHeartbeat,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaWhatsapp,
  FaSpinner,
  FaArrowLeft,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaPaperPlane,
  FaUniversity,
  FaRobot,
  FaCircle,
  FaTimes,
  FaPlay,
  FaCog,
  FaHistory,
  FaSearch,
  FaTag
} from 'react-icons/fa';

// Segment data types
interface InsuranceSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    ageRange: { min: number; max: number };
    salaryRange: { min: number; max: number };
    dependents: { min: number; max: number };
    riskTolerance: { min: number; max: number };
    segment: string[];
    occupation: string[];
  };
  color: string;
  priority: number;
}

// Customer data types
interface Customer {
  id: string;
  name: string;
  segment: 'Premium' | 'Standard' | 'Basic';
  insuranceSegment?: string; // ID of the insurance segment
  propensityScore: number;
  age: number;
  income: number;
  phone: string;
  email: string;
  lastInteraction: string;
  needs: {
    life: number;
    health: number;
    critical: number;
    education: number;
  };
  demographics: {
    maritalStatus: string;
    dependents: number;
    occupation: string;
  };
  profile: {
    nationality: string;
    occupationRisk: 'Low' | 'Medium' | 'High';
    financialSophistication: 'Basic' | 'Intermediate' | 'Advanced';
    lifeStage: 'Early Career' | 'Family Building' | 'Peak Earning' | 'Pre-Retirement' | 'Retirement';
  };
}

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    name: 'Sarah Chen',
    segment: 'Premium',
    insuranceSegment: 'family_protector',
    propensityScore: 85,
    age: 34,
    income: 120000,
    phone: '+65 9123 4567',
    email: 'sarah.chen@email.com',
    lastInteraction: '2 days ago',
    needs: { life: 75, health: 50, critical: 65, education: 80 },
    demographics: { maritalStatus: 'Married', dependents: 2, occupation: 'Software Engineer' },
    profile: { nationality: 'Singapore', occupationRisk: 'Low', financialSophistication: 'Advanced', lifeStage: 'Family Building' }
  },
  {
    id: 'cust_002',
    name: 'Michael Rodriguez',
    segment: 'Standard',
    propensityScore: 72,
    age: 28,
    income: 85000,
    phone: '+65 8765 4321',
    email: 'michael.r@email.com',
    lastInteraction: '1 week ago',
    needs: { life: 60, health: 85, critical: 40, education: 30 },
    demographics: { maritalStatus: 'Single', dependents: 0, occupation: 'Marketing Manager' },
    profile: { nationality: 'Mexico', occupationRisk: 'Low', financialSophistication: 'Intermediate', lifeStage: 'Early Career' }
  },
  {
    id: 'cust_003',
    name: 'Jennifer Liu',
    segment: 'Premium',
    insuranceSegment: 'wealth_builder',
    propensityScore: 90,
    age: 42,
    income: 150000,
    phone: '+65 9876 5432',
    email: 'jennifer.liu@email.com',
    lastInteraction: '3 days ago',
    needs: { life: 95, health: 70, critical: 85, education: 90 },
    demographics: { maritalStatus: 'Married', dependents: 3, occupation: 'Investment Banker' },
    profile: { nationality: 'China', occupationRisk: 'Medium', financialSophistication: 'Advanced', lifeStage: 'Peak Earning' }
  },
  {
    id: 'cust_004',
    name: 'David Kumar',
    segment: 'Standard',
    propensityScore: 68,
    age: 31,
    income: 75000,
    phone: '+65 8888 9999',
    email: 'david.kumar@email.com',
    lastInteraction: '5 days ago',
    needs: { life: 55, health: 60, critical: 45, education: 70 },
    demographics: { maritalStatus: 'Married', dependents: 1, occupation: 'Teacher' },
    profile: { nationality: 'India', occupationRisk: 'Low', financialSophistication: 'Basic', lifeStage: 'Family Building' }
  },
  {
    id: 'cust_005',
    name: 'Amanda Wong',
    segment: 'Basic',
    propensityScore: 45,
    age: 26,
    income: 45000,
    phone: '+65 7777 8888',
    email: 'amanda.wong@email.com',
    lastInteraction: '2 weeks ago',
    needs: { life: 30, health: 40, critical: 25, education: 35 },
    demographics: { maritalStatus: 'Single', dependents: 0, occupation: 'Sales Associate' },
    profile: { nationality: 'Malaysia', occupationRisk: 'Low', financialSophistication: 'Basic', lifeStage: 'Early Career' }
  },
  {
    id: 'cust_006',
    name: 'James Wilson',
    segment: 'Premium',
    insuranceSegment: 'health_conscious',
    propensityScore: 88,
    age: 52,
    income: 140000,
    phone: '+65 7777 3333',
    email: 'james.wilson@email.com',
    lastInteraction: '1 day ago',
    needs: { life: 80, health: 85, critical: 75, education: 70 },
    demographics: { maritalStatus: 'Married', dependents: 2, occupation: 'Financial Advisor' },
    profile: { nationality: 'American', occupationRisk: 'Low', financialSophistication: 'Advanced', lifeStage: 'Peak Earning' }
  },
  {
    id: 'cust_007',
    name: 'Lisa Thompson',
    segment: 'Standard',
    insuranceSegment: 'family_protector',
    propensityScore: 76,
    age: 39,
    income: 95000,
    phone: '+65 8888 2222',
    email: 'lisa.thompson@email.com',
    lastInteraction: '4 days ago',
    needs: { life: 75, health: 70, critical: 65, education: 80 },
    demographics: { maritalStatus: 'Divorced', dependents: 2, occupation: 'HR Manager' },
    profile: { nationality: 'Australia', occupationRisk: 'Low', financialSophistication: 'Intermediate', lifeStage: 'Family Building' }
  },
  {
    id: 'cust_008',
    name: 'James Wilson',
    segment: 'Premium',
    propensityScore: 88,
    age: 52,
    income: 140000,
    phone: '+65 7777 3333',
    email: 'james.wilson@email.com',
    lastInteraction: '1 week ago',
    needs: { life: 85, health: 90, critical: 75, education: 70 },
    demographics: { maritalStatus: 'Married', dependents: 2, occupation: 'Doctor' },
    profile: { nationality: 'UK', occupationRisk: 'High', financialSophistication: 'Advanced', lifeStage: 'Pre-Retirement' }
  },
  {
    id: 'cust_009',
    name: 'Emily Davis',
    segment: 'Premium',
    propensityScore: 82,
    age: 41,
    income: 110000,
    phone: '+65 4444 6666',
    email: 'emily.davis@email.com',
    lastInteraction: '3 days ago',
    needs: { life: 80, health: 75, critical: 70, education: 85 },
    demographics: { maritalStatus: 'Married', dependents: 3, occupation: 'Architect' },
    profile: { nationality: 'Canada', occupationRisk: 'Low', financialSophistication: 'Intermediate', lifeStage: 'Peak Earning' }
  }
];

interface UnderwritingResult {
  status: 'approved' | 'declined' | 'review';
  reason: string;
  premium?: number;
  conditions?: string[];
}

// Chat message types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  assistant?: 'insurance' | 'bank';
}

interface Assistant {
  id: 'insurance' | 'bank';
  name: string;
  title: string;
  icon: React.ReactNode;
  isOnline: boolean;
  color: string;
}

export default function BancassuranceInterface() {
  const [currentView, setCurrentView] = useState<'list' | 'insights' | 'underwriting'>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [isUnderwriting, setIsUnderwriting] = useState(false);
  const [underwritingResult, setUnderwritingResult] = useState<UnderwritingResult | null>(null);
  
  // Function to calculate the highest scoring product for a customer
  const getHighestScoringProduct = (customer: Customer): 'life' | 'health' | 'critical' | 'education' => {
    const getCriteriaForProduct = (productKey: string) => {
      switch (productKey) {
        case 'life':
          return [
            { label: 'Age under 60', met: customer.age < 60, weight: 15 },
            { label: 'Has dependents', met: customer.demographics.dependents > 0, weight: 25 },
            { label: 'Sufficient income', met: customer.income >= 75000, weight: 20 },
            { label: 'Family building stage', met: customer.profile.lifeStage.includes('Family') || customer.profile.lifeStage.includes('Building'), weight: 10 },
            { label: 'Premium customer', met: customer.segment === 'Premium', weight: 15 },
            { label: 'Insurance segment match', met: customer.insuranceSegment === 'family_protector' || customer.insuranceSegment === 'health_conscious', weight: 15 }
          ];
        case 'health':
          return [
            { label: 'Age under 65', met: customer.age < 65, weight: 15 },
            { label: 'High occupation risk', met: customer.profile.occupationRisk === 'High', weight: 10 },
            { label: 'Sufficient income', met: customer.income >= 50000, weight: 20 },
            { label: 'Health conscious', met: customer.insuranceSegment === 'health_conscious', weight: 15 },
            { label: 'Premium customer', met: customer.segment === 'Premium', weight: 15 },
            { label: 'Medical coverage gap', met: !customer.profile.lifeStage.includes('Retired'), weight: 25 }
          ];
        case 'critical':
          return [
            { label: 'Age 30-55', met: customer.age >= 30 && customer.age <= 55, weight: 20 },
            { label: 'High income', met: customer.income >= 80000, weight: 15 },
            { label: 'Family responsibilities', met: customer.demographics.dependents > 0, weight: 20 },
            { label: 'Premium customer', met: customer.segment === 'Premium', weight: 15 },
            { label: 'Risk awareness', met: customer.insuranceSegment === 'risk_averse' || customer.insuranceSegment === 'family_protector', weight: 15 },
            { label: 'Professional occupation', met: customer.profile.occupationRisk === 'Low', weight: 15 }
          ];
        case 'education':
          return [
            { label: 'Has children', met: customer.demographics.dependents > 0, weight: 30 },
            { label: 'Age under 50', met: customer.age < 50, weight: 15 },
            { label: 'High income', met: customer.income >= 100000, weight: 20 },
            { label: 'Family building stage', met: customer.profile.lifeStage.includes('Family') || customer.profile.lifeStage.includes('Building'), weight: 15 },
            { label: 'Premium customer', met: customer.segment === 'Premium', weight: 10 },
            { label: 'Long-term planner', met: customer.insuranceSegment === 'wealth_builder', weight: 10 }
          ];
        default:
          return [];
      }
    };

    const products = ['life', 'health', 'critical', 'education'] as const;
    let highestScore = 0;
    let highestProduct: 'life' | 'health' | 'critical' | 'education' = 'life';

    products.forEach(product => {
      const criteria = getCriteriaForProduct(product);
      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
      const metWeight = criteria.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);
      const score = Math.round((metWeight / totalWeight) * 100);
      
      if (score > highestScore) {
        highestScore = score;
        highestProduct = product;
      }
    });

    return highestProduct;
  };

  const [selectedProduct, setSelectedProduct] = useState<'life' | 'health' | 'critical' | 'education'>(() => 
    selectedCustomer ? getHighestScoringProduct(selectedCustomer) : 'life'
  );

  // Update selected product when customer changes to automatically select highest scoring product
  React.useEffect(() => {
    if (selectedCustomer) {
      const highestProduct = getHighestScoringProduct(selectedCustomer);
      setSelectedProduct(highestProduct);
    }
  }, [selectedCustomer]);


  // Add slider styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slider::-webkit-slider-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .slider::-moz-range-thumb {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: #3b82f6;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .slider::-webkit-slider-track {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
      }
      .slider::-moz-range-track {
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
      }
      /* Chat scrollbar styling */
      .chat-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .chat-scroll::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }
      .chat-scroll::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      .chat-scroll::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // What If simulation state
  const [showReasoningProduct, setShowReasoningProduct] = useState<number | null>(null);
  const [showReasoningInsights, setShowReasoningInsights] = useState(false);
  const [showPropensityReasoning, setShowPropensityReasoning] = useState<string | null>(null);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [expandedDecisionTree, setExpandedDecisionTree] = useState<string | null>(null);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const [simulationParams, setSimulationParams] = useState<{
    age: number;
    income: number;
    dependents: number;
    riskTolerance: number;
  } | null>(null);

  // Update selected product when simulation parameters change
  React.useEffect(() => {
    if (selectedCustomer && simulationParams) {
      // Create a temporary customer object with simulated parameters
      const simulatedCustomer = {
        ...selectedCustomer,
        age: simulationParams.age,
        income: simulationParams.income,
        demographics: {
          ...selectedCustomer.demographics,
          dependents: simulationParams.dependents
        }
      };
      
      const highestProduct = getHighestScoringProduct(simulatedCustomer);
      setSelectedProduct(highestProduct);
    }
  }, [simulationParams, selectedCustomer]);

  const [showSettings, setShowSettings] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showMcpAgents, setShowMcpAgents] = useState(false);
  const [showUnderwritingReasoning, setShowUnderwritingReasoning] = useState(false);
  const [underwritingOverride, setUnderwritingOverride] = useState<{
    status: 'approved' | 'declined' | 'review' | null;
    reason: string;
    premium: number | null;
  }>({ status: null, reason: '', premium: null });
  
  const [isSendingCampaign, setIsSendingCampaign] = useState(false);
  const [showCampaignHistory, setShowCampaignHistory] = useState(false);
  const [showCampaignPreview, setShowCampaignPreview] = useState(false);
  const [campaignPreviewMessage, setCampaignPreviewMessage] = useState('');
  
  // Insurance Segments State
  const [insuranceSegments, setInsuranceSegments] = useState<InsuranceSegment[]>([
    {
      id: 'family_protector',
      name: 'Family Protector',
      description: 'High-income families with dependents seeking comprehensive protection',
      criteria: {
        ageRange: { min: 30, max: 50 },
        salaryRange: { min: 80000, max: 200000 },
        dependents: { min: 2, max: 5 },
        riskTolerance: { min: 3, max: 7 },
        segment: ['Premium', 'Standard'],
        occupation: ['Manager', 'Engineer', 'Doctor', 'Banker']
      },
      color: '#3b82f6',
      priority: 1
    },
    {
      id: 'wealth_builder',
      name: 'Wealth Builder',
      description: 'High earners focused on investment-linked insurance products',
      criteria: {
        ageRange: { min: 25, max: 45 },
        salaryRange: { min: 100000, max: 300000 },
        dependents: { min: 0, max: 3 },
        riskTolerance: { min: 6, max: 10 },
        segment: ['Premium'],
        occupation: ['Investment Banker', 'Consultant', 'Entrepreneur']
      },
      color: '#10b981',
      priority: 2
    },
    {
      id: 'health_conscious',
      name: 'Health Conscious',
      description: 'Mid-career professionals prioritizing health coverage',
      criteria: {
        ageRange: { min: 35, max: 55 },
        salaryRange: { min: 60000, max: 120000 },
        dependents: { min: 1, max: 4 },
        riskTolerance: { min: 4, max: 8 },
        segment: ['Premium', 'Standard'],
        occupation: ['Professional', 'Manager', 'Specialist']
      },
      color: '#f59e0b',
      priority: 3
    }
  ]);
  const [showSegmentSettings, setShowSegmentSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignHistory, setCampaignHistory] = useState([
    {
      id: 1,
      customer: "Jennifer Liu",
      date: "2024-01-15",
      type: "Life Insurance",
      status: "Delivered",
      response: "Opened",
      conversion: "Interested"
    },
    {
      id: 2,
      customer: "James Wilson", 
      date: "2024-01-12",
      type: "Health Insurance",
      status: "Delivered",
      response: "Replied",
      conversion: "Scheduled"
    },
    {
      id: 3,
      customer: "Lisa Thompson",
      date: "2024-01-10", 
      type: "Critical Illness",
      status: "Delivered",
      response: "Read",
      conversion: "Pending"
    }
  ]);

  // Assistant configurations
  const assistants: Assistant[] = [
    {
      id: 'insurance',
      name: 'Insurance Guru',
      title: 'Insurance Expert',
      icon: <FaShieldAlt />,
      isOnline: true,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'bank',
      name: 'Bank Guru',
      title: 'Banking Expert',
      icon: <FaUniversity />,
      isOnline: true,
      color: 'from-emerald-500 to-green-600'
    }
  ];

  // Get propensity score color
  const getPropensityColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Generate comprehensive propensity reasoning
  const getPropensityFactors = (customer: Customer) => {
    const factors = [];
    
    // Age factors
    if (customer.age >= 25 && customer.age <= 35) {
      factors.push({ text: "Young professional demographic", type: "positive" });
    } else if (customer.age >= 36 && customer.age <= 50) {
      factors.push({ text: "Prime earning years", type: "positive" });
    } else if (customer.age >= 51 && customer.age <= 65) {
      factors.push({ text: "Pre-retirement planning phase", type: "positive" });
    } else if (customer.age < 25) {
      factors.push({ text: "Early career stage", type: "neutral" });
    } else {
      factors.push({ text: "Retirement age consideration", type: "neutral" });
    }
    
    // Income factors
    if (customer.income >= 150000) {
      factors.push({ text: "High disposable income", type: "positive" });
    } else if (customer.income >= 100000) {
      factors.push({ text: "Above-average income", type: "positive" });
    } else if (customer.income >= 75000) {
      factors.push({ text: "Moderate income level", type: "neutral" });
    } else if (customer.income >= 50000) {
      factors.push({ text: "Budget-conscious segment", type: "neutral" });
    } else {
      factors.push({ text: "Lower income bracket", type: "negative" });
    }
    
    // Segment factors
    if (customer.segment === 'Premium') {
      factors.push({ text: "Premium banking relationship", type: "positive" });
    } else if (customer.segment === 'Standard') {
      factors.push({ text: "Standard banking customer", type: "neutral" });
    } else {
      factors.push({ text: "Basic banking services", type: "negative" });
    }
    
    // Demographic factors
    if (customer.demographics.maritalStatus === 'Married') {
      factors.push({ text: "Family protection needs", type: "positive" });
    }
    
    if (customer.demographics.dependents > 0) {
      factors.push({ text: `${customer.demographics.dependents} dependent${customer.demographics.dependents > 1 ? 's' : ''}`, type: "positive" });
    }
    
    // Score-based behavioral factors
    if (customer.propensityScore >= 80) {
      factors.push({ text: "Strong financial planning behavior", type: "positive" });
    } else if (customer.propensityScore >= 60) {
      factors.push({ text: "Moderate insurance interest", type: "neutral" });
    } else if (customer.propensityScore >= 40) {
      factors.push({ text: "Requires education and engagement", type: "neutral" });
    } else {
      factors.push({ text: "Low insurance awareness", type: "negative" });
    }
    
    return factors;
  };

  // Get segment color
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Premium': return 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200';
      case 'Standard': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200';
      case 'Basic': return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border border-gray-200';
    }
  };

  // Simple markdown renderer with source references
  const renderMarkdown = (text: string) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-sm font-semibold text-gray-900 mt-3 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold text-gray-900 mt-4 mb-3">$1</h1>')
      // Source references as clickable links
      .replace(/\[([^\]]+)\]/g, '<a href="#" class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium underline decoration-dotted cursor-pointer" onclick="event.preventDefault(); console.log(\'Source: $1\');" title="Click to view source: $1">📄 $1</a>')
      // Numbered lists
      .replace(/^(\d+)\.\s\*\*(.*?)\*\*(.*)$/gm, '<div class="mt-3 mb-2"><span class="font-semibold text-gray-900">$1. $2</span>$3</div>')
      // Bullet points with bold
      .replace(/^-\s\*\*(.*?)\*\*(.*)$/gm, '<div class="ml-4 mb-1"><span class="font-semibold text-gray-900">• $1</span>$2</div>')
      // Regular bullet points
      .replace(/^-\s(.*)$/gm, '<div class="ml-4 mb-1 text-gray-700">• $1</div>')
      // Line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  // Intelligent search function
  const searchCustomers = (customers: Customer[], query: string): Customer[] => {
    if (!query.trim()) return customers;
    
    const searchTerm = query.toLowerCase().trim();
    
    return customers.filter(customer => {
      // Assign insurance segment if not already assigned for search
      if (!customer.insuranceSegment) {
        customer.insuranceSegment = assignCustomerSegment(customer);
      }
      
      const insuranceSegment = insuranceSegments.find(s => s.id === customer.insuranceSegment);
      
      // Search in multiple fields
      const searchFields = [
        customer.name.toLowerCase(),
        customer.email.toLowerCase(),
        customer.segment.toLowerCase(),
        customer.demographics.occupation.toLowerCase(),
        customer.profile.nationality.toLowerCase(),
        customer.demographics.dependents.toString(),
        customer.age.toString(),
        customer.income.toString(),
        customer.propensityScore.toString(),
        insuranceSegment?.name.toLowerCase() || '',
        insuranceSegment?.description.toLowerCase() || '',
        customer.profile.lifeStage.toLowerCase(),
        customer.profile.financialSophistication.toLowerCase()
      ];
      
      // Check if any field contains the search term
      return searchFields.some(field => field.includes(searchTerm));
    });
  };

  // Function to manually assign segment to customer
  const handleAssignSegment = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const assignedSegment = assignCustomerSegment(customer);
    
    const updatedCustomers = customers.map(c => {
      if (c.id === customerId) {
        return { ...c, insuranceSegment: assignedSegment };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    
    // Provide feedback
    if (assignedSegment) {
      const segment = insuranceSegments.find(s => s.id === assignedSegment);
      console.log(`✅ ${customer.name} assigned to ${segment?.name} segment`);
    } else {
      console.log(`⚠️ ${customer.name} doesn't match any segment criteria`);
    }
  };

  // Function to assign customer to insurance segment
  const assignCustomerSegment = (customer: Customer): string | undefined => {
    for (const segment of insuranceSegments.sort((a, b) => a.priority - b.priority)) {
      const { criteria } = segment;
      
      // Check all criteria
      const ageMatch = customer.age >= criteria.ageRange.min && customer.age <= criteria.ageRange.max;
      const salaryMatch = customer.income >= criteria.salaryRange.min && customer.income <= criteria.salaryRange.max;
      const dependentsMatch = customer.demographics.dependents >= criteria.dependents.min && customer.demographics.dependents <= criteria.dependents.max;
      const segmentMatch = criteria.segment.includes(customer.segment);
      const occupationMatch = criteria.occupation.some(occ => customer.demographics.occupation.toLowerCase().includes(occ.toLowerCase()));
      
      if (ageMatch && salaryMatch && dependentsMatch && segmentMatch && occupationMatch) {
        return segment.id;
      }
    }
    return undefined;
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    // Assign insurance segment if not already assigned
    if (!customer.insuranceSegment) {
      customer.insuranceSegment = assignCustomerSegment(customer);
    }
    
    setSelectedCustomer(customer);
    setCurrentView('insights');
    setUnderwritingResult(null);
    
    // Automatically select the product with the highest score
    const maxNeedValue = Math.max(...Object.values(customer.needs));
    const recommendedProduct = Object.entries(customer.needs).find(([_, value]) => value === maxNeedValue)?.[0] as keyof typeof customer.needs;
    if (recommendedProduct) {
      setSelectedProduct(recommendedProduct);
    }
  };

  // Handle underwriting simulation
  const handleUnderwriting = async () => {
    if (!selectedCustomer) return;
    
    setIsUnderwriting(true);
    setCurrentView('underwriting');
    
    try {
      // Call OpenAI API for underwriting assessment
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert AI underwriting assistant specializing in bancassurance products. Your role is to conduct thorough risk assessment and provide professional underwriting decisions.

**Your Expertise:**
- Life, Health, Critical Illness, and Education insurance underwriting
- Risk assessment based on age, health, occupation, and financial profile
- Regulatory compliance (MAS guidelines)
- Premium pricing and policy terms

**Analysis Framework:**
1. **Risk Assessment**: Evaluate age, health status, occupation risk, lifestyle factors
2. **Financial Capacity**: Assess income, existing coverage, affordability
3. **Regulatory Compliance**: Ensure MAS suitability requirements
4. **Decision Rationale**: Provide clear, professional reasoning

**Output Format:**
- **Decision**: APPROVED / DECLINED / REVIEW REQUIRED
- **Premium**: Suggested premium amount (if approved)
- **Risk Rating**: Low / Medium / High
- **Key Factors**: List main decision factors
- **Conditions**: Any special terms or exclusions
- **Reasoning**: Professional explanation of decision

Be thorough, objective, and provide actionable insights for the bancassurance team.`
            },
            {
              role: 'user',
              content: `Assess this customer for ${selectedProduct} insurance:
              
Customer Profile:
- Name: ${selectedCustomer.name}
- Age: ${selectedCustomer.age}
- Income: $${selectedCustomer.income.toLocaleString()}
- Occupation: ${selectedCustomer.demographics.occupation}
- Marital Status: ${selectedCustomer.demographics.maritalStatus}
- Dependents: ${selectedCustomer.demographics.dependents}
- Propensity Score: ${selectedCustomer.propensityScore}%

Provide a JSON response with:
{
  "status": "approved|declined|review",
  "reason": "brief explanation",
  "premium": monthly_premium_amount_if_approved,
  "conditions": ["any special conditions"]
}`
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse AI response
      try {
        const result = JSON.parse(aiResponse);
        setUnderwritingResult(result);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        setUnderwritingResult({
          status: 'approved',
          reason: aiResponse,
          premium: Math.floor(selectedCustomer.age * 2.5 + selectedCustomer.income * 0.001)
        });
      }
    } catch (error) {
      console.error('Underwriting error:', error);
      // Fallback result
      setUnderwritingResult({
        status: selectedCustomer.propensityScore > 70 ? 'approved' : 'review',
        reason: `Assessment based on customer profile analysis. Score: ${selectedCustomer.propensityScore}%`,
        premium: Math.floor(selectedCustomer.age * 2.5 + selectedCustomer.income * 0.001)
      });
    }
    
    setIsUnderwriting(false);
  };

  // Send WhatsApp campaign with AI-generated dynamic content
  const handleWhatsAppCampaign = async () => {
    if (!selectedCustomer) return;
    
    setIsSendingCampaign(true);
    
    // Get the primary recommended product
    const primaryProduct = Object.entries(selectedCustomer.needs)
      .reduce((max, [key, value]) => value > max.value ? {key, value} : max, {key: '', value: 0});
    
    const productNames = {
      life: 'Life Insurance',
      health: 'Health Insurance', 
      critical: 'Critical Illness Coverage',
      education: 'Education Savings Plan'
    };
    
    try {

      // Generate personalized WhatsApp message using AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert WhatsApp marketing specialist for bancassurance products. Create personalized, engaging WhatsApp messages that convert leads into customers.

**Your Expertise:**
- WhatsApp-friendly formatting (emojis, bullet points, short paragraphs)
- Personalized messaging based on customer data
- Compelling value propositions
- Clear call-to-actions
- Professional yet friendly tone

**Message Requirements:**
- Maximum 200 words
- Use emojis strategically (not overwhelming)
- Include personalized customer details
- Highlight product benefits specific to customer profile
- End with clear next steps and call-to-action
- Use *bold* for emphasis
- Include numbered options for response

**Tone:** Professional, friendly, persuasive, and trustworthy.
**Goal:** Generate interest and prompt immediate response for consultation.`
            },
            {
              role: 'user',
              content: `Create a personalized WhatsApp campaign message for:

Customer: ${selectedCustomer.name}
Age: ${selectedCustomer.age}
Occupation: ${selectedCustomer.demographics.occupation}
Marital Status: ${selectedCustomer.demographics.maritalStatus}
Dependents: ${selectedCustomer.demographics.dependents}
Income: $${selectedCustomer.income.toLocaleString()}
Banking Segment: ${selectedCustomer.segment}
Propensity Score: ${selectedCustomer.propensityScore}%

Recommended Product: ${productNames[primaryProduct.key as keyof typeof productNames]}
Match Score: ${primaryProduct.value}%

Key Needs Analysis:
- Life Insurance: ${selectedCustomer.needs.life}%
- Health Insurance: ${selectedCustomer.needs.health}%
- Critical Illness: ${selectedCustomer.needs.critical}%
- Education Savings: ${selectedCustomer.needs.education}%

Create a compelling WhatsApp message that addresses their specific needs and motivates them to respond.`
            }
          ]
        })
      });

      const data = await response.json();
      const whatsappMessage = data.choices[0].message.content;

      // Add to campaign history
      setTimeout(() => {
        const newCampaign = {
        id: campaignHistory.length + 1,
        customer: selectedCustomer.name,
        date: new Date().toISOString().split('T')[0],
        type: productNames[primaryProduct.key as keyof typeof productNames],
        status: "Delivered",
        response: "Pending",
        conversion: "Sent"
      };
      
      setCampaignHistory([newCampaign, ...campaignHistory]);
      setIsSendingCampaign(false);
      
      // Show success message in modal
      setCampaignPreviewMessage(whatsappMessage);
      setShowCampaignPreview(true);
      console.log('AI-Generated WhatsApp Message:', whatsappMessage);
    }, 2000);
      
    } catch (error) {
      console.error('WhatsApp campaign generation error:', error);
      
      // Fallback to basic message if AI generation fails
      const fallbackMessage = `Hi ${selectedCustomer.name}! 🏦\n\nOur analysis shows you're a great fit for ${productNames[primaryProduct.key as keyof typeof productNames]}.\n\nWould you like to:\n1️⃣ Schedule consultation\n2️⃣ Get quote\n3️⃣ Learn more\n\nReply with the number!`;
      
      setTimeout(() => {
        const newCampaign = {
          id: campaignHistory.length + 1,
          customer: selectedCustomer.name,
          date: new Date().toISOString().split('T')[0],
          type: productNames[primaryProduct.key as keyof typeof productNames],
          status: "Delivered",
          response: "Pending",
          conversion: "Sent"
        };
        
        setCampaignHistory([newCampaign, ...campaignHistory]);
        setIsSendingCampaign(false);
        setCampaignPreviewMessage(fallbackMessage);
        setShowCampaignPreview(true);
      }, 2000);
    }
  };

  // Generate AI analysis for What If simulation
  const generateWhatIfAnalysis = async (params: {age: number; income: number; dependents: number; riskTolerance: number}) => {
    if (!selectedCustomer) return;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert What If analysis specialist for bancassurance products. Analyze parameter changes and provide insightful recommendations about how these changes affect insurance needs and product suitability.

**Your Expertise:**
- Impact analysis of demographic and financial changes
- Insurance needs assessment based on life changes
- Product recommendation adjustments
- Risk profile evaluation
- Financial planning implications

**Analysis Framework:**
1. **Change Impact**: Analyze how each parameter change affects insurance needs
2. **Risk Assessment**: Evaluate new risk profile based on changes
3. **Product Suitability**: Recommend product adjustments
4. **Premium Impact**: Estimate how changes affect pricing
5. **Strategic Insights**: Provide actionable recommendations

**Output Format:**
- **Key Changes**: Summarize the main parameter changes
- **Impact Analysis**: How changes affect insurance needs (2-3 key points)
- **Product Recommendations**: Updated product priorities with reasoning
- **Risk Profile**: New risk assessment
- **Next Steps**: Actionable recommendations

**Tone:** Professional, analytical, and advisory.
**Goal:** Provide clear insights on how life changes impact insurance strategy.`
            },
            {
              role: 'user',
              content: `Analyze the What If scenario changes for customer ${selectedCustomer.name}:

**Original Profile:**
- Age: ${selectedCustomer.age}
- Income: $${selectedCustomer.income.toLocaleString()}
- Dependents: ${selectedCustomer.demographics.dependents}
- Current Needs: Life ${selectedCustomer.needs.life}%, Health ${selectedCustomer.needs.health}%, Critical ${selectedCustomer.needs.critical}%, Education ${selectedCustomer.needs.education}%

**Simulated Changes:**
- New Age: ${params.age} (${params.age > selectedCustomer.age ? '+' : ''}${params.age - selectedCustomer.age} years)
- New Income: $${params.income.toLocaleString()} (${params.income > selectedCustomer.income ? '+' : ''}$${(params.income - selectedCustomer.income).toLocaleString()})
- New Dependents: ${params.dependents} (${params.dependents > selectedCustomer.demographics.dependents ? '+' : ''}${params.dependents - selectedCustomer.demographics.dependents})
- Risk Tolerance: ${params.riskTolerance}/10

**Customer Context:**
- Occupation: ${selectedCustomer.demographics.occupation}
- Marital Status: ${selectedCustomer.demographics.maritalStatus}
- Banking Segment: ${selectedCustomer.segment}
- Current Propensity Score: ${selectedCustomer.propensityScore}%

Provide a comprehensive What If analysis explaining how these changes impact their insurance strategy and recommendations.`
            }
          ]
        })
      });

      const data = await response.json();
      const analysisResult = data.choices[0].message.content;
      
      // Store the analysis result (you might want to add a state for this)
      console.log('What If Analysis Generated:', analysisResult);
      
      // You could display this in the AI Recommendations section or create a dedicated What If results area
      // For now, we'll log it and it could be shown in the recommendations section
      
    } catch (error) {
      console.error('What If analysis generation error:', error);
    }
  };

  // Chat functionality
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingMessage('');

    // Detect if user is calling specific assistant
    let assistantType: 'insurance' | 'bank' | null = null;
    let cleanedInput = currentInput;

    if (currentInput.toLowerCase().includes('@insure')) {
      assistantType = 'insurance';
      cleanedInput = currentInput.replace(/@insure/gi, '').trim();
    } else if (currentInput.toLowerCase().includes('@bank')) {
      assistantType = 'bank';
      cleanedInput = currentInput.replace(/@bank/gi, '').trim();
    }

    // Create system prompt based on assistant type
    let systemPrompt = '';
    const customerContext = selectedCustomer ? `
Current Customer Context:
- Name: ${selectedCustomer.name}
- Age: ${selectedCustomer.age}, ${selectedCustomer.demographics.maritalStatus}, ${selectedCustomer.demographics.dependents} children
- Occupation: ${selectedCustomer.demographics.occupation}
- Income: $${selectedCustomer.income.toLocaleString()}
- Banking Segment: ${selectedCustomer.segment}
- Propensity Score: ${selectedCustomer.propensityScore}%
- Insurance Needs: Life ${selectedCustomer.needs.life}%, Health ${selectedCustomer.needs.health}%, Critical ${selectedCustomer.needs.critical}%, Education ${selectedCustomer.needs.education}%
- Risk Profile: ${selectedCustomer.profile.occupationRisk} occupation risk, ${selectedCustomer.profile.financialSophistication} financial sophistication
- Life Stage: ${selectedCustomer.profile.lifeStage}

Format your response using markdown for better readability. Use **bold** for important points, numbered lists for structured information, and bullet points for details.

IMPORTANT: Your recommendations must be consistent with the dashboard analysis:
- Primary recommendation: ${selectedCustomer ? Object.entries(selectedCustomer.needs).find(([_, value]) => value === Math.max(...Object.values(selectedCustomer.needs)))?.[0] : 'N/A'} (${selectedCustomer ? Math.max(...Object.values(selectedCustomer.needs)) : 'N/A'}%)
- Use RAG citations in your responses. Reference sources like: [Customer Risk Matrix], [Regulatory Guidelines MAS], [Product Catalog v2.1], [Underwriting Manual], [Bancassurance Framework], [Customer Segmentation Model]

Always cite your sources and ensure recommendations match the dashboard's decision tree analysis.` : '';

    if (assistantType === 'insurance') {
      systemPrompt = `You are an Insurance Guru, an expert in all aspects of insurance products, policies, regulations, and customer needs. You specialize in life insurance, health insurance, critical illness coverage, and education savings plans. 

${customerContext}

You can help with:
- Product recommendations based on customer profile
- Underwriting assessments and risk analysis
- Premium calculations and policy terms
- Regulatory compliance and suitability analysis
- Detailed explanations of insurance products

Provide expert advice with confidence and authority. Use markdown formatting for clear, professional responses.`;
    } else if (assistantType === 'bank') {
      systemPrompt = `You are a Bank Guru, an expert in banking services, financial products, lending, investments, and bancassurance. You understand how banks integrate insurance products with traditional banking services.

${customerContext}

You can help with:
- Banking relationship analysis
- Cross-selling opportunities
- Customer segmentation insights
- Financial capacity assessments
- Bancassurance product integration

Provide expert banking advice with confidence and authority. Use markdown formatting for clear, professional responses.`;
    } else {
      systemPrompt = `You are a Bancassurance Assistant, expert in both banking and insurance products. You help with customer analysis, product recommendations, and general bancassurance inquiries.

${customerContext}

You can help with:
- Customer risk analysis and recommendations
- Product suitability assessments
- Underwriting guidance
- Premium estimates
- Policy recommendations
- Banking and insurance integration

If asked about specific recommendations or underwriting for the current customer, provide detailed analysis based on their profile data. Use markdown formatting for clear, professional responses.`;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: cleanedInput || currentInput }
          ],
          stream: true
        })
      });

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
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: accumulatedContent,
        timestamp: new Date(),
        assistant: assistantType || undefined
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
              { role: 'user', content: cleanedInput || currentInput }
            ]
          })
        });

        const data = await fallbackResponse.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
          assistant: assistantType || undefined
        };

        setChatMessages(prev => [...prev, assistantMessage]);
      } catch (fallbackError) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
      
      setStreamingMessage('');
    }

    setIsLoading(false);
    setIsStreaming(false);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // MCP Protocol Integration for adding agents
  // Open agent selection modal
  const handleAddAgent = () => {
    setShowAddAgentModal(true);
  };

  // Handle agent type selection
  const handleAgentSelection = async (type: 'person' | 'ai') => {
    if (type === 'ai') {
      // Close the add agent modal and open settings with MCP configuration
      setShowAddAgentModal(false);
      setShowSettings(true);
      setShowMcpAgents(true); // Automatically expand MCP agents section
      
      console.log('Opening MCP configuration settings...');
    } else {
      // Handle person addition
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Person invitation sent. They will receive a notification to join this Bancassurance consultation.',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setShowAddAgentModal(false);
    }
  };


  // Render customer list view
  const renderCustomerList = () => (
    <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bancassurance Customer Intelligence</h2>
            <p className="text-gray-600">AI-powered customer ranking and propensity scoring for insurance products</p>
          </div>
          
          {/* Settings Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="AI Agent Settings"
            >
              <FaCog size={18} />
            </button>
          </div>
        </div>

        {/* Featured Customer Selection Cards */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Customers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jennifer Liu Card */}
            <div 
              className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleCustomerSelect(MOCK_CUSTOMERS.find(c => c.id === 'cust_003')!)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Jennifer Liu</h4>
                  <p className="text-sm text-gray-600">Chinese • Premium Customer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">90% Score</span>
                    <span className="text-xs text-gray-500">Age 42 • $150K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* James Wilson Card */}
            <div 
              className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleCustomerSelect(MOCK_CUSTOMERS.find(c => c.id === 'cust_006')!)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">James Wilson</h4>
                  <p className="text-sm text-gray-600">American • Premium Customer</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">88% Score</span>
                    <span className="text-xs text-gray-500">Age 52 • $140K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customer List</h3>
            <p className="text-sm text-gray-600 mt-1">Ranked by propensity to purchase insurance products</p>
          </div>
        </div>

        {/* Intelligent Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by name, segment, insurance segment, occupation..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            </div>
            
            {/* Bulk Assign Button */}
            <div className="flex items-center gap-4 ml-4">
              <button
                onClick={() => {
                  customers.forEach(customer => {
                    if (!customer.insuranceSegment) {
                      handleAssignSegment(customer.id);
                    }
                  });
                }}
                className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                title="Assign segments to all unassigned customers"
              >
                <FaTag size={12} />
                Assign All
              </button>
              
              {/* Prudential Logo */}
              <div className="flex flex-col items-end opacity-60">
                <span className="text-xs text-gray-400 font-medium">Powered by</span>
                <div className="text-xs font-bold text-gray-400 tracking-wider">PRUDENTIAL</div>
              </div>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Searching across: name, segment, insurance segment, occupation, nationality, age, income, propensity score
              </div>
              <div className="text-xs font-medium text-blue-600">
                {searchCustomers(customers, searchQuery).length} of {customers.length} customers found
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Segment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propensity Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demographics</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchCustomers(customers, searchQuery).sort((a, b) => b.propensityScore - a.propensityScore).map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.segment)}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const segment = insuranceSegments.find(s => s.id === customer.insuranceSegment);
                      return segment ? (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: segment.color }}
                          ></div>
                          <span className="text-xs text-gray-700 font-medium">{segment.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Not Assigned</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAssignSegment(customer.id);
                            }}
                            className="w-5 h-5 bg-white border border-blue-500 text-blue-600 rounded hover:bg-blue-50 flex items-center justify-center transition-colors"
                            title="Assign insurance segment based on criteria"
                          >
                            <FaTag size={8} />
                          </button>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${getPropensityColor(customer.propensityScore)} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-900">{customer.propensityScore}%</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPropensityReasoning(showPropensityReasoning === customer.id ? null : customer.id);
                        }}
                        className="w-5 h-5 bg-white border border-blue-500 text-blue-600 rounded-full flex items-center justify-center text-xs hover:bg-blue-50 ml-1 flex-shrink-0"
                        title="Show reasoning"
                      >
                        i
                      </button>
                    </div>
                    {showPropensityReasoning === customer.id && (
                      <div className="absolute z-10 mt-1 p-3 bg-white border border-gray-200 rounded-md shadow-lg text-xs max-w-sm">
                        <div className="font-bold text-gray-900 mb-2">Analysis Factors</div>
                        <div className="space-y-1">
                          {getPropensityFactors(customer).map((factor, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                factor.type === 'positive' ? 'bg-green-400' : 
                                factor.type === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                              }`}></span>
                              <span>{factor.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="text-xs font-bold text-gray-800">
                            Result: {customer.propensityScore >= 80 ? 'High' : customer.propensityScore >= 60 ? 'Medium' : 'Low'} likelihood ({customer.propensityScore}%)
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          Age: {customer.age}
                        </div>
                        <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          ${customer.income.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {customer.demographics.maritalStatus}
                        </div>
                        <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {customer.demographics.dependents} {customer.demographics.dependents === 1 ? 'child' : 'children'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastInteraction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomerSelect(customer);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-lg hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-400"
                      title="View Customer Insights"
                    >
                      <FaEye size={14} className="text-gray-300 hover:text-gray-600" />
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

  // Render customer insights view
  const renderCustomerInsights = () => {
    if (!selectedCustomer) return null;

    const needs = [
      { key: 'life', label: 'Life Insurance', value: selectedCustomer.needs.life, icon: <FaShieldAlt />, color: 'bg-blue-500' },
      { key: 'health', label: 'Health Insurance', value: selectedCustomer.needs.health, icon: <FaHeartbeat />, color: 'bg-blue-500' },
      { key: 'critical', label: 'Critical Illness', value: selectedCustomer.needs.critical, icon: <FaExclamationTriangle />, color: 'bg-blue-500' },
      { key: 'education', label: 'Education Savings', value: selectedCustomer.needs.education, icon: <FaGraduationCap />, color: 'bg-blue-500' }
    ];

    const maxNeed = Math.max(...Object.values(selectedCustomer.needs));
    const recommendedProduct = Object.entries(selectedCustomer.needs).find(([_, value]) => value === maxNeed)?.[0] as keyof typeof selectedCustomer.needs;

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentView('list')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <FaArrowLeft size={14} />
              Back to Customer List
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Customer Insights</h2>
            <p className="text-gray-600">AI-powered analysis and recommendations</p>
          </div>
          
          {/* Settings */}
          <div className="flex items-center justify-end w-full">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="AI Agent Settings"
            >
              <FaCog size={18} />
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          {/* Customer Profile */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {selectedCustomer.segment} Customer
                </span>
              </div>
            </div>

            {/* Current Banking Products */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Current Banking Products</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Banking</div>
                    <div className="text-sm font-medium text-gray-900">{selectedCustomer.segment} Checking Account</div>
                    <div className="text-xs text-gray-600">Since {2024 - Math.floor(selectedCustomer.age / 10)} • Active</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Credit</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedCustomer.segment === 'Premium' ? 'Platinum Credit Card' : 
                       selectedCustomer.segment === 'Standard' ? 'Gold Credit Card' : 'Standard Credit Card'}
                    </div>
                    <div className="text-xs text-gray-600">
                      ${selectedCustomer.income >= 150000 ? '50,000' : selectedCustomer.income >= 100000 ? '25,000' : '15,000'} limit • 
                      {selectedCustomer.segment === 'Premium' ? ' Personal Loan available' : ' Good standing'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Investments</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedCustomer.segment === 'Premium' ? 'Portfolio Management Service' : 
                       selectedCustomer.segment === 'Standard' ? 'Fixed Deposits & Mutual Funds' : 'Basic Savings'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedCustomer.segment === 'Premium' ? 'Managed portfolio • Wealth advisor assigned' : 
                       selectedCustomer.segment === 'Standard' ? 'Self-directed • Online trading' : 'Standard savings rate'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Insurance</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedCustomer.age > 40 ? 'Basic Life Insurance' : 'No Current Coverage'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedCustomer.age > 40 ? 'Term life • Cross-sell opportunity for enhancement' : 'Prime opportunity for comprehensive coverage'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Customer Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Customer Profile Details</h4>
              
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Personal Information</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Age</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Marital Status</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.demographics.maritalStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dependents</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.demographics.dependents} {selectedCustomer.demographics.dependents === 1 ? 'child' : 'children'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nationality</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.nationality}</span>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Professional Profile</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Occupation</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.demographics.occupation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Annual Income</span>
                    <span className="text-sm font-medium text-gray-900">${selectedCustomer.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Occupation Risk</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.occupationRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Life Stage</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.lifeStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Financial Sophistication</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.financialSophistication}</span>
                  </div>
                </div>
              </div>

              {/* Customer Journey */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-500 uppercase mb-2">Customer Journey</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Customer Since</span>
                    <span className="text-sm font-medium text-gray-900">{2024 - Math.floor(selectedCustomer.age / 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Interaction</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.lastInteraction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Relationship Score</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomer.segment === 'Premium' ? 'Excellent' : selectedCustomer.segment === 'Standard' ? 'Good' : 'Developing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Propensity Score</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${getPropensityColor(selectedCustomer.propensityScore)} rounded-full`}></div>
                  <span className="text-sm font-semibold">{selectedCustomer.propensityScore}%</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPropensityReasoning(showPropensityReasoning === 'insights' ? null : 'insights');
                    }}
                    className="w-5 h-5 bg-white border border-blue-500 text-blue-600 rounded-full flex items-center justify-center text-xs hover:bg-blue-50 ml-1 flex-shrink-0"
                    title="Show reasoning"
                  >
                    i
                  </button>
                </div>
              </div>
              {showPropensityReasoning === 'insights' && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  <div className="font-bold text-gray-900 mb-2">Analysis Factors</div>
                  <div className="space-y-1.5">
                    {getPropensityFactors(selectedCustomer).map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          factor.type === 'positive' ? 'bg-green-400' : 
                          factor.type === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                        }`}></span>
                        <span>{factor.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-sm font-bold text-gray-800">
                      Result: {selectedCustomer.propensityScore >= 80 ? 'High' : selectedCustomer.propensityScore >= 60 ? 'Medium' : 'Low'} likelihood ({selectedCustomer.propensityScore}%)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={handleWhatsAppCampaign}
                disabled={isSendingCampaign}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-transparent bg-clip-padding rounded-lg transition-all duration-200 hover:scale-105 font-medium relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'white',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #10b981, #059669)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                {/* Light effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                {isSendingCampaign ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold">Sending...</span>
                  </>
                ) : (
                  <>
                    <FaWhatsapp size={16} className="text-green-600" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold">Send Campaign</span>
                  </>
                )}
              </button>
              
              {/* Campaign History Button */}
              <button
                onClick={() => setShowCampaignHistory(!showCampaignHistory)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
              >
                <FaHistory size={12} />
                Campaign History
                <span className={`transform transition-transform ${showCampaignHistory ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {/* Collapsible Campaign History */}
              {showCampaignHistory && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600 border-b border-gray-200 pb-1">
                      <span>Customer</span>
                      <span>Date</span>
                      <span>Type</span>
                      <span className="text-right">Status</span>
                    </div>
                    {campaignHistory
                      .filter(campaign => selectedCustomer && campaign.customer === selectedCustomer.name)
                      .slice(0, 3)
                      .map((campaign) => (
                      <div key={campaign.id} className="grid grid-cols-4 gap-2 items-center text-xs">
                        <span className="font-medium text-gray-900 truncate">{campaign.customer.split(' ')[0]}</span>
                        <span className="text-gray-600">{new Date(campaign.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="text-gray-600 truncate">{campaign.type.split(' ')[0]}</span>
                        <div className="flex justify-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.conversion === 'Scheduled' ? 'bg-green-100 text-green-700' :
                            campaign.conversion === 'Interested' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {campaign.conversion}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-200">
                      {selectedCustomer ? campaignHistory.filter(c => c.customer === selectedCustomer.name).length : 0} total campaigns • {selectedCustomer ? campaignHistory.filter(c => c.customer === selectedCustomer.name && c.conversion === 'Scheduled').length : 0} conversions
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Customer Profile */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Intelligence Profile</h3>
            
            {/* Comprehensive Profile Analysis */}
            <div className="space-y-6 flex-1">
              {/* Core Demographics */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Core Demographics</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Nationality</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.nationality}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Age Group</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomer.age < 30 ? 'Young Professional' : 
                       selectedCustomer.age < 45 ? 'Mid-Career' : 
                       selectedCustomer.age < 60 ? 'Senior Professional' : 'Pre-Retirement'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Life Stage</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.lifeStage}</span>
                  </div>
                </div>
              </div>

              {/* Insurance Segment */}
              {selectedCustomer.insuranceSegment && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Insurance Segment</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {(() => {
                      const segment = insuranceSegments.find(s => s.id === selectedCustomer.insuranceSegment);
                      return segment ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: segment.color }}
                            ></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{segment.name}</div>
                              <div className="text-xs text-gray-600">{segment.description}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Priority {segment.priority}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">No segment assigned</div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Risk Assessment</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Occupation Risk</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.occupationRisk}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Financial Sophistication</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.profile.financialSophistication}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Income Bracket</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomer.income >= 150000 ? 'High Earner' : 
                       selectedCustomer.income >= 100000 ? 'Above Average' : 
                       selectedCustomer.income >= 75000 ? 'Average' : 'Below Average'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Behavioral Insights */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">Behavioral Profile</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Banking Relationship</span>
                    <span className="text-sm font-medium text-gray-900">{selectedCustomer.segment} Customer</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Family Structure</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomer.demographics.maritalStatus} • {selectedCustomer.demographics.dependents} {selectedCustomer.demographics.dependents === 1 ? 'child' : 'children'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Engagement Level</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCustomer.propensityScore >= 80 ? 'Highly Engaged' : 
                       selectedCustomer.propensityScore >= 60 ? 'Moderately Engaged' : 'Requires Nurturing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Needs - Radar Chart Style */}
            <div className="border-t border-gray-200 pt-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-1 uppercase tracking-wide">Insurance Needs Analysis</h4>
              
              {/* Radar Chart Visualization */}
              <div className="flex items-center justify-center mb-1">
                <div className="relative w-40 h-40">
                  {/* Radar Chart Background */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    {/* Grid circles */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Grid lines */}
                    <line x1="100" y1="20" x2="100" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="20" y1="100" x2="180" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="156.57" y1="43.43" x2="43.43" y2="156.57" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="156.57" y1="156.57" x2="43.43" y2="43.43" stroke="#e5e7eb" strokeWidth="1" />
                    
                    {/* Data polygon */}
                    <polygon
                      points={`
                        100,${20 + 80 * (1 - selectedCustomer.needs.life / 100)}
                        ${100 + 80 * Math.sin(Math.PI/2) * (selectedCustomer.needs.health / 100)},${100 - 80 * Math.cos(Math.PI/2) * (selectedCustomer.needs.health / 100)}
                        ${100 + 80 * Math.sin(Math.PI) * (selectedCustomer.needs.critical / 100)},${100 - 80 * Math.cos(Math.PI) * (selectedCustomer.needs.critical / 100)}
                        ${100 + 80 * Math.sin(3*Math.PI/2) * (selectedCustomer.needs.education / 100)},${100 - 80 * Math.cos(3*Math.PI/2) * (selectedCustomer.needs.education / 100)}
                      `}
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* Data points */}
                    <circle cx="100" cy={20 + 80 * (1 - selectedCustomer.needs.life / 100)} r="4" fill="#3b82f6" />
                    <circle cx={100 + 80 * Math.sin(Math.PI/2) * (selectedCustomer.needs.health / 100)} cy={100 - 80 * Math.cos(Math.PI/2) * (selectedCustomer.needs.health / 100)} r="4" fill="#3b82f6" />
                    <circle cx={100 + 80 * Math.sin(Math.PI) * (selectedCustomer.needs.critical / 100)} cy={100 - 80 * Math.cos(Math.PI) * (selectedCustomer.needs.critical / 100)} r="4" fill="#3b82f6" />
                    <circle cx={100 + 80 * Math.sin(3*Math.PI/2) * (selectedCustomer.needs.education / 100)} cy={100 - 80 * Math.cos(3*Math.PI/2) * (selectedCustomer.needs.education / 100)} r="4" fill="#3b82f6" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    Life {selectedCustomer.needs.life}%
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-700">
                    Health {selectedCustomer.needs.health}%
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    Critical {selectedCustomer.needs.critical}%
                  </div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-700">
                    Education {selectedCustomer.needs.education}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Bancassurance Intelligence</h3>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span className="text-xs text-gray-400 font-medium">Powered by</span>
                <div className="text-xs font-bold text-gray-400 tracking-wider">PRUDENTIAL</div>
              </div>
            </div>
            
            <div className="space-y-6 flex-1">
              {/* RAG-Based Reasoning */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Knowledge Base Analysis</h4>
                <div className="text-sm text-gray-700 space-y-3">
                  <div>
                    <strong>Customer Segment Analysis:</strong> Based on {selectedCustomer.segment} banking profile and risk assessment guidelines from internal customer classification system.
                  </div>
                  <div>
                    <strong>Regulatory Compliance:</strong> Recommendations align with bancassurance regulatory framework and MAS guidelines for product suitability.
                  </div>
                  <div>
                    <strong>Product Suitability:</strong> Matched against internal product catalog and suitability matrix using customer risk profile and financial capacity assessment.
                  </div>
                </div>
              </div>

              {/* Decision Tree Analysis */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Product Selection Decision Tree</h4>
                <div className="space-y-3">
                  {needs.map((need) => {
                    // Calculate weighted scores for all products first
                    const allWeightedScores = needs.map(n => {
                      const getCriteriaForScore = (productKey: string) => {
                        // Use simulation parameters if available, otherwise use customer data
                        const effectiveAge = simulationParams?.age || selectedCustomer.age;
                        const effectiveIncome = simulationParams?.income || selectedCustomer.income;
                        const effectiveDependents = simulationParams?.dependents || selectedCustomer.demographics.dependents;
                        
                        switch (productKey) {
                          case 'life':
                            return [
                              { label: 'Age under 60', met: effectiveAge < 60, weight: 15 },
                              { label: 'Has dependents', met: effectiveDependents > 0, weight: 25 },
                              { label: 'Sufficient income', met: effectiveIncome >= 75000, weight: 20 },
                              { label: 'Family building stage', met: selectedCustomer.profile.lifeStage.includes('Family') || selectedCustomer.profile.lifeStage.includes('Building'), weight: 10 },
                              { label: 'Premium customer', met: selectedCustomer.segment === 'Premium', weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'health_conscious', weight: 15 }
                            ];
                          case 'health':
                            return [
                              { label: 'Age under 65', met: selectedCustomer.age < 65, weight: 15 },
                              { label: 'High occupation risk', met: selectedCustomer.profile.occupationRisk === 'High', weight: 10 },
                              { label: 'Standard+ segment', met: selectedCustomer.segment !== 'Basic', weight: 20 },
                              { label: 'Good income level', met: selectedCustomer.income >= 50000, weight: 20 },
                              { label: 'Active professional', met: selectedCustomer.age >= 25 && selectedCustomer.age <= 65, weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'health_conscious' || selectedCustomer.insuranceSegment === 'family_protector', weight: 20 }
                            ];
                          case 'critical':
                            return [
                              { label: 'Age 35-60 range', met: selectedCustomer.age >= 35 && selectedCustomer.age <= 60, weight: 20 },
                              { label: 'Premium affordability', met: selectedCustomer.income >= 75000, weight: 25 },
                              { label: 'Family protection need', met: selectedCustomer.demographics.dependents > 0, weight: 20 },
                              { label: 'Professional occupation', met: selectedCustomer.demographics.occupation.includes('Manager') || selectedCustomer.demographics.occupation.includes('Engineer') || selectedCustomer.demographics.occupation.includes('Doctor'), weight: 10 },
                              { label: 'Advanced sophistication', met: selectedCustomer.profile.financialSophistication === 'Advanced', weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 10 }
                            ];
                          case 'education':
                            return [
                              { label: 'Has children', met: selectedCustomer.demographics.dependents > 0, weight: 30 },
                              { label: 'Planning horizon', met: selectedCustomer.age < 50, weight: 15 },
                              { label: 'Savings capacity', met: selectedCustomer.income >= 100000, weight: 25 },
                              { label: 'Multiple dependents', met: selectedCustomer.demographics.dependents > 1, weight: 15 },
                              { label: 'Peak earning stage', met: selectedCustomer.profile.lifeStage.includes('Peak') || selectedCustomer.profile.lifeStage.includes('Earning'), weight: 10 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 5 }
                            ];
                          default:
                            return [];
                        }
                      };
                      const criteria = getCriteriaForScore(n.key);
                      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
                      const metWeight = criteria.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);
                      return Math.round((metWeight / totalWeight) * 100);
                    });
                    
                    const currentWeightedScore = allWeightedScores[needs.findIndex(n => n.key === need.key)];
                    const maxWeightedScore = Math.max(...allWeightedScores);
                    
                    const isRecommended = currentWeightedScore >= 70;
                    const isPrimary = currentWeightedScore === maxWeightedScore;
                    const isExpanded = expandedDecisionTree === need.key;
                    
                    // Define weighted criteria for each product type
                    const getCriteria = (productKey: string) => {
                      switch (productKey) {
                        case 'life':
                          return [
                            { label: 'Age under 60', met: selectedCustomer.age < 60, weight: 15 },
                            { label: 'Has dependents', met: selectedCustomer.demographics.dependents > 0, weight: 25 },
                            { label: 'Sufficient income', met: selectedCustomer.income >= 75000, weight: 20 },
                            { label: 'Family building stage', met: selectedCustomer.profile.lifeStage.includes('Family') || selectedCustomer.profile.lifeStage.includes('Building'), weight: 10 },
                            { label: 'Premium customer', met: selectedCustomer.segment === 'Premium', weight: 15 },
                            { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'health_conscious', weight: 15 }
                          ];
                        case 'health':
                          return [
                            { label: 'Age under 65', met: selectedCustomer.age < 65, weight: 15 },
                            { label: 'High occupation risk', met: selectedCustomer.profile.occupationRisk === 'High', weight: 10 },
                            { label: 'Standard+ segment', met: selectedCustomer.segment !== 'Basic', weight: 20 },
                            { label: 'Good income level', met: selectedCustomer.income >= 50000, weight: 20 },
                            { label: 'Active professional', met: selectedCustomer.age >= 25 && selectedCustomer.age <= 65, weight: 15 },
                            { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'health_conscious' || selectedCustomer.insuranceSegment === 'family_protector', weight: 20 }
                          ];
                        case 'critical':
                          return [
                            { label: 'Age 35-60 range', met: selectedCustomer.age >= 35 && selectedCustomer.age <= 60, weight: 20 },
                            { label: 'Premium affordability', met: selectedCustomer.income >= 75000, weight: 25 },
                            { label: 'Family protection need', met: selectedCustomer.demographics.dependents > 0, weight: 20 },
                            { label: 'Professional occupation', met: selectedCustomer.demographics.occupation.includes('Manager') || selectedCustomer.demographics.occupation.includes('Engineer') || selectedCustomer.demographics.occupation.includes('Doctor'), weight: 10 },
                            { label: 'Advanced sophistication', met: selectedCustomer.profile.financialSophistication === 'Advanced', weight: 15 },
                            { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 10 }
                          ];
                        case 'education':
                          return [
                            { label: 'Has children', met: selectedCustomer.demographics.dependents > 0, weight: 30 },
                            { label: 'Planning horizon', met: selectedCustomer.age < 50, weight: 15 },
                            { label: 'Savings capacity', met: selectedCustomer.income >= 100000, weight: 25 },
                            { label: 'Multiple dependents', met: selectedCustomer.demographics.dependents > 1, weight: 15 },
                            { label: 'Peak earning stage', met: selectedCustomer.profile.lifeStage.includes('Peak') || selectedCustomer.profile.lifeStage.includes('Earning'), weight: 10 },
                            { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 5 }
                          ];
                        default:
                          return [];
                      }
                    };

                    const criteria = getCriteria(need.key);
                    const metCriteria = criteria.filter(c => c.met).length;
                    
                    // Calculate weighted score
                    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
                    const metWeight = criteria.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);
                    const weightedScore = Math.round((metWeight / totalWeight) * 100);
                    
                    return (
                      <div key={need.key} className="border border-gray-200 rounded-lg bg-gray-50">
                        <div 
                          className="p-3 cursor-pointer hover:bg-gray-100"
                          onClick={() => setExpandedDecisionTree(isExpanded ? null : need.key)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                isPrimary ? 'bg-blue-600' : 
                                isRecommended ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <h5 className="font-medium text-gray-900">{need.label}</h5>
                              <span className="text-sm font-medium text-gray-700">
                                {weightedScore}%
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                isPrimary ? 'bg-blue-100 text-blue-700' : 
                                isRecommended ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isPrimary ? 'PRIMARY' : isRecommended ? 'RECOMMENDED' : 'SECONDARY'}
                              </span>
                            </div>
                            <span className="text-gray-400 text-sm">
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-gray-200 bg-white">
                            <div className="pt-3">
                              <div className="text-xs font-medium text-gray-600 mb-2">
                                Decision Criteria ({metCriteria}/{criteria.length} met)
                              </div>
                              <div className="space-y-2">
                                {criteria.map((criterion, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                        criterion.met ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                      }`}>
                                        {criterion.met ? '✓' : '✗'}
                                      </div>
                                      <span className={criterion.met ? 'text-gray-900' : 'text-gray-500'}>
                                        {criterion.label}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                      {criterion.weight}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                              
                              {/* AI Reasoning */}
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-blue-600 rounded-sm flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                  </div>
                                  <div className="text-xs font-medium text-gray-600">AI Analysis</div>
                                </div>
                                <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                  {need.key === 'life' && (
                                    isPrimary ? "High priority due to family responsibilities and income level. Life insurance provides essential protection for dependents." :
                                    isRecommended ? "Suitable coverage based on age and financial profile. Consider term life for cost-effective protection." :
                                    "Lower priority given current life stage. May consider basic coverage for future planning."
                                  )}
                                  {need.key === 'health' && (
                                    isPrimary ? "Critical coverage recommended due to occupation risk and income capacity. Health insurance ensures medical security." :
                                    isRecommended ? "Good fit considering professional status and age. Comprehensive health coverage advised." :
                                    "Basic health coverage may suffice given current risk profile and existing coverage options."
                                  )}
                                  {need.key === 'critical' && (
                                    isPrimary ? "High value coverage due to peak earning years and family protection needs. Critical illness provides income replacement." :
                                    isRecommended ? "Valuable protection for professional earning capacity. Consider coverage aligned with income level." :
                                    "Lower immediate need but may be valuable for comprehensive protection strategy."
                                  )}
                                  {need.key === 'education' && (
                                    isPrimary ? "Essential planning tool given dependents and earning capacity. Education savings maximizes compound growth potential." :
                                    isRecommended ? "Strong opportunity for tax-efficient education funding. Early start provides maximum benefit." :
                                    "Consider when family planning becomes more defined or income increases."
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Product Selection Override</h4>
                <p className="text-xs text-gray-600 mb-3"><strong>Click</strong> any product to <strong>override</strong> AI recommendation and proceed with eligibility</p>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    // Calculate weighted scores for all products for comparison
                    const allWeightedScoresForOverride = needs.map(n => {
                      const getCriteriaForOverride = (productKey: string) => {
                        switch (productKey) {
                          case 'life':
                            return [
                              { label: 'Age under 60', met: selectedCustomer.age < 60, weight: 15 },
                              { label: 'Has dependents', met: selectedCustomer.demographics.dependents > 0, weight: 25 },
                              { label: 'Sufficient income', met: selectedCustomer.income >= 75000, weight: 20 },
                              { label: 'Family building stage', met: selectedCustomer.profile.lifeStage.includes('Family') || selectedCustomer.profile.lifeStage.includes('Building'), weight: 10 },
                              { label: 'Premium customer', met: selectedCustomer.segment === 'Premium', weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'health_conscious', weight: 15 }
                            ];
                          case 'health':
                            return [
                              { label: 'Age under 65', met: selectedCustomer.age < 65, weight: 15 },
                              { label: 'High occupation risk', met: selectedCustomer.profile.occupationRisk === 'High', weight: 10 },
                              { label: 'Standard+ segment', met: selectedCustomer.segment !== 'Basic', weight: 20 },
                              { label: 'Good income level', met: selectedCustomer.income >= 50000, weight: 20 },
                              { label: 'Active professional', met: selectedCustomer.age >= 25 && selectedCustomer.age <= 65, weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'health_conscious' || selectedCustomer.insuranceSegment === 'family_protector', weight: 20 }
                            ];
                          case 'critical':
                            return [
                              { label: 'Age 35-60 range', met: selectedCustomer.age >= 35 && selectedCustomer.age <= 60, weight: 20 },
                              { label: 'Premium affordability', met: selectedCustomer.income >= 75000, weight: 25 },
                              { label: 'Family protection need', met: selectedCustomer.demographics.dependents > 0, weight: 20 },
                              { label: 'Professional occupation', met: selectedCustomer.demographics.occupation.includes('Manager') || selectedCustomer.demographics.occupation.includes('Engineer') || selectedCustomer.demographics.occupation.includes('Doctor'), weight: 10 },
                              { label: 'Advanced sophistication', met: selectedCustomer.profile.financialSophistication === 'Advanced', weight: 15 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 10 }
                            ];
                          case 'education':
                            return [
                              { label: 'Has children', met: selectedCustomer.demographics.dependents > 0, weight: 30 },
                              { label: 'Planning horizon', met: selectedCustomer.age < 50, weight: 15 },
                              { label: 'Savings capacity', met: selectedCustomer.income >= 100000, weight: 25 },
                              { label: 'Multiple dependents', met: selectedCustomer.demographics.dependents > 1, weight: 15 },
                              { label: 'Peak earning stage', met: selectedCustomer.profile.lifeStage.includes('Peak') || selectedCustomer.profile.lifeStage.includes('Earning'), weight: 10 },
                              { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 5 }
                            ];
                          default:
                            return [];
                        }
                      };
                      const criteria = getCriteriaForOverride(n.key);
                      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
                      const metWeight = criteria.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);
                      return Math.round((metWeight / totalWeight) * 100);
                    });
                    const maxWeightedScoreForOverride = Math.max(...allWeightedScoresForOverride);
                    
                    return needs.map((need) => {
                      const currentWeightedScoreForOverride = allWeightedScoresForOverride[needs.findIndex(n => n.key === need.key)];
                      const isHighestScore = currentWeightedScoreForOverride === maxWeightedScoreForOverride;
                      
                      return (
                    <button
                      key={need.key}
                      onClick={() => setSelectedProduct(need.key as any)}
                      className={`p-3 text-xs border rounded-lg transition-colors ${
                        selectedProduct === need.key 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {need.icon}
                        <span className="font-medium">{need.label}</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                        isHighestScore
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {(() => {
                          const getCriteria = (productKey: string) => {
                            switch (productKey) {
                              case 'life':
                                return [
                                  { label: 'Age under 60', met: selectedCustomer.age < 60, weight: 15 },
                                  { label: 'Has dependents', met: selectedCustomer.demographics.dependents > 0, weight: 25 },
                                  { label: 'Sufficient income', met: selectedCustomer.income >= 75000, weight: 20 },
                                  { label: 'Family building stage', met: selectedCustomer.profile.lifeStage.includes('Family') || selectedCustomer.profile.lifeStage.includes('Building'), weight: 10 },
                                  { label: 'Premium customer', met: selectedCustomer.segment === 'Premium', weight: 15 },
                                  { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'health_conscious', weight: 15 }
                                ];
                              case 'health':
                                return [
                                  { label: 'Age under 65', met: selectedCustomer.age < 65, weight: 15 },
                                  { label: 'High occupation risk', met: selectedCustomer.profile.occupationRisk === 'High', weight: 10 },
                                  { label: 'Standard+ segment', met: selectedCustomer.segment !== 'Basic', weight: 20 },
                                  { label: 'Good income level', met: selectedCustomer.income >= 50000, weight: 20 },
                                  { label: 'Active professional', met: selectedCustomer.age >= 25 && selectedCustomer.age <= 65, weight: 15 },
                                  { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'health_conscious' || selectedCustomer.insuranceSegment === 'family_protector', weight: 20 }
                                ];
                              case 'critical':
                                return [
                                  { label: 'Age 35-60 range', met: selectedCustomer.age >= 35 && selectedCustomer.age <= 60, weight: 20 },
                                  { label: 'Premium affordability', met: selectedCustomer.income >= 75000, weight: 25 },
                                  { label: 'Family protection need', met: selectedCustomer.demographics.dependents > 0, weight: 20 },
                                  { label: 'Professional occupation', met: selectedCustomer.demographics.occupation.includes('Manager') || selectedCustomer.demographics.occupation.includes('Engineer') || selectedCustomer.demographics.occupation.includes('Doctor'), weight: 10 },
                                  { label: 'Advanced sophistication', met: selectedCustomer.profile.financialSophistication === 'Advanced', weight: 15 },
                                  { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 10 }
                                ];
                              case 'education':
                                return [
                                  { label: 'Has children', met: selectedCustomer.demographics.dependents > 0, weight: 30 },
                                  { label: 'Planning horizon', met: selectedCustomer.age < 50, weight: 15 },
                                  { label: 'Savings capacity', met: selectedCustomer.income >= 100000, weight: 25 },
                                  { label: 'Multiple dependents', met: selectedCustomer.demographics.dependents > 1, weight: 15 },
                                  { label: 'Peak earning stage', met: selectedCustomer.profile.lifeStage.includes('Peak') || selectedCustomer.profile.lifeStage.includes('Earning'), weight: 10 },
                                  { label: 'Insurance segment match', met: selectedCustomer.insuranceSegment === 'family_protector' || selectedCustomer.insuranceSegment === 'wealth_builder', weight: 5 }
                                ];
                              default:
                                return [];
                            }
                          };
                          const criteria = getCriteria(need.key);
                          const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
                          const metWeight = criteria.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);
                          return Math.round((metWeight / totalWeight) * 100);
                        })()}% match
                      </span>
                    </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Side by side buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleUnderwriting}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  AI Eligibility
                </button>

                <button
                  onClick={() => setShowWhatIfModal(true)}
                  className="px-3 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  What If
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Render underwriting simulation view
  const renderUnderwriting = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentView('insights')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <FaArrowLeft size={14} />
              Back to Insights
            </button>
            <h2 className="text-2xl font-bold text-gray-900">AI Eligibility Assessment</h2>
            <p className="text-gray-600">Predictive underwriting assessment in seconds</p>
          </div>
          
          {/* Override Controls */}
          <div className="flex items-center gap-2">
            {underwritingOverride.status !== null && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Manual Override Active
              </span>
            )}
            <button
              onClick={() => setUnderwritingOverride({ status: null, reason: '', premium: null })}
              className="px-3 py-2 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={underwritingOverride.status === null}
            >
              Reset to AI
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedProduct.charAt(0).toUpperCase() + selectedProduct.slice(1)} Insurance Assessment
              </h3>
              <p className="text-gray-600">Customer: {selectedCustomer.name}</p>
            </div>

            {isUnderwriting ? (
              <div className="py-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaSpinner className="text-gray-600 animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Processing Eligibility Assessment</h4>
                  <p className="text-gray-600 text-sm">Analyzing risk profile and policy eligibility</p>
                </div>
                <div className="mt-6 bg-gray-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-gray-400 h-1 rounded-full animate-pulse transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>
            ) : underwritingResult ? (
              <div className="space-y-6">
                {/* Decision Summary */}
                <div className="text-center pb-4 border-b border-gray-200">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    (underwritingOverride.status || underwritingResult.status) === 'approved' ? 'bg-green-50 text-green-800 border border-green-200' :
                    (underwritingOverride.status || underwritingResult.status) === 'declined' ? 'bg-red-50 text-red-800 border border-red-200' : 
                    'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {(underwritingOverride.status || underwritingResult.status) === 'approved' ? (
                      <>
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        APPROVED
                      </>
                    ) : (underwritingOverride.status || underwritingResult.status) === 'declined' ? (
                      <>
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        DECLINED
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                        REQUIRES REVIEW
                      </>
                    )}
                  </div>
                  
                  {/* Reasoning Button */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setShowUnderwritingReasoning(!showUnderwritingReasoning)}
                      className="text-xs text-gray-600 hover:text-gray-800 underline flex items-center gap-1"
                    >
                      {showUnderwritingReasoning ? 'Hide' : 'Show'} Reasoning
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </button>
                  </div>
                  
                  {/* Collapsible Reasoning */}
                  {showUnderwritingReasoning && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                      <h5 className="font-semibold text-gray-900 mb-2">Decision Reasoning</h5>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><span className="font-medium">Risk Assessment:</span> {selectedCustomer.profile.occupationRisk} occupation risk, {selectedCustomer.profile.financialSophistication} financial sophistication</p>
                        <p><span className="font-medium">Customer Profile:</span> {selectedCustomer.age} years old, {selectedCustomer.segment} segment, ${selectedCustomer.income.toLocaleString()} annual income</p>
                        <p><span className="font-medium">Propensity Score:</span> {selectedCustomer.propensityScore}% likelihood for insurance products</p>
                        <p><span className="font-medium">Product Fit:</span> {selectedCustomer.needs[selectedProduct as keyof typeof selectedCustomer.needs]}% need for {selectedProduct} insurance</p>
                        {underwritingOverride.status && (
                          <p><span className="font-medium text-yellow-700">Manual Override:</span> {underwritingOverride.reason || 'Manual decision applied'}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Risk Assessment</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Customer Profile</div>
                      <div className="font-medium text-gray-900">
                        {selectedCustomer.segment} • {selectedCustomer.age}Y • {selectedCustomer.demographics.occupation}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Risk Score</div>
                      <div className="font-medium text-gray-900">
                        {selectedCustomer.propensityScore >= 80 ? 'Low Risk' : 
                         selectedCustomer.propensityScore >= 60 ? 'Medium Risk' : 'High Risk'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Income Verification</div>
                      <div className="font-medium text-gray-900">${selectedCustomer.income.toLocaleString()}/year</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Eligibility Decision</div>
                      <div className="font-medium text-gray-900 capitalize">{underwritingResult.status}</div>
                    </div>
                  </div>
                </div>

                {/* Premium Details */}
                {underwritingResult.premium && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Premium Structure</h5>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">${underwritingResult.premium}</div>
                        <div className="text-sm text-gray-600">Monthly Premium</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-700">${underwritingResult.premium * 12}</div>
                        <div className="text-sm text-gray-600">Annual Premium</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Policy Terms */}
                {underwritingResult.conditions && underwritingResult.conditions.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Policy Terms</h5>
                    <div className="space-y-2">
                      {underwritingResult.conditions.map((condition, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Manual Override Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Manual Override</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Decision</label>
                      <select
                        value={underwritingOverride.status || ''}
                        onChange={(e) => setUnderwritingOverride(prev => ({ 
                          ...prev, 
                          status: e.target.value as 'approved' | 'declined' | 'review' | null || null 
                        }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Use AI Decision</option>
                        <option value="approved">Approve</option>
                        <option value="declined">Decline</option>
                        <option value="review">Requires Review</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Premium Override ($)</label>
                      <input
                        type="number"
                        value={underwritingOverride.premium || ''}
                        onChange={(e) => setUnderwritingOverride(prev => ({ 
                          ...prev, 
                          premium: e.target.value ? parseFloat(e.target.value) : null 
                        }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Original: $292"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                      <input
                        type="text"
                        value={underwritingOverride.reason}
                        onChange={(e) => setUnderwritingOverride(prev => ({ 
                          ...prev, 
                          reason: e.target.value 
                        }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Override reason..."
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentView('insights')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Back to Insights
                  </button>
                  {(underwritingOverride.status || underwritingResult.status) === 'approved' && (
                    <button
                      onClick={handleWhatsAppCampaign}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Send Offer
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Ready to process eligibility assessment</p>
                <button
                  onClick={handleUnderwriting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render chat interface (bottom layout like contact center)
  const renderChatInterface = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Compact Chat Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center text-gray-700 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <FaRobot className="text-gray-700" size={10} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-xs">Bancassurance Assistant</h3>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                Online • Use @insure or @bank
              </div>
            </div>
          </div>
          
          {/* Compact Assistant Indicators with Add Agent Button */}
          <div className="flex items-center gap-2">
            {assistants.map((assistant) => (
              <div key={assistant.id} className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full bg-white border border-transparent bg-clip-padding flex items-center justify-center relative`}
                     style={{
                       backgroundImage: `linear-gradient(white, white), linear-gradient(45deg, ${assistant.id === 'insurance' ? '#3b82f6, #6366f1' : '#10b981, #059669'})`,
                       backgroundOrigin: 'border-box',
                       backgroundClip: 'padding-box, border-box'
                     }}>
                  <div className="text-gray-700 text-xs">
                    {assistant.icon}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 ${assistant.isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border border-white`}></div>
                </div>
                <span className="text-xs font-medium text-gray-600">{assistant.name.split(' ')[0]}</span>
              </div>
            ))}
            
            {/* Add Agent Button */}
            <button
              onClick={handleAddAgent}
              className="w-5 h-5 rounded-full bg-white border border-gray-300 hover:border-blue-400 flex items-center justify-center transition-colors hover:bg-blue-50"
              title="Add Agent via MCP Protocol"
            >
              <span className="text-gray-400 hover:text-blue-600 text-xs font-bold">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Compact height */}
        <div 
        ref={chatContainerRef}
        className="h-64 overflow-y-auto p-3 space-y-2 scroll-smooth chat-scroll"
        style={{ scrollBehavior: 'smooth' }}
      >
        {chatMessages.length === 0 ? (
          <div className="text-center py-2">
            <div className="w-8 h-8 bg-white rounded-full border border-transparent bg-clip-padding flex items-center justify-center mx-auto mb-2 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <FaRobot className="text-gray-700 text-xs" />
                </div>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 mb-1 text-xs">Welcome to Bancassurance Assistant!</h4>
            <p className="text-xs text-gray-600">Use @insure for insurance or @bank for banking questions</p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs p-3 rounded-lg text-sm ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.role === 'assistant' && message.assistant && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${
                      message.assistant === 'insurance' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {message.assistant === 'insurance' ? <FaShieldAlt /> : <FaUniversity />}
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {message.assistant === 'insurance' ? 'Insurance Guru' : 'Bank Guru'}
                    </span>
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  </div>
                )}
                
                <div className={message.role === 'user' ? 'text-white text-xs' : 'text-gray-900'}>
                  {message.role === 'assistant' ? (
                    <div 
                      className="text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                    />
                  ) : (
                    <div className="text-xs">{message.content}</div>
                  )}
                </div>
                
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {isStreaming && streamingMessage && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm max-w-xs">
              <div 
                className="text-xs leading-relaxed text-gray-900"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingMessage) }}
              />
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">Streaming...</span>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin text-indigo-500" size={14} />
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about insurance or banking... Use @insure or @bank"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 w-full"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && chatInput.trim()) {
                handleChatSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isLoading}
            className="px-3 py-2 bg-white border-2 border-transparent bg-clip-padding rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #3b82f6, #6366f1)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <FaPaperPlane size={12} className="text-blue-600" />
          </button>
        </div>
      </form>
    </div>
  );

  // Main render
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {currentView === 'list' && renderCustomerList()}
        {currentView === 'insights' && renderCustomerInsights()}
        {currentView === 'underwriting' && renderUnderwriting()}
      </div>
      
      {/* Chat Interface at Bottom */}
      <div className="h-96 border-t border-gray-200 bg-white flex-shrink-0">
        {renderChatInterface()}
      </div>

      {/* What If Modal */}
      {showWhatIfModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">What If Simulation</h3>
              <button
                onClick={() => setShowWhatIfModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Adjust parameters to see how they affect insurance recommendations:</p>
              
              <form id="simulation-form">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Age</label>
                    <input
                      type="range"
                      name="age"
                      min="25"
                      max="65"
                      defaultValue={selectedCustomer?.age || 45}
                      className="w-full slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>25</span>
                      <span>65</span>
                    </div>
                  </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Annual Income</label>
                  <input
                    type="range"
                    name="income"
                    min="50000"
                    max="200000"
                    step="10000"
                    defaultValue={selectedCustomer?.income || 100000}
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$50K</span>
                    <span>$200K</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Dependents</label>
                  <input
                    type="range"
                    name="dependents"
                    min="0"
                    max="5"
                    defaultValue={selectedCustomer?.demographics.dependents || 2}
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>5</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Risk Tolerance</label>
                  <input
                    type="range"
                    name="riskTolerance"
                    min="1"
                    max="10"
                    defaultValue="5"
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Health Status</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="4"
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Job Security</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="4"
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Unstable</span>
                    <span>Very Secure</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Existing Coverage</label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    defaultValue="1"
                    className="w-full slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>None</span>
                    <span>Comprehensive</span>
                  </div>
                </div>
              </div>
              </form>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowWhatIfModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Capture the simulation parameters from the form
                    const form = document.querySelector('#simulation-form') as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      const params = {
                        age: parseInt(formData.get('age') as string) || selectedCustomer?.age || 45,
                        income: parseInt(formData.get('income') as string) || selectedCustomer?.income || 100000,
                        dependents: parseInt(formData.get('dependents') as string) || selectedCustomer?.demographics.dependents || 1,
                        riskTolerance: parseInt(formData.get('riskTolerance') as string) || 5
                      };
                      
                      // Update simulation parameters and generate AI analysis
                      setSimulationParams(params);
                      console.log('Simulation parameters updated:', params);
                      
                      // Generate AI analysis of the simulation changes
                      generateWhatIfAnalysis(params);
                    }
                    
                    setShowWhatIfModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Run Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI Agent Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Insurance Agent Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-600" size={16} />
                  Insurance Guru Settings
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full slider" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="500">500 tokens</option>
                      <option value="1000" selected>1000 tokens</option>
                      <option value="2000">2000 tokens</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RAG Grounding</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="strict" selected>Strict - Always cite sources</option>
                      <option value="moderate">Moderate - Cite when relevant</option>
                      <option value="flexible">Flexible - Minimal citations</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Knowledge Refresh</label>
                    <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Refresh Insurance DB
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Specialized Knowledge Sources</label>
                    <button
                      onClick={() => setShowDataSources(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Manage Sources
                    </button>
                  </div>
                  <div className="space-y-2">
                    {['Underwriting Manual v3.2', 'MAS Regulatory Guidelines', 'Product Catalog 2024', 'Risk Assessment Matrix'].map((source) => (
                      <label key={source} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">{source}</span>
                        <span className="text-xs text-green-600 ml-auto">Active</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bank Agent Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUniversity className="text-green-600" size={16} />
                  Bank Guru Settings
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                    <input type="range" min="0" max="1" step="0.1" defaultValue="0.4" className="w-full slider" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Conservative</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="500">500 tokens</option>
                      <option value="1000" selected>1000 tokens</option>
                      <option value="2000">2000 tokens</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Data Access</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="full" selected>Full Profile Access</option>
                      <option value="limited">Limited - Basic Info Only</option>
                      <option value="anonymized">Anonymized Data</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banking Data Sync</label>
                    <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      Sync Banking Records
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Banking Knowledge Sources</label>
                    <button
                      onClick={() => setShowDataSources(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Manage Sources
                    </button>
                  </div>
                  <div className="space-y-2">
                    {['Customer Segmentation Model', 'Cross-sell Playbook', 'Banking Regulations', 'Product Integration Guide'].map((source) => (
                      <label key={source} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm text-gray-700">{source}</span>
                        <span className="text-xs text-green-600 ml-auto">Active</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* MCP Protocol Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaRobot className="text-purple-600" size={16} />
                  MCP Protocol Settings
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MCP Server URL</label>
                    <input 
                      type="text" 
                      defaultValue="wss://mcp-hub.enterprise.ai/v1" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="MCP server endpoint"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                    <input 
                      type="password" 
                      defaultValue="mcp_token_••••••••" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="MCP API token"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agent Pool Size</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="2" selected>2 agents</option>
                      <option value="5">5 agents</option>
                      <option value="10">10 agents</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connection Status</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-800">Connected</span>
                    </div>
                  </div>
                </div>
                
                {/* MCP Servers Section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">MCP Server Connections</label>
                    <button
                      onClick={() => setShowMcpAgents(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Manage Servers
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Bancassurance MCP Server', status: 'active', endpoint: 'wss://mcp.bancassurance.ai/v1', agents: 4 },
                      { name: 'Risk Assessment MCP Server', status: 'active', endpoint: 'wss://risk.mcp-hub.ai/v2', agents: 2 }
                    ].map((server) => (
                      <div key={server.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${server.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div>
                            <span className="text-sm text-gray-700">{server.name}</span>
                            <p className="text-xs text-gray-500">{server.agents} agents connected</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${server.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {server.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowMcpAgents(true)}
                    className="mt-2 w-full px-3 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    Add MCP Server
                  </button>
                </div>
              </div>

              {/* Insurance Segment Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                      <FaChartLine className="text-orange-600" size={16} />
                      Insurance Segment Configuration
                    </h4>
                    <button
                      onClick={() => setShowSegmentSettings(!showSegmentSettings)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      {showSegmentSettings ? 'Hide Details' : 'Configure Segments'}
                    </button>
                  </div>
                  <div className="flex justify-end mt-12">
                    <div className="flex items-center gap-2 opacity-60">
                      <span className="text-xs text-gray-400 font-medium">Powered by</span>
                      <div className="text-xs font-bold text-gray-400 tracking-wider">PRUDENTIAL</div>
                    </div>
                  </div>
                </div>
                
                {showSegmentSettings && (
                  <div className="space-y-4">
                    {insuranceSegments.map((segment, index) => (
                      <div key={segment.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: segment.color }}
                            ></div>
                            <h5 className="text-sm font-semibold text-gray-900">{segment.name}</h5>
                            <span className="text-xs text-gray-500">Priority {segment.priority}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-3">{segment.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Age Range</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range" 
                                min="18" 
                                max="65" 
                                defaultValue={segment.criteria.ageRange.min}
                                className="flex-1 slider" 
                              />
                              <span className="text-xs text-gray-500">{segment.criteria.ageRange.min}-{segment.criteria.ageRange.max}</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Salary Range</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range" 
                                min="30000" 
                                max="300000" 
                                step="10000"
                                defaultValue={segment.criteria.salaryRange.min}
                                className="flex-1 slider" 
                              />
                              <span className="text-xs text-gray-500">${(segment.criteria.salaryRange.min/1000)}K-${(segment.criteria.salaryRange.max/1000)}K</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Dependents</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range" 
                                min="0" 
                                max="5" 
                                defaultValue={segment.criteria.dependents.min}
                                className="flex-1 slider" 
                              />
                              <span className="text-xs text-gray-500">{segment.criteria.dependents.min}-{segment.criteria.dependents.max}</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Risk Tolerance</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                defaultValue={segment.criteria.riskTolerance.min}
                                className="flex-1 slider" 
                              />
                              <span className="text-xs text-gray-500">{segment.criteria.riskTolerance.min}-{segment.criteria.riskTolerance.max}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Banking Segments</label>
                            <div className="flex flex-wrap gap-1">
                              {segment.criteria.segment.map(seg => (
                                <span key={seg} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {seg}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Target Occupations</label>
                            <div className="flex flex-wrap gap-1">
                              {segment.criteria.occupation.slice(0, 2).map(occ => (
                                <span key={occ} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {occ}
                                </span>
                              ))}
                              {segment.criteria.occupation.length > 2 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{segment.criteria.occupation.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full px-3 py-2 border border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                      <span className="text-lg">+</span>
                      Add New Segment
                    </button>
                  </div>
                )}
              </div>

              {/* Advanced Settings */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Advanced Settings</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Enable streaming responses</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Auto-refresh customer context</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-700">Cross-reference dashboard recommendations</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Debug mode (show RAG sources)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSettings(false);
                  // Here you would save the settings
                  alert('Settings saved successfully');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Sources Management Modal */}
      {showDataSources && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Knowledge Source Management</h3>
              <button
                onClick={() => setShowDataSources(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Insurance Sources */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-blue-600" size={16} />
                    Insurance Knowledge Sources
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Underwriting Manual v3.2', status: 'active', lastSync: '2 hours ago', size: '45.2 MB' },
                      { name: 'MAS Regulatory Guidelines', status: 'active', lastSync: '1 day ago', size: '12.8 MB' },
                      { name: 'Product Catalog 2024', status: 'active', lastSync: '3 hours ago', size: '28.5 MB' },
                      { name: 'Risk Assessment Matrix', status: 'active', lastSync: '5 hours ago', size: '8.2 MB' },
                      { name: 'Claims Database Archive', status: 'inactive', lastSync: '1 week ago', size: '156.3 MB' },
                      { name: 'Actuarial Tables 2024', status: 'pending', lastSync: 'Syncing...', size: '22.1 MB' }
                    ].map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            source.status === 'active' ? 'bg-green-500' : 
                            source.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{source.name}</p>
                            <p className="text-xs text-gray-500">Last sync: {source.lastSync} • {source.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800">Sync</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-3 w-full px-3 py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
                    <span className="text-lg">+</span>
                    Add Insurance Source
                  </button>
                </div>

                {/* Banking Sources */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUniversity className="text-green-600" size={16} />
                    Banking Knowledge Sources
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Customer Segmentation Model', status: 'active', lastSync: '1 hour ago', size: '18.7 MB' },
                      { name: 'Cross-sell Playbook', status: 'active', lastSync: '4 hours ago', size: '6.3 MB' },
                      { name: 'Banking Regulations', status: 'active', lastSync: '2 days ago', size: '34.1 MB' },
                      { name: 'Product Integration Guide', status: 'active', lastSync: '6 hours ago', size: '15.9 MB' },
                      { name: 'Customer Journey Analytics', status: 'inactive', lastSync: '3 days ago', size: '89.4 MB' },
                      { name: 'Compliance Framework', status: 'pending', lastSync: 'Syncing...', size: '41.2 MB' }
                    ].map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            source.status === 'active' ? 'bg-green-500' : 
                            source.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{source.name}</p>
                            <p className="text-xs text-gray-500">Last sync: {source.lastSync} • {source.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800">Sync</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-3 w-full px-3 py-2 border border-dashed border-green-300 text-green-600 rounded-lg text-sm hover:bg-green-50 flex items-center justify-center gap-2">
                    <span className="text-lg">+</span>
                    Add Banking Source
                  </button>
                </div>
              </div>
              
              {/* Sync Status */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-semibold text-blue-900 mb-2">Sync Status</h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">8</p>
                    <p className="text-xs text-gray-600">Active Sources</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">2</p>
                    <p className="text-xs text-gray-600">Syncing</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-600">2</p>
                    <p className="text-xs text-gray-600">Inactive</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDataSources(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Syncing all active sources...');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Sync All Sources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MCP Server Management Modal */}
      {showMcpAgents && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">MCP Server Management</h3>
              <button
                onClick={() => setShowMcpAgents(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Active MCP Servers */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Connected MCP Servers</h4>
                <div className="space-y-4">
                  {[
                    { 
                      name: 'Bancassurance MCP Server', 
                      status: 'active', 
                      endpoint: 'wss://mcp.bancassurance.ai/v1',
                      version: 'v2.1.3',
                      agents: [
                        { name: 'Insurance Guru', type: 'Insurance Expert', status: 'active' },
                        { name: 'Bank Guru', type: 'Banking Specialist', status: 'active' },
                        { name: 'Compliance Bot', type: 'Regulatory Assistant', status: 'inactive' },
                        { name: 'Document Processor', type: 'Document Analysis', status: 'active' }
                      ],
                      uptime: '99.8%',
                      lastSync: '2 minutes ago'
                    },
                    { 
                      name: 'Risk Assessment MCP Server', 
                      status: 'active', 
                      endpoint: 'wss://risk.mcp-hub.ai/v2',
                      version: 'v1.8.2',
                      agents: [
                        { name: 'Risk Analyzer', type: 'Risk Assessment', status: 'active' },
                        { name: 'Credit Scorer', type: 'Credit Analysis', status: 'active' }
                      ],
                      uptime: '98.7%',
                      lastSync: '5 minutes ago'
                    }
                  ].map((server) => (
                    <div key={server.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{server.name}</h5>
                            <p className="text-sm text-gray-600">{server.endpoint}</p>
                            <p className="text-xs text-gray-500">Version {server.version} • Uptime: {server.uptime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Connected</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Configure</button>
                          <button className="text-xs text-red-600 hover:text-red-800">Disconnect</button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Connected Agents ({server.agents.length})</p>
                        <div className="grid grid-cols-2 gap-2">
                          {server.agents.map((agent) => (
                            <div key={agent.name} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="text-gray-700">{agent.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">{agent.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection Statistics */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-sm font-semibold text-blue-900 mb-2">MCP Network Status</h5>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">2</p>
                    <p className="text-xs text-gray-600">Active Servers</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600">6</p>
                    <p className="text-xs text-gray-600">Total Agents</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">5</p>
                    <p className="text-xs text-gray-600">Active Agents</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-yellow-600">99.3%</p>
                    <p className="text-xs text-gray-600">Avg Uptime</p>
                  </div>
                </div>
              </div>

              {/* Add New Server */}
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaRobot className="mx-auto text-gray-400 mb-3" size={32} />
                <h5 className="text-md font-semibold text-gray-700 mb-2">Connect New MCP Server</h5>
                <p className="text-sm text-gray-600 mb-4">Add a new MCP server to expand agent capabilities</p>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="MCP Server Endpoint (wss://...)" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input 
                    type="password" 
                    placeholder="Authentication Token" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    + Connect Server
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowMcpAgents(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Refreshing all MCP server connections...');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Refresh All Servers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddAgentModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add to Thread</h3>
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Choose what you'd like to add to this thread:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleAgentSelection('person')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add Person</div>
                    <div className="text-sm text-gray-500">Invite a colleague to join this thread</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAgentSelection('ai')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaRobot className="text-purple-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Add AI Agent</div>
                    <div className="text-sm text-gray-500">Connect specialized AI agent via MCP protocol</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Preview Modal */}
      {showCampaignPreview && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-green-600" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Sent Successfully!</h3>
                  <p className="text-sm text-gray-500">WhatsApp message delivered to {selectedCustomer?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCampaignPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>📱</span>
                  Message Preview:
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-900 whitespace-pre-wrap font-mono leading-relaxed">
                  {campaignPreviewMessage}
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowCampaignPreview(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(campaignPreviewMessage);
                    alert('Message copied to clipboard!');
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FaPaperPlane size={12} />
                  Copy Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
