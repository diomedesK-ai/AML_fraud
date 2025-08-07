import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPhone, 
  FaClock, 
  FaUsers, 
  FaCheckCircle, 
  FaStar, 
  FaPhoneSlash, 
  FaHeadset,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaPaperPlane,
  FaBook,
  FaFileAlt,
  FaTimes,
  FaMicrophone,
  FaSearch
} from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  suffix?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, suffix = '' }) => {
  const isPositive = change > 0;
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="text-gray-700">
                {icon}
              </div>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-gray-500'}`}>
          {isPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-medium mb-1">{title}</h3>
        <p className="text-2xl font-light text-gray-900">{value}{suffix}</p>
      </div>
    </div>
  );
};

interface AgentCardProps {
  name: string;
  status: 'available' | 'busy' | 'away';
  callsHandled: number;
  avgCallTime: string;
  rating: number;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, status, callsHandled, avgCallTime, rating }) => {
  const statusConfig = {
    available: { color: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500' },
    busy: { color: 'border-gray-200 bg-gray-50', dot: 'bg-gray-400' },
    away: { color: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500' }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-gray-700 font-medium text-xs">{name.split(' ').map(n => n[0]).join('')}</span>
              </div>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusConfig[status].dot} rounded-full border border-white`}></div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[status].color} text-gray-600`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
            <FaStar className="text-white" size={6} />
          </div>
          <span className="text-xs font-medium text-gray-700">{rating}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-gray-400 font-medium text-xs">Calls Today</span>
          <p className="font-semibold text-gray-900 text-sm">{callsHandled}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium text-xs">Avg Time</span>
          <p className="font-semibold text-gray-900 text-sm">{avgCallTime}</p>
        </div>
      </div>
    </div>
  );
};

const ContactCenterDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '**Welcome to the Documentation Assistant!**\n\nI can help you with:\n• Product information and specifications\n• Policy details and procedures\n• Customer support best practices\n• Troubleshooting guidance\n\nHow can I assist you today?', timestamp: '2:30 PM' }
  ]);
  const [loading, setLoading] = useState(false);

  // Function to render markdown content
  const renderMarkdown = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none text-xs leading-tight">
        {content.split('\n').map((line, idx) => {
          // Handle headers (## or **)
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="text-sm font-bold text-gray-900 mt-3 mb-2 border-l-4 border-blue-500 pl-3">{line.replace('## ', '')}</h3>;
          }
          // Handle bold headers
          else if (line.startsWith('**') && line.endsWith('**')) {
            return <div key={idx} className="font-semibold text-gray-800 text-xs leading-tight mb-1">{line.replace(/\*\*/g, '')}</div>;
          }
          // Handle bold text inline
          else if (line.includes('**')) {
            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return <div key={idx} className="text-gray-700 text-xs leading-tight mb-1">
              {parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <span key={partIdx} className="font-semibold">{part.replace(/\*\*/g, '')}</span>;
                }
                return part;
              })}
            </div>;
          }
          // Handle bullet points
          else if (line.startsWith('• ') || line.startsWith('- ')) {
            const text = line.replace(/^[•-]\s/, '');
            return <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
              <span className="text-blue-500 mt-0.5 text-xs">•</span>
              <span className="text-gray-700 text-xs">{text}</span>
            </div>;
          }
          // Handle numbered lists
          else if (/^\d+\.\s/.test(line)) {
            return <div key={idx} className="mb-1 ml-4 text-gray-700 text-xs">{line}</div>;
          }
          // Handle links
          else if (line.trim()) {
            const linkRegex = /(https?:\/\/[^\s\)\]]+)/g;
            if (linkRegex.test(line)) {
              const parts = line.split(linkRegex);
              return <div key={idx} className="text-gray-700 mb-1 leading-relaxed text-xs">
                {parts.map((part, partIdx) => 
                  linkRegex.test(part) ? 
                    <a key={partIdx} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all text-xs bg-blue-50 px-1 py-0.5 rounded">{part}</a> : 
                    part
                )}
              </div>;
            }
            return <div key={idx} className="text-gray-700 text-xs leading-tight mb-1">{line}</div>;
          }
          // Handle empty lines
          else if (line.trim() === '') {
            return <div key={idx} className="mb-1"></div>;
          }
          return null;
        })}
      </div>
    );
  };
  
  // Call functionality states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTranscript, setCallTranscript] = useState<string>('');
  const [isSessionReady, setIsSessionReady] = useState(false);
  
  // WebRTC refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  
  // Custom prompt for Contact Center
  const customPrompt = `You are an AI Assistant for a Contact Center environment. You help agents with:

1. PRODUCT INFORMATION: Provide detailed information about company products, features, pricing, and specifications
2. POLICY ASSISTANCE: Help with company policies, procedures, and guidelines
3. CUSTOMER SUPPORT: Assist with troubleshooting, escalation procedures, and best practices
4. DOCUMENTATION: Search through knowledge bases and documentation
5. REAL-TIME SUPPORT: Provide quick answers during live customer interactions

Be professional, concise, and helpful. Always prioritize accuracy and provide actionable information for contact center agents.`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle realtime events
  const handleRealtimeEvent = (event: any) => {
    if (event.type === 'response.audio_transcript.delta') {
      setCallTranscript(prev => prev + event.delta);
    } else if (event.type === 'session.created') {
      setIsSessionReady(true);
    }
  };

  // Send message using OpenAI Responses API
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((msgs) => [...msgs, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setLoading(true);
    
    try {
      const webRes = await fetch('/api/openai-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${customPrompt}

User Query: ${currentInput}

Please provide a helpful response for the contact center agent.`,
          stream: true
        }),
      });
      
      if (!webRes.ok) {
        throw new Error(`HTTP error! status: ${webRes.status}`);
      }

      const reader = webRes.body?.getReader();
      const decoder = new TextDecoder();
      let responseContent = '';

      const responseMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((msgs) => [...msgs, responseMessage]);

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.delta) {
                    responseContent += data.delta;
                    setMessages((msgs) => {
                      const newMessages = [...msgs];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage && lastMessage.role === 'assistant') {
                        lastMessage.content = responseContent;
                      }
                      return newMessages;
                    });
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((msgs) => [...msgs, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Start call functionality
  const startCall = async () => {
    try {
      setIsCallActive(true);
      setCallDuration(0);
      setCallTranscript('');
      setIsSessionReady(false);

      // Get ephemeral token from our API
      const tokenResponse = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompt
        }),
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get ephemeral token');
      }
      
      const tokenData = await tokenResponse.json();
      const EPHEMERAL_KEY = tokenData.client_secret.value;

      // Create a peer connection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Set up to play remote audio from the model
      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElementRef.current = audioElement;
      
      pc.ontrack = (e) => {
        audioElement.srcObject = e.streams[0];
      };

      // Add local audio track for microphone input
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      mediaStreamRef.current = mediaStream;
      pc.addTrack(mediaStream.getTracks()[0]);

      // Set up data channel for sending and receiving events
      const dataChannel = pc.createDataChannel('oai-events');
      dataChannelRef.current = dataChannel;

      dataChannel.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          handleRealtimeEvent(event);
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      });

      // Start the session using the Session Description Protocol (SDP)
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`SDP request failed: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: answerSdp,
      };
      
      await pc.setRemoteDescription(answer);
      
      // Set session ready after connection is established
      setTimeout(() => {
        setIsSessionReady(true);
      }, 1000); // Small delay to ensure audio streams are fully connected

    } catch (error) {
      console.error('Error starting call:', error);
      setIsCallActive(false);
      setIsSessionReady(false);
    }
  };

  // End call functionality
  const endCall = () => {
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Stop all media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clean up audio element
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
      audioElementRef.current = null;
    }

    setIsCallActive(false);
    setIsSessionReady(false);
    
    // Add call ended message to chat
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🎙️ Voice call ended.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Mock real-time data - in production this would come from your backend
  const kpis = [
    {
      title: 'Active Calls',
      value: 23,
      change: 12,
      icon: <FaPhone size={14} />
    },
    {
      title: 'Avg Wait Time',
      value: '2:34',
      change: -18,
      icon: <FaClock size={14} />
    },
    {
      title: 'Available Agents',
      value: 15,
      change: 5,
      icon: <FaHeadset size={14} />
    },
    {
      title: 'Resolution Rate',
      value: 94,
      change: 3,
      icon: <FaCheckCircle size={14} />,
      suffix: '%'
    },
    {
      title: 'NSAT Score',
      value: 4.8,
      change: 2,
      icon: <FaStar size={14} />,
      suffix: '/5'
    },
    {
      title: 'Missed Calls',
      value: 3,
      change: -45,
      icon: <FaPhoneSlash size={14} />
    }
  ];

  const agents = [
    { name: 'Sarah Johnson', status: 'available' as const, callsHandled: 12, avgCallTime: '4:23', rating: 4.9 },
    { name: 'Mike Chen', status: 'busy' as const, callsHandled: 18, avgCallTime: '3:45', rating: 4.7 },
    { name: 'Emma Wilson', status: 'away' as const, callsHandled: 9, avgCallTime: '5:12', rating: 4.8 }
  ];

  const queueItems = [
    { id: 1, customer: 'Customer #1247', waitTime: '0:45', priority: 'High', category: 'Technical Support' },
    { id: 2, customer: 'Customer #1248', waitTime: '1:23', priority: 'Medium', category: 'Billing Inquiry' },
    { id: 3, customer: 'Customer #1249', waitTime: '2:01', priority: 'Low', category: 'General Questions' },
    { id: 4, customer: 'Customer #1250', waitTime: '0:12', priority: 'High', category: 'Account Access' }
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Contact Center</h1>
            <p className="text-gray-500 text-sm">Real-time monitoring and analytics</p>
          </div>
                    <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Current Time</p>
              <p className="text-sm font-medium text-gray-900">{currentTime.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex items-center justify-center px-2 py-1.5 rounded-lg text-sm font-medium transition-colors text-green-600 hover:text-green-700"
              title="Voice Call"
            >
              <FaPhone size={14} />
            </button>
            <button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className={`flex items-center justify-center px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isRealTimeActive 
                  ? 'text-emerald-600 hover:text-emerald-700' 
                  : 'text-gray-600 hover:text-gray-700'
              }`}
              title={isRealTimeActive ? 'Live' : 'Paused'}
            >
              {isRealTimeActive ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Call Queue */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Call Queue</h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {queueItems.length} waiting
              </span>
            </div>
            <div className="space-y-3">
              {queueItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.priority === 'High' ? 'bg-red-500' :
                      item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.customer}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-sm">{item.waitTime}</p>
                    <p className="text-xs text-gray-500">{item.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white border-2 border-blue-300 hover:border-blue-500 text-blue-700 hover:text-blue-800 p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:shadow-sm">
                Manual Call Distribution
              </button>
              <button className="w-full bg-white border-2 border-green-300 hover:border-green-500 text-green-700 hover:text-green-800 p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-green-50 hover:shadow-lg hover:shadow-green-200/50">
                Send WhatsApp
              </button>
              <button className="w-full bg-white border-2 border-blue-300 hover:border-blue-500 text-blue-700 hover:text-blue-800 p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:shadow-sm">
                Send OTP
              </button>
              <button className="w-full bg-white border-2 border-red-300 hover:border-red-500 text-red-700 hover:text-red-800 p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50 hover:shadow-lg hover:shadow-red-200/50">
                Emergency Escalation
              </button>
              <button className="w-full bg-white border-2 border-blue-300 hover:border-blue-500 text-blue-700 hover:text-blue-800 p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:shadow-sm">
                Broadcast Message
              </button>
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agent Status</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Available: {agents.filter(a => a.status === 'available').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">Busy: {agents.filter(a => a.status === 'busy').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Away: {agents.filter(a => a.status === 'away').length}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        </div>

        {/* Product & Policy Chat Assistant */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-4xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <FaBook className="text-white" size={12} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Documentation Assistant</h2>
                <p className="text-xs text-gray-500">Quick access to products & policies</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
          
          <div className="h-40 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.role === 'user' ? (
                    <p className="text-white text-xs">{message.content}</p>
                  ) : (
                    <div className="text-gray-900">
                      {message.content.includes('🔍 **Search Results:**') ? (
                        <div className="space-y-2 text-sm">
                          <div className="font-medium text-blue-600 mb-2 flex items-center gap-2 pb-2 border-b border-blue-100 text-sm">
                            <FaSearch size={12} />
                            Search Results
                          </div>
                          {renderMarkdown(message.content.replace('🔍 **Search Results:**\n\n', ''))}
                        </div>
                      ) : (
                        renderMarkdown(message.content)
                      )}
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about products, policies, procedures..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 w-full"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    handleSend();
                  }
                }}
              />
              <button 
                onClick={handleSend}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FaFileAlt size={10} />
                Policies
              </span>
              <span className="flex items-center gap-1">
                <FaBook size={10} />
                Products
              </span>
              <span>Powered by AI Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Call Modal */}
      {showPhoneModal && (
        <div className="fixed top-20 right-6 z-50">
          <div className="backdrop-blur-xl rounded-xl p-6 w-80 shadow-2xl border border-white/30 relative"
            style={{
              background: 'rgba(255,255,255,0.9)'
            }}>
            {/* Call Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-blue-500 font-semibold text-sm">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-700">AI Contact Center</h3>
                  <p className="text-xs text-gray-600">
                    {isCallActive ? formatDuration(callDuration) : 'Ready'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Call Status & Controls */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex items-center gap-3">
                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="w-11 h-11 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Start Call"
                  >
                    <FaPhone size={14} />
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                    <button
                      onClick={endCall}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="End Call"
                    >
                      <FaPhoneSlash size={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Session Ready Indicator */}
              {isCallActive && (
                <div className="flex items-center gap-2 text-xs">
                  {isSessionReady ? (
                    <>
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <FaMicrophone className="text-white" size={10} />
                        </div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-blue-600 font-medium">Ready to speak</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-orange-600 font-medium">Connecting...</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Voice Activity Bars */}
            {isCallActive && (
              <div className="flex justify-center items-center gap-1 mb-4 h-12">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-white/60 rounded-full animate-pulse`}
                    style={{
                      height: `${[16, 24, 32, 20, 12][i]}px`,
                      animationDelay: `${i * 200}ms`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Call Transcript */}
            {isCallActive && callTranscript && (
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <h4 className="text-xs font-medium text-white/80 mb-2">Live Transcript:</h4>
                <p className="text-xs text-white/60">{callTranscript}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactCenterDashboard; 