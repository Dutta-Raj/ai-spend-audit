import { NextResponse } from "next/server";

const PRICING = {
  cursor: { Hobby: 0, Pro: 20, Business: 40 },
  copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  claude: { Free: 0, Pro: 20, Team: 30 },
  chatgpt: { Free: 0, Plus: 20, Team: 30 },
};

export async function POST(request: Request) {
  console.log("API called");
  
  try {
    const { tools } = await request.json();
    
    const recommendations = [];
    let totalSavings = 0;
    const shareId = Math.random().toString(36).substring(2, 10);

    for (const tool of tools) {
      const pricing = PRICING[tool.id as keyof typeof PRICING];
      if (!pricing) continue;

      let savings = 0;
      let recommendedPlan = tool.plan;
      let reason = "";
      let action = "";

      // Rule: Cursor Business -> Pro
      if (tool.id === "cursor" && tool.plan === "Business") {
        const proPrice = pricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Cursor Business costs $40/user but Pro is $20/user.`;
          action = `Switch to Pro (save $${savings}/month)`;
        }
      }
      
      // Rule: Cursor Hobby overpaying
      else if (tool.id === "cursor" && tool.plan === "Hobby" && tool.spend > 0) {
        savings = tool.spend;
        recommendedPlan = "Hobby (Free)";
        reason = `Cursor Hobby is free. You're paying $${tool.spend} unnecessarily.`;
        action = `Cancel payment and use free plan`;
      }
      
      // Rule: Claude Team -> Pro (small teams)
      else if (tool.id === "claude" && tool.plan === "Team" && tool.seats <= 3) {
        const proPrice = pricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Claude Team costs $30/user but Pro is $20/user.`;
          action = `Downgrade to Pro (save $${savings}/month)`;
        }
      }
      
      // Rule: Copilot Business (1 seat) -> Individual
      else if (tool.id === "copilot" && tool.plan === "Business" && tool.seats === 1) {
        const individualPrice = pricing.Individual;
        if (individualPrice < tool.spend) {
          savings = tool.spend - individualPrice;
          recommendedPlan = "Individual";
          reason = `Business costs $19/month but Individual is $10/month.`;
          action = `Switch to Individual (save $${savings}/month)`;
        }
      }
      
      // Rule: ChatGPT Team (2 seats) -> two Plus accounts
      else if (tool.id === "chatgpt" && tool.plan === "Team" && tool.seats === 2) {
        const plusPrice = pricing.Plus;
        const betterSpend = plusPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Plus (two accounts)";
          reason = `Two Plus accounts cost $40/month vs Team at $60/month.`;
          action = `Switch to two Plus accounts (save $${savings}/month)`;
        }
      }

      if (savings > 0) {
        totalSavings += savings;
        recommendations.push({
          toolName: tool.name,
          currentPlan: tool.plan,
          recommendedPlan: recommendedPlan,
          currentSpend: tool.spend,
          recommendedSpend: tool.spend - savings,
          monthlySavings: savings,
          annualSavings: savings * 12,
          reason: reason,
          action: action,
        });
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations,
      totalMonthlySavings: totalSavings,
      totalAnnualSavings: totalSavings * 12,
      shareId: shareId,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process audit" },
      { status: 500 }
    );
  }
}
