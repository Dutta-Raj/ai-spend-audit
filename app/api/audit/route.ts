import { NextResponse } from "next/server";

const PRICING: Record<string, Record<string, number>> = {
  cursor: { Hobby: 0, Pro: 20, Business: 40 },
  copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  claude: { Free: 0, Pro: 20, Team: 30 },
  chatgpt: { Free: 0, Plus: 20, Team: 30 },
};

export async function POST(request: Request) {
  console.log("🔵 API called - /api/audit");
  
  try {
    const body = await request.json();
    const { tools, teamSize, useCase, companyName, companyDomain, email } = body;
    
    console.log("📊 Processing tools:", tools?.length);
    
    const recommendations = [];
    let totalSavings = 0;
    let shareId = Math.random().toString(36).substring(2, 10);

    for (const tool of tools) {
      const toolPricing = PRICING[tool.id as keyof typeof PRICING];
      if (!toolPricing) {
        console.log(`No pricing for: ${tool.id}`);
        continue;
      }

      let savings = 0;
      let recommendedPlan = tool.plan;
      let reason = "";
      let action = "";

      const currentPrice = toolPricing[tool.plan as keyof typeof toolPricing];
      
      console.log(`Processing ${tool.name}: plan=${tool.plan}, seats=${tool.seats}, spend=${tool.spend}, currentPrice=${currentPrice}`);

      // RULE 1: Cursor Business -> Pro (save $20 per seat)
      if (tool.id === "cursor" && tool.plan === "Business") {
        const proPrice = toolPricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Cursor Business costs $40/user but Pro is $20/user. You're paying $${tool.spend} but could pay $${betterSpend}.`;
          action = `Switch from Business to Pro plan (save $${savings}/month)`;
        }
      }
      
      // RULE 2: Cursor Pro is optimal if spending correctly
      else if (tool.id === "cursor" && tool.plan === "Pro") {
        const expectedSpend = currentPrice * tool.seats;
        if (tool.spend !== expectedSpend) {
          savings = Math.abs(tool.spend - expectedSpend);
          reason = `Pro plan costs $${currentPrice}/user. For ${tool.seats} users, you should pay $${expectedSpend}.`;
          action = `Adjust your billing to $${expectedSpend}/month`;
        }
      }
      
      // RULE 3: Claude Team (small team) -> Pro
      else if (tool.id === "claude" && tool.plan === "Team" && tool.seats <= 3) {
        const proPrice = toolPricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Claude Team costs $30/user but Pro is $20/user. Team is designed for 5+ users.`;
          action = `Downgrade from Team to Pro (save $${savings}/month)`;
        }
      }
      
      // RULE 4: Copilot Business (1 seat) -> Individual
      else if (tool.id === "copilot" && tool.plan === "Business" && tool.seats === 1) {
        const individualPrice = toolPricing.Individual;
        if (individualPrice < tool.spend) {
          savings = tool.spend - individualPrice;
          recommendedPlan = "Individual";
          reason = `Business plan costs $19/month but Individual is $10/month for solo developers.`;
          action = `Switch from Business to Individual (save $${savings}/month)`;
        }
      }
      
      // RULE 5: ChatGPT Team (2 seats) -> Plus
      else if (tool.id === "chatgpt" && tool.plan === "Team" && tool.seats === 2) {
        const plusPrice = toolPricing.Plus;
        const betterSpend = plusPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Plus (two accounts)";
          reason = `Two Plus accounts cost $40/month vs Team at $60/month for same features.`;
          action = `Switch from Team to two Plus accounts (save $${savings}/month)`;
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

    console.log(`✅ Audit complete: ${recommendations.length} recommendations, $${totalSavings} savings`);

    return NextResponse.json({
      success: true,
      recommendations: recommendations,
      totalMonthlySavings: totalSavings,
      totalAnnualSavings: totalSavings * 12,
      shareId: shareId,
    });
  } catch (error) {
    console.error("❌ Audit API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process audit" },
      { status: 500 }
    );
  }
}
