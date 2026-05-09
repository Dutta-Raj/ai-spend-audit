import { NextResponse } from "next/server";
import { saveAudit } from "@/lib/db-sqlite";

const PRICING: Record<string, Record<string, number>> = {
  cursor: { Hobby: 0, Pro: 20, Business: 40 },
  copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  claude: { Free: 0, Pro: 20, Team: 30 },
  chatgpt: { Free: 0, Plus: 20, Team: 30 },
};

export async function POST(request: Request) {
  try {
    const { tools, teamSize, useCase, companyName, email } = await request.json();
    
    const recommendations = [];
    let totalSavings = 0;

    for (const tool of tools) {
      const toolPricing = PRICING[tool.id as keyof typeof PRICING];
      if (!toolPricing) continue;

      let savings = 0;
      let recommendedPlan = tool.plan;
      let reason = "";
      let action = "";

      const currentPricePerSeat = toolPricing[tool.plan as keyof typeof toolPricing];
      
      // Cursor: Hobby is free, Business should be Pro
      if (tool.id === "cursor" && tool.plan === "Hobby" && tool.spend > 0) {
        savings = tool.spend;
        recommendedPlan = "Hobby (Free)";
        reason = `Cursor Hobby plan is completely free. You're paying $${tool.spend} for something that costs $0.`;
        action = `Cancel your payment and use the free Hobby plan`;
      }
      else if (tool.id === "cursor" && tool.plan === "Business") {
        const proPrice = toolPricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Cursor Business costs $40/user but Pro is $20/user with same features.`;
          action = `Switch from Business to Pro`;
        }
      }
      
      // Copilot: Business for 1 user → Individual
      else if (tool.id === "copilot" && tool.plan === "Business" && tool.seats === 1) {
        const individualPrice = toolPricing.Individual;
        if (individualPrice < tool.spend) {
          savings = tool.spend - individualPrice;
          recommendedPlan = "Individual";
          reason = `Business plan costs $19/month but Individual is $10/month for solo developers.`;
          action = `Switch from Business to Individual`;
        }
      }
      else if (tool.id === "copilot" && tool.plan === "Enterprise" && tool.seats < 20) {
        const businessPrice = toolPricing.Business;
        const betterSpend = businessPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Business";
          reason = `Enterprise requires minimum 20 seats. For ${tool.seats} users, Business is better.`;
          action = `Switch from Enterprise to Business`;
        }
      }
      
      // Claude: Team for small teams → Pro
      else if (tool.id === "claude" && tool.plan === "Team" && tool.seats <= 3) {
        const proPrice = toolPricing.Pro;
        const betterSpend = proPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Pro";
          reason = `Claude Team costs $30/user and is for 5+ users. Pro at $20/user works for you.`;
          action = `Downgrade from Team to Pro`;
        }
      }
      
      // ChatGPT: Team for 2 seats → Plus
      else if (tool.id === "chatgpt" && tool.plan === "Team" && tool.seats === 2) {
        const plusPrice = toolPricing.Plus;
        const betterSpend = plusPrice * tool.seats;
        if (betterSpend < tool.spend) {
          savings = tool.spend - betterSpend;
          recommendedPlan = "Plus (two accounts)";
          reason = `Two Plus accounts cost $40/month vs Team at $60/month for same features.`;
          action = `Switch from Team to two Plus accounts`;
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

    // Save to database
    const shareId = Math.random().toString(36).substring(2, 10);
    saveAudit({
      shareId,
      companyName: companyName || "",
      teamSize,
      useCase,
      tools,
      recommendations,
      totalSavings,
      email: email || undefined,
    });

    return NextResponse.json({
      success: true,
      recommendations,
      totalMonthlySavings: totalSavings,
      totalAnnualSavings: totalSavings * 12,
      shareId,
    });
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json({ success: false, error: "Failed to process audit" }, { status: 500 });
  }
}
