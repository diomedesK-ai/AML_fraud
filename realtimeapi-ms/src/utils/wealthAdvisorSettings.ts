export interface WealthAdvisorPromptSettings {
  portfolio: string;
  risk: string;
  tax: string;
  estate: string;
  alternatives: string;
  crosssell: string;
}

export const DEFAULT_WEALTH_ADVISOR_PROMPTS: WealthAdvisorPromptSettings = {
  portfolio: `
# Portfolio Analysis Report

As an elite Private Wealth Advisor, conduct a comprehensive portfolio analysis for **{clientName}**.

## Client Profile
{clientProfile}

## Executive Summary
*Provide a 2-3 sentence overview of key findings and recommendations*

## Current Portfolio Analysis

### Asset Allocation Review
- **Current Allocation**: {allocation}
- **Concentration Analysis**: Identify any overweight positions
- **Geographic Exposure**: Review domestic vs. international allocation
- **Sector Distribution**: Analyze sector concentration risks

### Performance Metrics
- **Risk-Adjusted Returns**: Calculate Sharpe ratio and alpha generation
- **Benchmark Comparison**: Compare against relevant market indices
- **Volatility Analysis**: Review standard deviation and maximum drawdown

## Strategic Recommendations

### 1. Optimal Asset Allocation
| Asset Class | Current % | Target % | Rationale |
|-------------|-----------|----------|-----------|
| Equities | XX% | XX% | Market outlook and risk profile |
| Fixed Income | XX% | XX% | Interest rate environment |
| Alternatives | XX% | XX% | Diversification benefits |

### 2. Rebalancing Strategy
- **Priority Actions**: List specific buy/sell recommendations
- **Market Timing**: Consider current market conditions
- **Cost Analysis**: Transaction costs and tax implications

### 3. Risk Management
- **Diversification Improvements**: Reduce concentration risks
- **Hedging Opportunities**: Consider protective strategies
- **Stress Testing**: Model portfolio under various scenarios

## Implementation Plan

### Immediate Actions (Next 30 Days)
1. Execute priority rebalancing trades
2. Implement tax-loss harvesting opportunities
3. Review and update beneficiary designations

### Medium-Term Objectives (3-6 Months)
1. Monitor market conditions for additional opportunities
2. Review progress against benchmarks
3. Assess need for strategy adjustments

### Ongoing Monitoring
- **Review Frequency**: Quarterly portfolio reviews
- **Rebalancing Triggers**: 5% drift from target allocation
- **Performance Reporting**: Monthly statements with quarterly analysis

## Expected Outcomes
- **Risk-Adjusted Return**: Target improvement of X%
- **Volatility Reduction**: Expected decrease in portfolio volatility
- **Tax Efficiency**: Estimated annual tax savings

**Next Steps**: Schedule follow-up meeting in 30 days to review implementation progress.`,

  risk: `
# Comprehensive Risk Assessment

As a Private Wealth Advisor, conduct a detailed risk analysis for **{clientName}**.

## Client Profile
{clientProfile}

## Executive Risk Summary
*Provide a brief overview of the client's current risk position and key concerns*

## Risk Tolerance Analysis

### Stated vs. Demonstrated Risk Tolerance
- **Risk Questionnaire Results**: Document stated risk preferences
- **Historical Behavior**: Analyze past investment decisions during volatility
- **Capacity for Risk**: Evaluate financial ability to withstand losses

### Risk Profile Classification
> **Risk Level**: Conservative | Moderate | Aggressive
> **Justification**: Based on financial situation and behavioral analysis

## Current Portfolio Risk Metrics

### Quantitative Risk Measures
| Metric | Current Value | Benchmark | Assessment |
|--------|---------------|-----------|------------|
| Portfolio Beta | X.XX | 1.00 | Market sensitivity |
| Standard Deviation | X.X% | Y.Y% | Volatility level |
| Value at Risk (95%) | X.X% | Y.Y% | Potential loss |
| Sharpe Ratio | X.XX | Y.XX | Risk-adjusted return |

### Concentration Risk Analysis
- **Individual Holdings**: Identify positions >5% of portfolio
- **Sector Concentration**: Review sector allocation limits
- **Geographic Exposure**: Assess home country bias
- **Correlation Analysis**: Identify highly correlated assets

## Scenario Analysis & Stress Testing

### Market Stress Scenarios
1. **2008 Financial Crisis Replay**
   - Expected portfolio impact: -X%
   - Recovery timeline: X months

2. **Rising Interest Rate Environment**
   - Bond portfolio impact: -X%
   - Equity sector rotation effects

3. **Inflation Surge Scenario**
   - Real return erosion: X%
   - Asset class performance divergence

### Economic Sensitivity Analysis
- **Interest Rate Changes**: ±200 basis points impact
- **Currency Fluctuations**: Foreign exposure effects
- **Commodity Price Volatility**: Inflation hedge assessment

## Risk Mitigation Recommendations

### Immediate Risk Reduction Actions
1. **Diversification Improvements**
   - Reduce concentration in top 5 holdings to <20%
   - Add international exposure to X%
   - Consider alternative asset classes

2. **Hedging Strategies**
   - Protective put options for large equity positions
   - Currency hedging for international exposure
   - Interest rate protection for bond duration risk

3. **Liquidity Management**
   - Maintain X months of expenses in liquid assets
   - Stagger bond maturities to manage reinvestment risk

### Portfolio Optimization
- **Efficient Frontier Analysis**: Current vs. optimal allocation
- **Risk Budgeting**: Allocate risk across asset classes
- **Dynamic Hedging**: Adjust protection based on market conditions

## Risk Monitoring Framework

### Key Risk Indicators (KRIs)
- **Portfolio VaR**: Monitor daily, alert if exceeds X%
- **Correlation Breakdown**: Monthly correlation matrix review
- **Concentration Limits**: Alert when single position >Y%

### Review Schedule
- **Weekly**: Market risk dashboard review
- **Monthly**: Comprehensive risk report
- **Quarterly**: Stress testing and scenario updates
- **Annually**: Risk tolerance reassessment

## Action Plan

### Next 30 Days
1. Implement immediate diversification changes
2. Establish risk monitoring alerts
3. Review insurance coverage adequacy

### Next 90 Days
1. Execute hedging strategies if market conditions warrant
2. Rebalance to target risk allocation
3. Establish emergency liquidity fund

**Risk Management Philosophy**: *Preservation of capital while achieving growth objectives through prudent risk management and diversification.*`,

  tax: `
**TAX OPTIMIZATION STRATEGY**

As a Private Wealth Advisor, develop a comprehensive tax optimization strategy for {clientName}.

**CLIENT PROFILE:**
{clientProfile}

**TAX OPTIMIZATION FRAMEWORK:**
1. **Current Tax Situation Analysis**
   - Review current tax bracket and projected income
   - Analyze existing tax-advantaged account utilization
   - Identify immediate tax optimization opportunities

2. **Investment Tax Efficiency**
   - Evaluate asset location across taxable/tax-advantaged accounts
   - Recommend tax-efficient investment vehicles
   - Suggest tax-loss harvesting strategies

3. **Estate Tax Planning**
   - Assess potential estate tax exposure
   - Recommend gifting strategies if applicable
   - Evaluate trust structures for tax efficiency

4. **Retirement Tax Planning**
   - Optimize 401(k), IRA, and Roth IRA contributions
   - Plan Roth conversion strategies
   - Model tax implications of retirement withdrawals

5. **Advanced Tax Strategies**
   - Consider tax-deferred exchanges if applicable
   - Evaluate charitable giving strategies for tax benefits
   - Assess business structure optimization opportunities

**DELIVERABLE FORMAT:**
- Current Tax Efficiency Score
- Immediate Tax Savings Opportunities
- Long-term Tax Strategy Roadmap
- Specific Implementation Steps
- Projected Tax Savings Impact

Please provide specific, actionable tax strategies with quantified benefits where possible.`,

  estate: `
**ESTATE PLANNING STRATEGY**

As a Private Wealth Advisor, develop a comprehensive estate planning strategy for {clientName}.

**CLIENT PROFILE:**
{clientProfile}

**ESTATE PLANNING FRAMEWORK:**
1. **Current Estate Analysis**
   - Calculate gross and net estate value
   - Review existing estate planning documents
   - Identify potential estate tax exposure and liquidity needs

2. **Wealth Transfer Strategy**
   - Recommend optimal gifting strategies
   - Evaluate trust structures for wealth preservation
   - Consider generation-skipping transfer opportunities

3. **Asset Protection Planning**
   - Assess creditor protection needs
   - Recommend appropriate legal structures
   - Evaluate insurance strategies for asset protection

4. **Legacy and Philanthropic Goals**
   - Develop charitable giving strategy if applicable
   - Structure family foundation or donor-advised funds
   - Create succession planning for family businesses

5. **Implementation & Coordination**
   - Coordinate with estate planning attorneys
   - Ensure proper beneficiary designations
   - Create regular review and update schedule

**DELIVERABLE FORMAT:**
- Estate Planning Needs Assessment
- Wealth Transfer Strategy Recommendations
- Asset Protection Plan
- Philanthropic Strategy (if applicable)
- Implementation Timeline and Next Steps

Provide comprehensive estate planning recommendations aligned with client's values and objectives.`,

  alternatives: `
**ALTERNATIVE INVESTMENTS STRATEGY**

As a Private Wealth Advisor, evaluate alternative investment opportunities for {clientName}.

**CLIENT PROFILE:**
{clientProfile}

**ALTERNATIVE INVESTMENTS ANALYSIS:**
1. **Suitability Assessment**
   - Evaluate client's accredited/qualified investor status
   - Assess risk tolerance for illiquid investments
   - Review existing alternative investment exposure

2. **Alternative Asset Classes Review**
   - Private Equity and Venture Capital opportunities
   - Real Estate Investment Trusts (REITs) and direct real estate
   - Hedge funds and liquid alternatives
   - Commodities and precious metals exposure
   - Infrastructure and natural resources investments

3. **Due Diligence Framework**
   - Manager selection criteria and track record analysis
   - Fee structure evaluation and cost-benefit analysis
   - Liquidity considerations and lock-up periods

4. **Portfolio Integration**
   - Optimal allocation to alternative investments
   - Correlation analysis with existing holdings
   - Rebalancing considerations and timing

5. **Monitoring & Performance**
   - Establish performance benchmarks
   - Create regular review and reporting schedule
   - Define exit strategies and reallocation triggers

**DELIVERABLE FORMAT:**
- Alternative Investment Suitability Analysis
- Recommended Alternative Asset Allocation
- Specific Investment Opportunities
- Due Diligence Summary
- Implementation and Monitoring Plan

Focus on alternatives that enhance portfolio diversification and risk-adjusted returns.`,

  crosssell: `
**PRIVATE BANKING SERVICES OPTIMIZATION**

As a Private Wealth Advisor, review comprehensive banking relationship opportunities for {clientName}.

**CLIENT PROFILE:**
{clientProfile}

**PRIVATE BANKING SERVICES ANALYSIS:**
1. **Current Banking Relationship Review**
   - Assess existing banking services utilization
   - Evaluate fee structures and service levels
   - Identify gaps in current banking solutions

2. **Credit and Lending Opportunities**
   - Securities-based lending for liquidity needs
   - Mortgage and real estate financing optimization
   - Business and commercial lending solutions
   - Foreign exchange and multi-currency services

3. **Cash Management Optimization**
   - High-yield savings and money market solutions
   - Certificate of deposit laddering strategies
   - Treasury management for business accounts
   - International banking and offshore solutions

4. **Specialized Services**
   - Trust and fiduciary services
   - Private banking concierge services
   - Art and collectibles financing
   - Yacht and aircraft financing solutions

5. **Relationship Value Enhancement**
   - Consolidated reporting and account management
   - Priority banking services and access
   - Exclusive investment opportunities
   - Family office services coordination

**DELIVERABLE FORMAT:**
- Current Banking Relationship Assessment
- Service Gap Analysis
- Recommended Private Banking Solutions
- Value Proposition and Benefits Summary
- Implementation Priority and Timeline

Focus on services that enhance client experience while generating appropriate revenue for the bank.`
};

export function getWealthAdvisorPrompt(category: keyof WealthAdvisorPromptSettings, clientName: string, clientProfile: string, allocation?: string): string {
  const promptTemplate = DEFAULT_WEALTH_ADVISOR_PROMPTS[category];
  
  return promptTemplate
    .replace(/{clientName}/g, clientName)
    .replace(/{clientProfile}/g, clientProfile)
    .replace(/{allocation}/g, allocation || 'Portfolio allocation details not specified');
}

// Settings management functions
export function saveWealthAdvisorSettings(settings: WealthAdvisorPromptSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wealthAdvisorSettings', JSON.stringify(settings));
  }
}

export function loadWealthAdvisorSettings(): WealthAdvisorPromptSettings {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('wealthAdvisorSettings');
    if (saved) {
      try {
        return { ...DEFAULT_WEALTH_ADVISOR_PROMPTS, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Error loading wealth advisor settings:', error);
      }
    }
  }
  return DEFAULT_WEALTH_ADVISOR_PROMPTS;
}

export function resetWealthAdvisorSettings(): WealthAdvisorPromptSettings {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wealthAdvisorSettings');
  }
  return DEFAULT_WEALTH_ADVISOR_PROMPTS;
}
