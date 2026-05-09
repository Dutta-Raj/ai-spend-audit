// Audit Engine for AI Spend Audit

export type Tool = {
  id: string;
  name: string;
  plan: string;
  seats: number;
  spend: number;
};

export type Recommendation = {
  toolName: string;
  currentPlan: string;
  recommendedPlan: string;
  currentSpend: number;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  action: string;
};

export type AuditResult = {
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
};

const PRICING: Record<string, Record<string, number>> = {
  cursor: { Hobby: 0, Pro: 20, Business: 40 },
  copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  claude: { Free: 0, Pro: 20, Team: 30 },
  chatgpt: { Free: 0, Plus: 20, Team: 30 },
};

export function runAudit(tools: Tool[]): AuditResult {
  const recommendations: Recommendation[] = [];
  let totalMonthlySavings = 0;

  for (const tool of tools) {
    const toolPricing = PRICING[tool.id as keyof typeof PRICING];
    if (!toolPricing) continue;

    const currentPricePerSeat = toolPricing[tool.plan as keyof typeof toolPricing];
    if (currentPricePerSeat === undefined) continue;

    let savings = 0;
    let recommendedPlan = tool.plan;
    let recommendedSpend = tool.spend;
    let reason = "";
    let action = "";

    // RULE 1: Cursor Hobby is free - don't pay
    if (tool.id === "cursor" && tool.plan === "Hobby" && tool.spend > 0) {
      savings = tool.spend;
      recommendedPlan = "Hobby (Free)";
      recommendedSpend = 0;
      reason = `Cursor Hobby plan is completely free. You're paying $${tool.spend} for something that costs $0.`;
      action = `Cancel your payment and use the free Hobby plan`;
    }
    
    // RULE 2: Cursor Business -> Pro
    else if (tool.id === "cursor" && tool.plan === "Business") {
      const proPrice = toolPricing.Pro;
      const betterSpend = proPrice * tool.seats;
      if (betterSpend < tool.spend) {
        savings = tool.spend - betterSpend;
        recommendedPlan = "Pro";
        recommendedSpend = betterSpend;
        reason = `Cursor Business costs $40/user but Pro is $20/user with same features.`;
        action = `Switch from Business to Pro`;
      }
    }
    
    // RULE 3: Claude Team (small team) -> Pro
    else if (tool.id === "claude" && tool.plan === "Team" && tool.seats <= 3) {
      const proPrice = toolPricing.Pro;
      const betterSpend = proPrice * tool.seats;
      if (betterSpend < tool.spend) {
        savings = tool.spend - betterSpend;
        recommendedPlan = "Pro";
        recommendedSpend = betterSpend;
        reason = `Claude Team costs $30/user and is for 5+ users. Pro at $20/user works for your team.`;
        action = `Downgrade from Team to Pro`;
      }
    }
    
    // RULE 4: Copilot Business (1 seat) -> Individual
    else if (tool.id === "copilot" && tool.plan === "Business" && tool.seats === 1) {
      const individualPrice = toolPricing.Individual;
      if (individualPrice < tool.spend) {
        savings = tool.spend - individualPrice;
        recommendedPlan = "Individual";
        recommendedSpend = individualPrice;
        reason = `Business plan costs $19/month but Individual is $10/month for solo developers.`;
        action = `Switch from Business to Individual`;
      }
    }
    
    // RULE 5: Copilot Enterprise (small team) -> Business
    else if (tool.id === "copilot" && tool.plan === "Enterprise" && tool.seats < 20) {
      const businessPrice = toolPricing.Business;
      const betterSpend = businessPrice * tool.seats;
      if (betterSpend < tool.spend) {
        savings = tool.spend - betterSpend;
        recommendedPlan = "Business";
        recommendedSpend = betterSpend;
        reason = `Enterprise requires minimum 20 seats. For ${tool.seats} users, Business is more cost-effective.`;
        action = `Switch from Enterprise to Business`;
      }
    }
    
    // RULE 6: ChatGPT Team (2 seats) -> Plus
    else if (tool.id === "chatgpt" && tool.plan === "Team" && tool.seats === 2) {
      const plusPrice = toolPricing.Plus;
      const betterSpend = plusPrice * tool.seats;
      if (betterSpend < tool.spend) {
        savings = tool.spend - betterSpend;
        recommendedPlan = "Plus (two accounts)";
        recommendedSpend = betterSpend;
        reason = `Two Plus accounts cost $40/month vs Team at $60/month for same features.`;
        action = `Switch from Team to two Plus accounts`;
      }
    }

    if (savings > 0) {
      totalMonthlySavings += savings;
      recommendations.push({
        toolName: tool.name,
        currentPlan: tool.plan,
        recommendedPlan: recommendedPlan,
        currentSpend: tool.spend,
        recommendedSpend: recommendedSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: reason,
        action: action,
      });
    }
  }

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
