// Wealth Advisor Scenarios and Customer Profiles for Private Banking

export interface CustomerProfile {
  name: string;
  age: number;
  netWorth: string;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentGoals: string[];
  currentPortfolio: {
    stocks: number;
    bonds: number;
    realEstate: number;
    alternatives: number;
    cash: number;
  };
  annualIncome: string;
  timeHorizon: string;
  specialConsiderations: string[];
}

export const CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    name: "Alexandra Chen",
    age: 45,
    netWorth: "$2.8M",
    riskTolerance: "Moderate",
    investmentGoals: ["Retirement planning", "Children's education", "Tax optimization"],
    currentPortfolio: {
      stocks: 55,
      bonds: 25,
      realEstate: 15,
      alternatives: 3,
      cash: 2
    },
    annualIncome: "$450K",
    timeHorizon: "20 years",
    specialConsiderations: ["Stock options vesting", "International tax implications", "Estate planning needs"]
  },
  {
    name: "Robert Williams",
    age: 62,
    netWorth: "$8.5M",
    riskTolerance: "Conservative",
    investmentGoals: ["Capital preservation", "Income generation", "Legacy planning"],
    currentPortfolio: {
      stocks: 35,
      bonds: 45,
      realEstate: 12,
      alternatives: 5,
      cash: 3
    },
    annualIncome: "$280K",
    timeHorizon: "15 years",
    specialConsiderations: ["Recent inheritance", "Healthcare cost planning", "Charitable giving strategy"]
  },
  {
    name: "Sofia Rodriguez",
    age: 38,
    netWorth: "$4.2M",
    riskTolerance: "Aggressive",
    investmentGoals: ["Wealth accumulation", "Business expansion", "Alternative investments"],
    currentPortfolio: {
      stocks: 70,
      bonds: 10,
      realEstate: 8,
      alternatives: 10,
      cash: 2
    },
    annualIncome: "$650K",
    timeHorizon: "25 years",
    specialConsiderations: ["Entrepreneur - irregular income", "International business interests", "ESG investing preferences"]
  }
];

export const WEALTH_ADVISOR_SCENARIOS = {
  // Portfolio Rebalancing Scenarios
  rebalancing: [
    {
      trigger: "Market volatility has caused portfolio drift",
      situation: "Your equity allocation has grown to 75% due to strong market performance, above your target of 60%",
      opportunities: [
        "Rebalance to capture gains and reduce risk",
        "Consider tax-loss harvesting opportunities",
        "Evaluate defensive positioning strategies"
      ],
      crossSell: ["Tax-managed investment solutions", "Alternative investment products", "Risk management services"]
    },
    {
      trigger: "Interest rate environment change",
      situation: "Rising rates present opportunities in fixed income and real estate sectors",
      opportunities: [
        "Extend duration in bond portfolio",
        "Consider real estate investment trusts",
        "Evaluate floating rate instruments"
      ],
      crossSell: ["Private credit investments", "Real estate investment platforms", "Interest rate hedging products"]
    }
  ],

  // Cross-sell/Upsell Scenarios
  crossSell: [
    {
      category: "Private Banking Services",
      scenarios: [
        {
          trigger: "Client mentions cash flow management needs",
          pitch: "Our private banking suite includes customized lending solutions, premium banking services, and liquidity management tools",
          products: ["Asset-based lending", "Securities-based lending", "Private banking accounts", "Concierge services"]
        },
        {
          trigger: "Discussion about international investments",
          pitch: "Our global wealth management platform provides access to international markets, currency hedging, and tax-efficient structures",
          products: ["International investment accounts", "Currency hedging", "Offshore structures", "Global custody services"]
        }
      ]
    },
    {
      category: "Alternative Investments",
      scenarios: [
        {
          trigger: "Client seeks portfolio diversification",
          pitch: "Alternative investments can enhance returns and reduce correlation with traditional markets",
          products: ["Private equity funds", "Hedge fund strategies", "Real estate partnerships", "Commodities exposure"]
        },
        {
          trigger: "High net worth client with aggressive risk profile",
          pitch: "Exclusive investment opportunities for qualified investors with enhanced return potential",
          products: ["Pre-IPO investments", "Venture capital funds", "Private real estate deals", "Art and collectibles"]
        }
      ]
    }
  ],

  // Tax Optimization Scenarios
  taxOptimization: [
    {
      strategy: "Tax-loss harvesting",
      description: "Realize losses to offset capital gains while maintaining market exposure",
      implementation: "Systematic review of holdings to identify harvesting opportunities",
      benefit: "Potential tax savings of $50K-$200K annually for high-income clients"
    },
    {
      strategy: "Asset location optimization",
      description: "Place investments in tax-advantaged accounts based on tax characteristics",
      implementation: "Reposition portfolio across taxable and tax-deferred accounts",
      benefit: "Improve after-tax returns by 0.5-1.5% annually"
    },
    {
      strategy: "Charitable giving strategies",
      description: "Tax-efficient philanthropic planning with donor-advised funds and charitable trusts",
      implementation: "Structured giving program with appreciated securities",
      benefit: "Maximize charitable deduction while minimizing tax impact"
    }
  ],

  // Estate Planning Integration
  estatePlanning: [
    {
      scenario: "Wealth transfer planning",
      discussion: "Implementing strategies to transfer wealth to next generation tax-efficiently",
      solutions: ["Grantor trusts", "Family limited partnerships", "Charitable remainder trusts"],
      urgency: "Current favorable tax environment may not persist"
    },
    {
      scenario: "Business succession planning",
      discussion: "Structuring exit strategy for business owners",
      solutions: ["Management buyouts", "ESOP structures", "Strategic sale preparation"],
      urgency: "Advance planning crucial for optimal outcomes"
    }
  ],

  // Risk Management Scenarios
  riskManagement: [
    {
      risk: "Concentration risk",
      identification: "Over 40% of wealth in single stock position",
      mitigation: "Gradual diversification strategy with tax considerations",
      products: ["Exchange funds", "Collar strategies", "Variable prepaid forward contracts"]
    },
    {
      risk: "Longevity risk",
      identification: "Retirement income may not last through extended lifespan",
      mitigation: "Enhanced income planning and healthcare cost preparation",
      products: ["Annuity products", "Long-term care insurance", "Healthcare savings accounts"]
    }
  ]
};

