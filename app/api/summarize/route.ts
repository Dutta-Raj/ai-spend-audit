import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { savings, recommendations, teamSize, useCase } = await request.json();
    
    // Fallback template (no API key needed)
    let summary = "";
    
    if (savings === 0) {
      summary = `Great news! Your team of ${teamSize} is already optimized on AI spending. You're paying the right amounts for your current plans based on ${useCase} use case. We'll notify you when new optimization opportunities arise.`;
    } 
    else if (savings < 100) {
      summary = `We found $${savings}/month in potential savings ($${savings * 12}/year). ${recommendations.length} optimization opportunities detected. These small changes take less than 10 minutes to implement and add up over time.`;
    }
    else if (savings < 500) {
      summary = `Good news! We found $${savings}/month in potential savings ($${savings * 12}/year). Your team of ${teamSize} can save significantly by optimizing ${recommendations.map((r: any) => r.toolName).join(", ")}. These changes are easy to implement.`;
    }
    else {
      summary = `Excellent news! We found $${savings}/month in potential savings ($${savings * 12}/year). This is significant! Credex offers even better rates through discounted AI credits from enterprise customers. Book a free consultation to unlock additional savings of 20-40% on top of these optimizations.`;
    }
    
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ summary: "We've analyzed your spending and found optimization opportunities. Enter your email below to get the full report." });
  }
}
