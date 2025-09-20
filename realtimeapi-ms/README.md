# 🔍 AML Fraud Detection Interface

A sophisticated Anti-Money Laundering (AML) fraud detection system built with Next.js, featuring real-time monitoring, AI-powered analysis, and professional executive-style interface design.

## 🌟 Key Features

### 🎯 **Real-Time AML Monitoring**
- **Live Activity Feed** with expandable functionality (310px/510px heights)
- **Agent Collaboration Queue** with multi-agent review workflows
- **Network Graph Visualization** with 70+ nodes and realistic connections
- **Dynamic Risk Assessment** with confidence scoring

### 🤖 **AI-Powered Analysis**
- **OpenAI Integration** with streaming chat responses
- **6 Cluster Analysis Patterns** with detailed detection modals
- **Transaction Flow Pattern Detection** with clickable insights
- **Multi-Agent Collaboration** with specialized AML agents

### 📊 **Professional Dashboard**
- **Executive-Style Interface** - Clean, professional design with minimal colors
- **Responsive Layout** - Optimized for tablets and desktop viewing
- **Scrollable Components** - Full page scrollability with proper overflow handling
- **Real-Time Updates** - Live data feeds with smooth transitions

## 🏗️ Architecture

### **Frontend Stack**
- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Professional iconography

### **AI Integration**
- **OpenAI GPT-4** - Advanced language model for chat responses
- **Streaming API** - Real-time response generation
- **Markdown Rendering** - Rich text formatting for AI responses

### **Components Structure**
```
src/
├── components/
│   ├── AMLInterface.tsx          # Main AML dashboard
│   ├── MarkdownRenderer.tsx      # Chat markdown rendering
│   ├── BancassuranceInterface.tsx # Reference chat interface
│   └── ...
├── app/
│   ├── api/
│   │   ├── chat/route.ts         # OpenAI chat integration
│   │   └── ...
│   ├── page.tsx                  # Main application entry
│   └── layout.tsx                # App layout wrapper
└── utils/
    └── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/diomedesK-ai/AML_fraud.git
cd AML_fraud
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Interface Design

### **Design Philosophy**
Following professional executive standards with:
- **Minimal Color Palette** - Professional grey tones only
- **No Decorative Elements** - Clean, business-focused interface  
- **Pill-Style Components** - Consistent rounded button styling
- **Risk Color Coding** - Critical (Red), High (Orange/Yellow), Medium (Blue)

### **Layout Components**

#### **🔴 Risk Distribution Panel**
- Real-time risk metrics with color-coded progress bars
- Percentage breakdowns and flagged transaction counts
- Live data status indicators

#### **🌍 Geographic Risk Analysis** 
- Country-based risk assessment with detailed metrics
- Risk level indicators and transaction volumes
- Regional compliance tracking

#### **📈 Transaction Patterns**
- 4 detailed pattern detection boxes in 2x2 grid
- Clickable patterns with detection modals
- Enhanced metrics and AML-specific insights

#### **🕸️ Network Graph Visualization**
- 70+ account nodes with realistic connections
- Smooth fade transitions for updates
- Interactive cluster analysis with 6 pattern types
- Account codes (ACCxxx) on all nodes
- Risk-based color coding and hub account identification

#### **👥 Agent Status & Collaboration**
- Collapsible agent status section with dropdown
- Multi-agent chat interface with streaming responses
- Agent collaboration queue with review workflows
- Skills and action button styling (white fill, colored borders)

#### **📊 Live Activity Feed**
- Expandable from 5 to 15 items with scroll capability
- Review/Approve pill buttons for human-in-the-loop workflows
- Real-time agent activity with status indicators
- 10-second update intervals for dynamic content

## 🤖 AI Agents & Capabilities

### **Specialized AML Agents**
- **🔍 ML Detector Agent** - Pattern recognition and anomaly detection
- **📊 Risk Analyst Agent** - Risk assessment and scoring
- **📋 SAR Analyst Agent** - Suspicious Activity Report generation
- **🛡️ Compliance Agent** - Regulatory compliance monitoring
- **🔗 Network Analyst Agent** - Transaction network analysis

### **Cluster Analysis Patterns**
1. **High-Risk Structuring** - Sequential deposits under $10K (Critical)
2. **Cross-Border Network** - International wire transfers (High)  
3. **Rapid Movement** - Fast in-out transactions (High)
4. **Shell Network** - Dormant accounts activated (Critical)
5. **Trade-Based Laundering** - Over/under-invoicing schemes (High)
6. **Cryptocurrency Bridge** - Crypto-to-fiat conversions (Critical)

## 🔧 Configuration

### **Environment Variables**
```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Customization Options**
- **Update Intervals** - Modify activity feed refresh rates
- **Node Count** - Adjust network graph complexity
- **Color Themes** - Risk level color customization
- **Agent Configuration** - Add/modify AI agent roles

## 📱 Responsive Design

### **Tablet-First Approach**
- **Container Design** - 90vh height with internal scrolling
- **Component Heights** - Optimized spacing (Network: 585px, Chat: 470px)
- **Breakpoint Support** - Responsive grid layouts
- **Touch-Friendly** - Optimized for tablet interactions

## 🔒 Security Features

### **AML Compliance**
- **SAR Generation** - Automated suspicious activity reporting
- **Risk Scoring** - Multi-factor risk assessment algorithms
- **Audit Trails** - Complete transaction history tracking
- **Regulatory Compliance** - Built-in compliance monitoring

### **Data Protection**
- **API Security** - Secured endpoints with validation
- **Error Handling** - Comprehensive error management
- **Input Validation** - Sanitized user inputs

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance Metrics

### **Build Statistics**
- **Main Bundle Size** - 198 kB (optimized)
- **First Load JS** - 101 kB shared chunks
- **Static Generation** - 10 pages pre-rendered
- **Edge Runtime** - API routes optimized for performance

## 🛠️ Development

### **Code Style**
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent code formatting

### **Component Guidelines**
- **Functional Components** - React hooks pattern
- **State Management** - useState for local state
- **Event Handling** - Proper event delegation
- **Accessibility** - ARIA labels and semantic HTML

## 📈 Roadmap

### **Upcoming Features**
- [ ] Enhanced machine learning models
- [ ] Advanced visualization options  
- [ ] Mobile app companion
- [ ] Multi-tenant support
- [ ] Advanced reporting dashboard
- [ ] Integration with external AML systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **GitHub Issues** - [Report bugs or request features](https://github.com/diomedesK-ai/AML_fraud/issues)
- **Documentation** - Check this README for detailed information
- **Email Support** - Contact the development team

## 🙏 Acknowledgments

- **OpenAI** - For providing advanced language model capabilities
- **Next.js Team** - For the excellent React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For the comprehensive icon library

---

**Built with ❤️ for professional AML compliance and fraud detection**

*Last updated: September 2025*
