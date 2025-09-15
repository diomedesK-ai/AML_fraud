'use client';

import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaExchangeAlt, 
  FaUsers, 
  FaNetworkWired,
  FaLock,
  FaUnlock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaDatabase,
  FaShare,
  FaCog,
  FaChartLine,
  FaFileContract,
  FaUserShield,
  FaRobot,
  FaPlus,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaEnvelope,
  FaBuilding,
  FaTable,
  FaServer,
  FaCloud,
  FaFileAlt
} from 'react-icons/fa';

// Types
interface DataField {
  name: string;
  type: 'PII' | 'Financial' | 'Behavioral' | 'Demographic' | 'Transactional';
  sensitivity: 'Low' | 'Medium' | 'High' | 'Critical';
  originalValue: string;
  tokenizedValue?: string;
  isTokenized: boolean;
}

interface DataSharingConfig {
  pattern: 'sharing' | 'distribution' | 'collaborative';
  recipients: string[];
  tokenizationLevel: 'None' | 'Partial' | 'Full';
  encryptionEnabled: boolean;
  accessControl: 'Token-Based' | 'Role-Based' | 'Time-Limited';
  auditTrail: boolean;
}

interface SharingRequest {
  id: string;
  pattern: string;
  recipient: string;
  status: 'Pending' | 'Active' | 'Completed' | 'Revoked';
  dataFields: number;
  tokenizedFields: number;
  createdAt: Date;
  expiresAt?: Date;
}

const MOCK_DATA_FIELDS: DataField[] = [
  { name: 'Customer Name', type: 'PII', sensitivity: 'Critical', originalValue: 'Jennifer Liu', tokenizedValue: 'CUST_TOKEN_7X9K2', isTokenized: false },
  { name: 'Email Address', type: 'PII', sensitivity: 'High', originalValue: 'jennifer.liu@email.com', tokenizedValue: 'EMAIL_TOKEN_M4P8R', isTokenized: false },
  { name: 'Phone Number', type: 'PII', sensitivity: 'High', originalValue: '+1 (555) 123-4567', tokenizedValue: 'PHONE_TOKEN_N6Q3L', isTokenized: false },
  { name: 'Account Balance', type: 'Financial', sensitivity: 'Critical', originalValue: '$150,000', tokenizedValue: 'BAL_TOKEN_H8K9X', isTokenized: false },
  { name: 'Credit Score', type: 'Financial', sensitivity: 'High', originalValue: '785', tokenizedValue: 'SCORE_TOKEN_P2M7Y', isTokenized: false },
  { name: 'Age', type: 'Demographic', sensitivity: 'Medium', originalValue: '42', tokenizedValue: 'AGE_TOKEN_R5N8Q', isTokenized: false },
  { name: 'Occupation', type: 'Demographic', sensitivity: 'Medium', originalValue: 'Investment Banker', tokenizedValue: 'OCC_TOKEN_L3X6M', isTokenized: false },
  { name: 'Transaction History', type: 'Transactional', sensitivity: 'High', originalValue: 'Last 12 months data', tokenizedValue: 'TXN_TOKEN_W9K4P', isTokenized: false },
  { name: 'Risk Profile', type: 'Behavioral', sensitivity: 'Medium', originalValue: 'Conservative Investor', tokenizedValue: 'RISK_TOKEN_T7B5N', isTokenized: false },
  { name: 'Location Data', type: 'PII', sensitivity: 'High', originalValue: 'Singapore, Central Region', tokenizedValue: 'LOC_TOKEN_Z2Q8M', isTokenized: false }
];

const MOCK_SHARING_REQUESTS: SharingRequest[] = [
  { id: 'REQ_001', pattern: 'sharing', recipient: 'Prudential Insurance', status: 'Active', dataFields: 6, tokenizedFields: 4, createdAt: new Date(Date.now() - 86400000), expiresAt: new Date(Date.now() + 86400000 * 30) },
  { id: 'REQ_002', pattern: 'distribution', recipient: 'Multiple Insurers', status: 'Pending', dataFields: 8, tokenizedFields: 8, createdAt: new Date(Date.now() - 3600000) },
  { id: 'REQ_003', pattern: 'collaborative', recipient: 'Risk Analytics Consortium', status: 'Active', dataFields: 10, tokenizedFields: 10, createdAt: new Date(Date.now() - 172800000) },
];

