"use client";

import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";

function ShareContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  // Mock data for demonstration
  const totalSavings = 89;
  const recommendations = [
    {
      toolName: "Cursor",
      currentPlan: "Business",
      recommendedPlan: "Pro",
      monthlySavings: 40,
      reason: "Cursor Business costs $40/user but Pro is $20/user.",
      action: "Switch from Business to Pro"
    },
    {
      toolName: "Claude",
      currentPlan: "Team",
      recommendedPlan: "Pro",
      monthlySavings: 20,
      reason: "Claude Team costs $30/user but Pro is $20/user.",
      action: "Downgrade from Team to Pro"
    },
    {
      toolName: "GitHub Copilot",
      currentPlan: "Business",
      recommendedPlan: "Individual",
      monthlySavings: 9,
      reason: "Business costs $19/month but Individual is $10/month.",
      action: "Switch from Business to Individual"
    },
    {
      toolName: "ChatGPT",
      currentPlan: "Team",
      recommendedPlan: "Plus",
      monthlySavings: 20,
      reason: "Two Plus accounts cost less than Team plan.",
      action: "Switch from Team to two Plus accounts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Shared Audit Report</span>
          </div>
          <h1 className="text-3xl font-bold text-white">AI Spend Audit Results</h1>
          <p className="text-slate-400 mt-2">Anonymous audit report {id ? `#${id}` : ""}</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-center mb-6">
          <h2 className="text-white/80 mb-2">Potential Monthly Savings</h2>
          <div className="text-5xl font-bold text-white">${totalSavings}</div>
          <p className="text-emerald-100 mt-2">${totalSavings * 12} per year</p>
        </div>
        
        {recommendations.map((rec, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white text-lg">{rec.toolName}</h4>
                <p className="text-slate-300 text-sm mt-1">{rec.reason}</p>
                <p className="text-emerald-400 text-sm mt-2">→ {rec.action}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">${rec.monthlySavings}</div>
                <div className="text-xs text-slate-500">saved/month</div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 text-center mt-6">
          <p className="text-slate-400 text-sm">Run your own free audit at AI Spend Audit</p>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <ShareContent />
    </Suspense>
  );
}