export const CONVERSATION_STARTERS = [
  "I'd like to review my portfolio performance and discuss rebalancing opportunities",
  "I'm concerned about market volatility - how can we protect my wealth?",
  "My business is doing well - I need tax-efficient strategies for the additional income",
  "I received an inheritance and need advice on how to integrate it with my current investments",
  "I'm thinking about early retirement - can we run some scenarios?",
  "I want to establish a trust for my children - what are my options?",
  "The real estate market seems overheated - should I take some profits?",
  "I'm interested in ESG investing - how can we incorporate sustainability into my portfolio?",
  "My stock options are vesting soon - what's the best strategy for exercising them?",
  "I want to increase my charitable giving - what's the most tax-efficient approach?"
];

export function getWealthAdvisorPrompt(): string {
  return `You are an elite Private Wealth Advisor at a premier private bank, serving ultra-high-net-worth clients. You have extensive experience in wealth management, investment strategy, tax optimization, and estate planning.

CRITICAL WEB SEARCH INSTRUCTIONS:
- For ANY current market data, rates, or financial news: ALWAYS use web_search function
- For real-time market conditions, economic indicators, or recent events: ALWAYS search online
- For current interest rates, exchange rates, or commodity prices: ALWAYS use web_search
- For recent regulatory changes or tax law updates: ALWAYS search the web
- When clients ask "what's happening in the markets" or similar: IMMEDIATELY use web_search
- If you don't have current information: ALWAYS offer to search online for real-time data

CLIENT INTERACTION STYLE:
- Professional yet personable approach
- Deep financial expertise with clear explanations
- Proactive identification of opportunities
- Comprehensive wealth management perspective
- Discretionary and confidential handling of sensitive information
- ALWAYS provide current, real-time market information

CORE COMPETENCIES:
- Portfolio construction and rebalancing strategies
- Tax-efficient investment planning
- Estate and succession planning
- Risk management and hedging strategies
- Alternative investment access
- Cross-border wealth management
- Philanthropic planning
- Liquidity management
- Real-time market analysis and insights

CONVERSATION APPROACH:
1. Listen actively to understand client goals and concerns
2. Analyze current situation holistically
3. SEARCH WEB for current market conditions when relevant
4. Present strategic recommendations with clear rationale
5. Identify cross-sell opportunities naturally
6. Address tax implications proactively
7. Consider estate planning integration
8. Provide CURRENT market insights and outlook using web search

PRODUCT KNOWLEDGE:
- Traditional investments (stocks, bonds, funds)
- Alternative investments (private equity, hedge funds, real estate)
- Structured products and derivatives
- Insurance and annuity solutions
- Trust and estate planning tools
- Banking and lending services
- International investment platforms

REGULATORY AWARENESS:
- Maintain fiduciary standards
- Ensure suitable investment recommendations
- Document advice and rationale
- Comply with know-your-customer requirements
- Address potential conflicts of interest transparently

GOAL: Provide comprehensive wealth management advice that enhances client outcomes while identifying appropriate opportunities to expand the banking relationship through relevant product and service recommendations. ALWAYS use current, real-time information via web search when discussing markets, rates, or economic conditions.

Be ready to discuss specific scenarios involving portfolio rebalancing, tax optimization, estate planning, risk management, and wealth transfer strategies. Use CURRENT market insights via web search and demonstrate deep understanding of complex financial situations.`;
}

export function getScenarioPrompt(customerProfile: CustomerProfile): string {
  return `
CURRENT CLIENT PROFILE:
- Name: ${customerProfile.name}
- Age: ${customerProfile.age}
- Net Worth: ${customerProfile.netWorth}
- Annual Income: ${customerProfile.annualIncome}
- Risk Tolerance: ${customerProfile.riskTolerance}
- Investment Goals: ${customerProfile.investmentGoals.join(', ')}
- Time Horizon: ${customerProfile.timeHorizon}

CURRENT PORTFOLIO ALLOCATION:
- Stocks: ${customerProfile.currentPortfolio.stocks}%
- Bonds: ${customerProfile.currentPortfolio.bonds}%
- Real Estate: ${customerProfile.currentPortfolio.realEstate}%
- Alternatives: ${customerProfile.currentPortfolio.alternatives}%
- Cash: ${customerProfile.currentPortfolio.cash}%

SPECIAL CONSIDERATIONS:
${customerProfile.specialConsiderations.map(consideration => `- ${consideration}`).join('\n')}

As their wealth advisor, provide personalized advice considering their specific situation, goals, and constraints. Address their current allocation, suggest optimizations, and identify opportunities for enhanced wealth management services.
`;
}
