import { getAudit } from "@/lib/db-sqlite";
import { notFound } from "next/navigation";
import { Sparkles, TrendingDown, Building, Users, Cpu, Calendar, Award, Share2, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = getAudit(id);
  
  if (!audit) {
    return { title: "Audit Not Found" };
  }
  
  return {
    title: `${audit.company_name || "Company"} saved $${audit.total_savings}/month on AI tools`,
    description: `AI Spend Audit found $${audit.total_savings}/month in potential savings.`,
  };
}

export default async function SharedAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = getAudit(id);
  
  if (!audit) {
    notFound();
  }
  
  const recommendations = JSON.parse(audit.recommendations || "[]");
  const tools = JSON.parse(audit.tools_data || "[]");
  const totalSavings = audit.total_savings || 0;
  const annualSavings = totalSavings * 12;
  const totalMonthlySpend = tools.reduce((sum: number, t: any) => sum + (t.spend || 0), 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-emerald-500/20">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Shared Audit Report</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI Spend Audit Results
          </h1>
          <p className="text-slate-400">
            Shared by <span className="text-emerald-400 font-medium">{audit.company_name || "a company"}</span>
          </p>
        </div>

        {/* Company Info */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Building className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Company Snapshot</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
              <Building className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Company</p>
                <p className="text-white font-medium">{audit.company_name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
              <Users className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs text-slate-500">Team Size</p>
                <p className="text-white font-medium">{audit.team_size || "Not specified"} people</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Stack Summary */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">AI Stack Summary</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tools.map((tool: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-xl text-center">
                <div className="text-2xl mb-1">
                  {tool.id === "cursor" && "⚡"}
                  {tool.id === "copilot" && "🎯"}
                  {tool.id === "claude" && "🧠"}
                  {tool.id === "chatgpt" && "🤖"}
                </div>
                <p className="text-white font-medium text-sm">{tool.name}</p>
                <p className="text-slate-400 text-xs">{tool.plan}</p>
                <p className="text-emerald-400 text-xs mt-1">${tool.spend}/mo</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-900/50 rounded-xl text-center">
            <p className="text-slate-400 text-sm">
              Total Monthly Spend: <span className="text-white font-bold">${totalMonthlySpend}</span>
            </p>
          </div>
        </div>

        {/* Savings Hero */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-center mb-6 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
            <Award className="w-4 h-4 text-white" />
            <span className="text-sm text-white/90">Potential Savings</span>
          </div>
          <div className="text-6xl md:text-7xl font-bold text-white mb-2">
            ${totalSavings}
          </div>
          <p className="text-emerald-100 text-lg">per month</p>
          <div className="mt-3 inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full">
            <p className="text-white text-sm">${annualSavings} per year</p>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Optimization Opportunities</h2>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-4">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{rec.toolName}</h3>
                        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">
                          {rec.currentPlan} → {rec.recommendedPlan}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{rec.reason}</p>
                      <p className="text-emerald-400 text-sm mt-2">→ {rec.action}</p>
                    </div>
                    <div className="text-right bg-emerald-500/10 px-3 py-2 rounded-lg">
                      <div className="text-xl font-bold text-emerald-400">${rec.monthlySavings}</div>
                      <div className="text-xs text-slate-500">saved/month</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length === 0 && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-12 text-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your AI Stack is Optimized!</h2>
            <p className="text-slate-400">No optimization opportunities found.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 text-center">
          <p className="text-slate-400 text-sm">
            Run your own free audit at <span className="text-emerald-400 font-medium">AI Spend Audit</span>
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <span className="text-xs text-slate-500">✓ Free</span>
            <span className="text-xs text-slate-500">✓ Instant</span>
            <span className="text-xs text-slate-500">✓ No CC Required</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-600">
          <p>Report generated on {new Date(audit.created_at).toLocaleDateString()}</p>
          <p>AI Spend Audit — Helping startups optimize AI costs</p>
        </div>
      </div>
    </div>
  );
}