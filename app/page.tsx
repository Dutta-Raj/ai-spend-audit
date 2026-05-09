"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, TrendingDown, Users, Plus, Trash2, CheckCircle, 
  Mail, Building, Cpu, Zap, ArrowRight, Shield, Award, Copy, Check
} from "lucide-react";

type Tool = {
  id: string;
  name: string;
  plan: string;
  seats: number;
  spend: number;
};

type Recommendation = {
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

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([
    { id: "cursor", name: "Cursor", plan: "Pro", seats: 2, spend: 40 },
    { id: "copilot", name: "GitHub Copilot", plan: "Individual", seats: 2, spend: 20 },
    { id: "claude", name: "Claude", plan: "Pro", seats: 2, spend: 40 },
    { id: "chatgpt", name: "ChatGPT", plan: "Plus", seats: 2, spend: 40 },
  ]);
  
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState("coding");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  
  const [isAudited, setIsAudited] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("auditForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTools(parsed.tools || tools);
        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || "coding");
        setCompanyName(parsed.companyName || "");
      } catch (e) {}
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("auditForm", JSON.stringify({ tools, teamSize, useCase, companyName }));
  }, [tools, teamSize, useCase, companyName]);

  const updateTool = (id: string, field: string, value: any) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTool = () => {
    setTools([...tools, { id: `tool-${Date.now()}`, name: "Other Tool", plan: "Free", seats: 1, spend: 0 }]);
  };

  const removeTool = (id: string) => {
    if (tools.length > 1) {
      setTools(prev => prev.filter(t => t.id !== id));
    }
  };

  const getPlanOptions = (toolId: string) => {
    if (toolId === "cursor") return ["Hobby", "Pro", "Business"];
    if (toolId === "copilot") return ["Individual", "Business", "Enterprise"];
    if (toolId === "claude") return ["Free", "Pro", "Team"];
    return ["Free", "Plus", "Team"];
  };

  const getToolIcon = (toolId: string) => {
    const icons: Record<string, string> = {
      cursor: "⚡",
      copilot: "🎯",
      claude: "🧠",
      chatgpt: "🤖",
    };
    return icons[toolId] || "🔧";
  };

  const runAudit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools, teamSize, useCase, companyName, email }),
      });
      
      const data = await response.json();
      
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setTotalSavings(data.totalMonthlySavings);
        setAnnualSavings(data.totalAnnualSavings);
        setShareId(data.shareId || "");
        setIsAudited(true);
        
        if (data.totalMonthlySavings > 100) {
          setShowEmailCapture(true);
        }
      }
    } catch (error) {
      console.error("Audit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const captureEmail = async () => {
    if (!email) return;
    
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName, teamSize, useCase, savings: totalSavings }),
      });
      setEmailCaptured(true);
      setShowEmailCapture(false);
    } catch (error) {
      console.error("Email capture error:", error);
    }
  };

  const resetAudit = () => {
    setIsAudited(false);
    setRecommendations([]);
    setTotalSavings(0);
    setShowEmailCapture(false);
    setEmailCaptured(false);
    setEmail("");
    setCopied(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/audit/${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Press Ctrl+C to copy: " + url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Free AI Spend Audit — No Credit Card Required</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-white">AI Spend</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Audit</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Stop overpaying for AI tools. Get instant, data-driven analysis of your entire AI stack.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Verified Pricing</span>
            </div>
          </div>
        </div>

        {!isAudited ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
            
            <div className="p-6 md:p-8 border-b border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Building className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Company Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="coding">💻 Coding / Development</option>
                  <option value="writing">✍️ Writing / Content</option>
                  <option value="data">📊 Data Analysis</option>
                  <option value="research">🔬 Research</option>
                  <option value="mixed">🎯 Mixed / General</option>
                </select>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Your AI Stack</h2>
                </div>
                <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{tools.length} tools</span>
              </div>
              
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-3 w-32">
                        <span className="text-2xl">{getToolIcon(tool.id)}</span>
                        <span className="font-medium text-white">{tool.name}</span>
                      </div>
                      <select
                        value={tool.plan}
                        onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                        className="flex-1 min-w-[130px] px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {getPlanOptions(tool.id).map(plan => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <input
                          type="number"
                          value={tool.seats}
                          onChange={(e) => updateTool(tool.id, "seats", parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                        <input
                          type="number"
                          value={tool.spend}
                          onChange={(e) => updateTool(tool.id, "spend", parseInt(e.target.value) || 0)}
                          className="w-28 pl-7 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      {tool.id.startsWith("tool-") && (
                        <button onClick={() => removeTool(tool.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addTool} className="mt-5 text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-2 transition-all">
                <Plus className="w-3 h-3" /> Add another tool
              </button>
            </div>

            <div className="p-6 md:p-8 pt-0">
              <button
                onClick={runAudit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5" />
                    Run Free Audit
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-center">
              <h2 className="text-white/80 text-lg mb-2">Monthly Savings</h2>
              <div className="text-6xl font-bold text-white">${totalSavings}</div>
              <p className="text-emerald-100 mt-2">${annualSavings} per year</p>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-4 mb-3">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{rec.toolName}</h4>
                          <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">{rec.currentPlan} → {rec.recommendedPlan}</span>
                        </div>
                        <p className="text-slate-400 text-sm">{rec.reason}</p>
                        <p className="text-emerald-400 text-sm mt-2">→ {rec.action}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-emerald-400">${rec.monthlySavings}</div>
                        <div className="text-xs text-slate-500">saved/month</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showEmailCapture && !emailCaptured && (
              <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Save ${totalSavings}/month</h3>
                    <p className="text-slate-400 text-sm">Get full report via email</p>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                    <button onClick={captureEmail} className="bg-emerald-600 px-6 py-2 rounded-xl text-white">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {emailCaptured && (
              <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-4 text-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-white text-sm">Report sent to {email}!</p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={resetAudit} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl">
                ← New Audit
              </button>
              <button 
                onClick={handleShare} 
                className="flex-1 border border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Share Results"}
              </button>
            </div>

            {totalSavings > 500 && (
              <div className="bg-purple-600/20 rounded-2xl border border-purple-500/30 p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">💎 Unlock Enterprise Pricing</h3>
                <p className="text-slate-300 text-sm mb-4">Credex offers discounted AI credits. Book a free consultation.</p>
                <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-white">
                  Book Consultation →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