const DATA_SOURCES = [
  { id: 'customer_db', name: 'Customer Database', type: 'SQL Server', records: '2.5M', description: 'Primary customer data including demographics, accounts, and transactions' },
  { id: 'risk_analytics', name: 'Risk Analytics Warehouse', type: 'Azure Synapse', records: '850K', description: 'Risk profiles, credit scores, and behavioral analytics' },
  { id: 'transaction_logs', name: 'Transaction Logs', type: 'Data Lake', records: '15.2M', description: 'Real-time transaction data and payment histories' },
  { id: 'kyc_documents', name: 'KYC Document Store', type: 'Blob Storage', records: '500K', description: 'Identity verification documents and compliance data' }
];

const SCHEMAS = {
  customer_db: [
    { name: 'customers', description: 'Core customer information', fields: 25 },
    { name: 'accounts', description: 'Banking account details', fields: 18 },
    { name: 'demographics', description: 'Customer demographic data', fields: 12 },
    { name: 'preferences', description: 'Customer preferences and settings', fields: 8 }
  ],
  risk_analytics: [
    { name: 'risk_profiles', description: 'Customer risk assessments', fields: 15 },
    { name: 'credit_scores', description: 'Credit scoring data', fields: 10 },
    { name: 'behavioral_data', description: 'Behavioral analytics', fields: 22 }
  ],
  transaction_logs: [
    { name: 'transactions', description: 'Transaction records', fields: 20 },
    { name: 'payments', description: 'Payment processing data', fields: 16 },
    { name: 'transfers', description: 'Money transfer records', fields: 14 }
  ],
  kyc_documents: [
    { name: 'identity_docs', description: 'Identity verification files', fields: 8 },
    { name: 'compliance_records', description: 'Regulatory compliance data', fields: 12 }
  ]
};

export default function ExternalDataSharingInterface() {
  const [currentView, setCurrentView] = useState<'overview' | 'create' | 'configure' | 'monitor' | 'tokenize'>('overview');
  const [dataFields, setDataFields] = useState<DataField[]>(MOCK_DATA_FIELDS);
  const [sharingRequests] = useState<SharingRequest[]>(MOCK_SHARING_REQUESTS);
  const [sharingConfig, setSharingConfig] = useState<DataSharingConfig>({
    pattern: 'sharing',
    recipients: [],
    tokenizationLevel: 'Partial',
    encryptionEnabled: true,
    accessControl: 'Token-Based',
    auditTrail: true
  });
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [showTokenizedData, setShowTokenizedData] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [llmTokenizationResult, setLlmTokenizationResult] = useState<string>('');
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [selectedSchema, setSelectedSchema] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientOrganization, setRecipientOrganization] = useState<string>('');
  const [shareName, setShareName] = useState<string>('');
  const [shareDescription, setShareDescription] = useState<string>('');
  const [isCreatingShare, setIsCreatingShare] = useState(false);
  const [shareCreated, setShareCreated] = useState(false);

  // Workflow functions
  const handleCreateShare = async () => {
    setIsCreatingShare(true);
    
    // Simulate API call to create share
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Send email notification
    const emailContent = `
Dear ${recipientOrganization} Team,

You have been invited to access a secure data share: "${shareName}"

Description: ${shareDescription}
Data Source: ${DATA_SOURCES.find(ds => ds.id === selectedDataSource)?.name}
Schema: ${selectedSchema}
Tokenization: ${sharingConfig.tokenizationLevel}
Access Control: ${sharingConfig.accessControl}

To access this data share, please click the secure link below:
https://datashare.prudential.com/shares/${Date.now()}/access?token=${Math.random().toString(36).substring(2, 15)}

This link expires in 7 days for security purposes.

Best regards,
FSI AI Hub - Data Sharing Team
Powered by PRUDENTIAL
    `;
    
    // Simulate sending email
    console.log('Email sent to:', recipientEmail);
    console.log('Email content:', emailContent);
    
    setShareCreated(true);
    setIsCreatingShare(false);
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setSelectedDataSource('');
    setSelectedSchema('');
    setRecipientEmail('');
    setRecipientOrganization('');
    setShareName('');
    setShareDescription('');
    setShareCreated(false);
    setSelectedFields([]);
  };

  // LLM-powered tokenization
  const handleLlmTokenization = async () => {
    setIsTokenizing(true);
    try {
      const selectedData = dataFields.filter(field => selectedFields.includes(field.name));
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert data privacy and tokenization specialist. Your role is to create secure, compliant tokenized versions of sensitive data while maintaining analytical utility.

**Tokenization Guidelines:**
- PII Data: Use format-preserving tokens that maintain data type structure
- Financial Data: Preserve numerical ranges while obscuring exact values
- Behavioral Data: Create semantic tokens that preserve insights
- Generate reversible tokens using consistent patterns
- Ensure GDPR, CCPA, and financial services compliance
- Maintain referential integrity across related fields

**Token Format Standards:**
- PII: [TYPE]_TOKEN_[ALPHANUMERIC]
- Financial: [TYPE]_TOKEN_[ALPHANUMERIC] 
- Preserve data relationships and analytical patterns
- Include token mapping for reversibility

**Output Format:**
Provide tokenized data in JSON format with original-to-token mappings and compliance notes.`
            },
            {
              role: 'user',
              content: `Tokenize the following sensitive data fields for secure external sharing:

${selectedData.map(field => `${field.name} (${field.type}, ${field.sensitivity}): ${field.originalValue}`).join('\n')}

Requirements:
- Maintain analytical utility for ${sharingConfig.pattern} pattern
- ${sharingConfig.tokenizationLevel} tokenization level
- Compliance with financial services regulations
- Preserve data relationships for cross-field analysis`
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setLlmTokenizationResult(aiResponse);

      // Apply AI-generated tokens to selected fields
      setDataFields(prev => prev.map(field => {
        if (selectedFields.includes(field.name)) {
          return { ...field, isTokenized: true };
        }
        return field;
      }));

    } catch (error) {
      console.error('Tokenization error:', error);
    }
    setIsTokenizing(false);
  };

  const toggleFieldTokenization = (fieldName: string) => {
    setDataFields(prev => prev.map(field => 
      field.name === fieldName 
        ? { ...field, isTokenized: !field.isTokenized }
        : field
    ));
  };

  const toggleFieldSelection = (fieldName: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldName) 
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PII': return 'text-purple-600 bg-purple-50';
      case 'Financial': return 'text-blue-600 bg-blue-50';
      case 'Behavioral': return 'text-green-600 bg-green-50';
      case 'Demographic': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaShieldAlt className="text-blue-600" />
              External Data Sharing & Tokenization
            </h1>
            <p className="text-gray-600 mt-1">Secure data sharing with advanced tokenization and privacy controls</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Powered by</span>
            <span className="text-xs font-semibold text-gray-700 opacity-60">PRUDENTIAL</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
        <nav className="flex space-x-8">
          {[
            { key: 'overview', label: 'Overview', icon: FaChartLine },
            { key: 'create', label: 'Create Share', icon: FaPlus },
            { key: 'tokenize', label: 'Tokenization', icon: FaShieldAlt },
            { key: 'configure', label: 'Configuration', icon: FaCog },
            { key: 'monitor', label: 'Monitoring', icon: FaUserShield }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCurrentView(key as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                currentView === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        {currentView === 'overview' && (
          <div className="space-y-6">
            {/* Data Sharing Patterns */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FaNetworkWired className="text-blue-600" />
                Data Sharing Patterns
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Data Sharing 1:1 */}
                <div className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  sharingConfig.pattern === 'sharing' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-green-200'
                }`} onClick={() => setSharingConfig(prev => ({ ...prev, pattern: 'sharing' }))}>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <FaExchangeAlt className="text-green-600 text-2xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Data Sharing</h4>
                    <p className="text-sm text-gray-600">1:1</p>
                  </div>
                  <p className="text-sm text-gray-700 text-center">
                    One party shares data with another party
                  </p>
                </div>

                {/* Data Distribution 1:N */}
                <div className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  sharingConfig.pattern === 'distribution' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-green-200'
                }`} onClick={() => setSharingConfig(prev => ({ ...prev, pattern: 'distribution' }))}>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <FaShare className="text-green-600 text-2xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Data Distribution</h4>
                    <p className="text-sm text-gray-600">1:N</p>
                  </div>
                  <p className="text-sm text-gray-700 text-center">
                    One party shares the same data set with multiple parties
                  </p>
                </div>

                {/* Data Collaborative N:1 */}
                <div className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  sharingConfig.pattern === 'collaborative' 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-green-200'
                }`} onClick={() => setSharingConfig(prev => ({ ...prev, pattern: 'collaborative' }))}>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <FaUsers className="text-green-600 text-2xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Data Collaborative</h4>
                    <p className="text-sm text-gray-600">N:1</p>
                  </div>
                  <p className="text-sm text-gray-700 text-center">
                    Parties contribute vendor data to a collaborative data lake secured by a custodian
                  </p>
                </div>
              </div>
            </div>

            {/* Active Sharing Requests */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Active Sharing Requests
                </h3>
                <button
                  onClick={() => setCurrentView('create')}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-blue-100 transition-colors flex items-center gap-2 relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"></div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <FaPlus size={12} />
                    Create New Share
                  </div>
                </button>
              </div>
              
              <div className="space-y-3">
                {sharingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        request.status === 'Active' ? 'bg-green-500' :
                        request.status === 'Pending' ? 'bg-yellow-500' :
                        request.status === 'Completed' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{request.recipient}</div>
                        <div className="text-sm text-gray-600">
                          {request.dataFields} fields • {request.tokenizedFields} tokenized • {request.pattern}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'Active' ? 'bg-green-100 text-green-800' :
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </div>
                      {request.expiresAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expires: {request.expiresAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'create' && (
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-gray-900">Create Data Share</h3>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium relative ${
                        currentStep >= step ? 'bg-blue-50 text-blue-700' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep >= step && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-blue-50"></div>
                          </div>
                        )}
                        <div className="relative">
                          {currentStep > step ? <FaCheck size={12} /> : step}
                        </div>
                      </div>
                      {step < 5 && (
                        <div className={`w-12 h-0.5 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Step 1: Select Data Source</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DATA_SOURCES.map((source) => (
                        <div
                          key={source.id}
                          onClick={() => setSelectedDataSource(source.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedDataSource === source.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              {source.type.includes('SQL') ? <FaServer className="text-black" /> :
                               source.type.includes('Synapse') ? <FaDatabase className="text-black" /> :
                               source.type.includes('Lake') ? <FaCloud className="text-black" /> :
                               <FaFileAlt className="text-black" />}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{source.name}</h5>
                              <p className="text-sm text-gray-600 mb-1">{source.type}</p>
                              <p className="text-xs text-gray-500">{source.records} records</p>
                              <p className="text-sm text-gray-700 mt-2">{source.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedDataSource && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Step 2: Select Schema/Table</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SCHEMAS[selectedDataSource as keyof typeof SCHEMAS]?.map((schema) => (
                        <div
                          key={schema.name}
                          onClick={() => setSelectedSchema(schema.name)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedSchema === schema.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                              <FaTable className="text-black" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{schema.name}</h5>
                              <p className="text-sm text-gray-600 mb-1">{schema.fields} fields</p>
                              <p className="text-sm text-gray-700">{schema.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Step 3: Configure Security & Tokenization</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tokenization Level</label>
                      <select 
                        value={sharingConfig.tokenizationLevel}
                        onChange={(e) => setSharingConfig(prev => ({ ...prev, tokenizationLevel: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="None">No Tokenization - Raw Data</option>
                        <option value="Partial">Partial Tokenization - PII Only</option>
                        <option value="Full">Full Tokenization - All Sensitive Data</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Access Control</label>
                      <select 
                        value={sharingConfig.accessControl}
                        onChange={(e) => setSharingConfig(prev => ({ ...prev, accessControl: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Token-Based">Token-Based Access</option>
                        <option value="Role-Based">Role-Based Access</option>
                        <option value="Time-Limited">Time-Limited Access (7 days)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sharingConfig.encryptionEnabled}
                        onChange={(e) => setSharingConfig(prev => ({ ...prev, encryptionEnabled: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable end-to-end encryption</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sharingConfig.auditTrail}
                        onChange={(e) => setSharingConfig(prev => ({ ...prev, auditTrail: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable audit trail</span>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Step 4: Recipient Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaBuilding className="inline mr-1" />
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={recipientOrganization}
                        onChange={(e) => setRecipientOrganization(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Prudential Insurance"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-1" />
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="data.team@prudential.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Share Name</label>
                    <input
                      type="text"
                      value={shareName}
                      onChange={(e) => setShareName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Customer Risk Analytics Q4 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={shareDescription}
                      onChange={(e) => setShareDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the purpose and contents of this data share..."
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Step 5: Review & Create</h4>
                  
                  {shareCreated ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-green-600 text-2xl" />
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Data Share Created Successfully!</h5>
                      <p className="text-gray-600 mb-4">
                        An invitation email has been sent to <strong>{recipientEmail}</strong>
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        The recipient will receive a secure link to access the data share.
                      </p>
                      <button
                        onClick={resetWorkflow}
                        className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-blue-100 transition-colors flex items-center gap-2 relative"
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                          <div className="w-full h-full rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"></div>
                        </div>
                        <div className="relative">
                          Create Another Share
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h5 className="font-medium text-gray-900 mb-4">Share Summary</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Data Source:</span>
                            <span className="ml-2 font-medium">{DATA_SOURCES.find(ds => ds.id === selectedDataSource)?.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Schema:</span>
                            <span className="ml-2 font-medium">{selectedSchema}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tokenization:</span>
                            <span className="ml-2 font-medium">{sharingConfig.tokenizationLevel}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Access Control:</span>
                            <span className="ml-2 font-medium">{sharingConfig.accessControl}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Recipient:</span>
                            <span className="ml-2 font-medium">{recipientOrganization}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2 font-medium">{recipientEmail}</span>
                          </div>
                        </div>
                        {shareDescription && (
                          <div className="mt-4">
                            <span className="text-gray-600">Description:</span>
                            <p className="mt-1 text-gray-900">{shareDescription}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={handleCreateShare}
                          disabled={isCreatingShare}
                          className="px-8 py-3 bg-blue-50 text-blue-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative"
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"></div>
                          </div>
                          <div className="relative flex items-center gap-2">
                            {isCreatingShare ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Creating Share...
                              </>
                            ) : (
                              <>
                                <FaShare />
                                Create Data Share & Send Invitation
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {!shareCreated && (
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaArrowLeft size={12} />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                    disabled={
                      currentStep === 5 ||
                      (currentStep === 1 && !selectedDataSource) ||
                      (currentStep === 2 && !selectedSchema) ||
                      (currentStep === 4 && (!recipientEmail || !recipientOrganization || !shareName))
                    }
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"></div>
                    </div>
                    <div className="relative flex items-center gap-2">
                      Next
                      <FaArrowRight size={12} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentView === 'tokenize' && (
          <div className="space-y-6">
            {/* LLM Tokenization Controls */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaRobot className="text-blue-600" />
                AI-Powered Tokenization
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tokenization Level</label>
                  <select 
                    value={sharingConfig.tokenizationLevel}
                    onChange={(e) => setSharingConfig(prev => ({ ...prev, tokenizationLevel: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="None">No Tokenization</option>
                    <option value="Partial">Partial Tokenization</option>
                    <option value="Full">Full Tokenization</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Control</label>
                  <select 
                    value={sharingConfig.accessControl}
                    onChange={(e) => setSharingConfig(prev => ({ ...prev, accessControl: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Token-Based">Token-Based Access</option>
                    <option value="Role-Based">Role-Based Access</option>
                    <option value="Time-Limited">Time-Limited Access</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleLlmTokenization}
                  disabled={selectedFields.length === 0 || isTokenizing}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"></div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    {isTokenizing ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                    {isTokenizing ? 'Tokenizing...' : 'Generate AI Tokens'}
                  </div>
                </button>
                
                <button
                  onClick={() => setShowTokenizedData(!showTokenizedData)}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full border-2 border-transparent bg-clip-padding hover:bg-gray-100 flex items-center gap-2 relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"></div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    {showTokenizedData ? <FaEyeSlash /> : <FaEye />}
                    {showTokenizedData ? 'Hide Tokens' : 'Show Tokens'}
                  </div>
                </button>
              </div>
              
              {llmTokenizationResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">AI Tokenization Result:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">{llmTokenizationResult}</pre>
                </div>
              )}
            </div>

            {/* Data Fields Table */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaDatabase className="text-blue-600" />
                Data Fields & Tokenization
              </h3>
              
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedFields.length === dataFields.length}
                          onChange={(e) => setSelectedFields(e.target.checked ? dataFields.map(f => f.name) : [])}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Field Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sensitivity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Original Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tokenized Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFields.map((field, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field.name)}
                            onChange={() => toggleFieldSelection(field.name)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{field.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(field.type)}`}>
                            {field.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSensitivityColor(field.sensitivity)}`}>
                            {field.sensitivity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {showTokenizedData || !field.isTokenized ? field.originalValue : '••••••••'}
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-mono text-sm">
                          {field.tokenizedValue && (showTokenizedData || field.isTokenized) ? field.tokenizedValue : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center gap-1 ${field.isTokenized ? 'text-green-600' : 'text-gray-600'}`}>
                            {field.isTokenized ? <FaLock size={12} /> : <FaUnlock size={12} />}
                            {field.isTokenized ? 'Tokenized' : 'Original'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleFieldTokenization(field.name)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {field.isTokenized ? 'Revert' : 'Tokenize'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'configure' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Configuration Panel</h3>
            <p className="text-gray-600">Advanced configuration options coming soon...</p>
          </div>
        )}
        
        {currentView === 'monitor' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monitoring Dashboard</h3>
            <p className="text-gray-600">Real-time monitoring and audit trails coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
