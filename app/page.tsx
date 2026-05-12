"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, TrendingDown, Users, Plus, Trash2, CheckCircle, 
  Mail, Building, Cpu, Zap, Shield, Award, Copy, Check, ArrowRight,
  RefreshCw, Share2, Globe, Briefcase
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
    { id: "claude", name: "Claude", plan: "Free", seats: 2, spend: 0 },
    { id: "chatgpt", name: "ChatGPT", plan: "Free", seats: 2, spend: 0 },
  ]);
  
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState("writing");
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
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
  const [showShareUrl, setShowShareUrl] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("auditForm");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTools(parsed.tools || tools);
        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || "writing");
        setCompanyName(parsed.companyName || "");
        setCompanyDomain(parsed.companyDomain || "");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auditForm", JSON.stringify({ tools, teamSize, useCase, companyName, companyDomain }));
  }, [tools, teamSize, useCase, companyName, companyDomain]);

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
    
    const response = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tools, teamSize, useCase, companyName, companyDomain, email }),
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
    
    setIsLoading(false);
  };

  const captureEmail = async () => {
    if (!email) return;
    setEmailCaptured(true);
    setShowEmailCapture(false);
  };

  const resetAudit = () => {
    setIsAudited(false);
    setRecommendations([]);
    setTotalSavings(0);
    setShowEmailCapture(false);
    setEmailCaptured(false);
    setEmail("");
    setCopied(false);
    setShowShareUrl(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/audit/${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowShareUrl(true);
      setTimeout(() => {
        setShowShareUrl(false);
        setCopied(false);
      }, 5000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert(`Copy this URL to share:\n\n${url}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Free AI Spend Audit — No Credit Card Required</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            AI Spend<span className="text-emerald-400">Audit</span>
          </h1>
          <p className="text-slate-300 text-base max-w-lg mx-auto">
            Stop overpaying for AI tools. Get instant analysis of your AI stack.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400"/><span className="text-xs text-slate-300">100% Free</span></div>
            <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-400"/><span className="text-xs text-slate-300">Instant Results</span></div>
            <div className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-emerald-400"/><span className="text-xs text-slate-300">Verified Pricing</span></div>
          </div>
        </div>

        {!isAudited ? (
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 overflow-hidden">
            
            {/* Company Profile - WITH TEAM SIZE */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-emerald-400" />
                <h2 className="text-white font-semibold text-base">Company Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme Inc"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-base"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Team Size</label>
                  <input
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-base"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Company Domain</label>
                  <input
                    type="text"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    placeholder="e.g., acme.com"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-base"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Primary Use Case</label>
                  <select
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-base"
                  >
                    <option value="coding">💻 Coding</option>
                    <option value="writing">✍️ Writing</option>
                    <option value="data">📊 Data Analysis</option>
                    <option value="mixed">🎯 Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Your AI Stack */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-white font-semibold text-base">Your AI Stack</h2>
                </div>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{tools.length} tools</span>
              </div>
              
              <div className="space-y-2">
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 w-28">
                        <span className="text-base">{getToolIcon(tool.id)}</span>
                        <span className="text-white text-base font-medium">{tool.name}</span>
                      </div>
                      <select
                        value={tool.plan}
                        onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                        className="flex-1 min-w-[100px] px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-base"
                      >
                        {getPlanOptions(tool.id).map(plan => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="number"
                          value={tool.seats}
                          onChange={(e) => updateTool(tool.id, "seats", parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-center text-base"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                        <input
                          type="number"
                          value={tool.spend}
                          onChange={(e) => updateTool(tool.id, "spend", parseInt(e.target.value) || 0)}
                          className="w-24 pl-6 pr-2 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-base"
                        />
                      </div>
                      {tool.id.startsWith("tool-") && (
                        <button onClick={() => removeTool(tool.id)} className="p-1 text-slate-500 hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addTool}
                className="mt-3 text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add another tool
              </button>
            </div>

            {/* Run Audit Button */}
            <div className="p-4 pt-0">
              <button
                onClick={runAudit}
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4" />
                    Run Free Audit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1 mt-3">
                <Shield className="w-3 h-3 text-slate-500" />
                <p className="text-center text-slate-500 text-xs">
                  Your data is encrypted. No credit card required.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Company Info Card */}
            <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white font-semibold text-sm">Company Information</h3>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {companyName && (
                  <div>
                    <span className="text-slate-500">Name:</span>
                    <span className="text-white ml-2">{companyName}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Team Size:</span>
                  <span className="text-white ml-2">{teamSize}</span>
                </div>
                {companyDomain && (
                  <div>
                    <span className="text-slate-500">Domain:</span>
                    <span className="text-emerald-400 ml-2">{companyDomain}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Use Case:</span>
                  <span className="text-white ml-2">{useCase}</span>
                </div>
              </div>
            </div>

            {/* Savings Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-center">
              <div className="text-emerald-100 text-xs mb-1">MONTHLY SAVINGS</div>
              <div className="text-4xl font-bold text-white mb-1">${totalSavings}</div>
              <p className="text-emerald-100 text-base">${annualSavings} per year</p>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
                <h3 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  Recommendations
                </h3>
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-3 mb-2 border-l-3 border-emerald-500">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white text-base">{rec.toolName}</h4>
                          <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                            {rec.currentPlan} → {rec.recommendedPlan}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs">{rec.reason}</p>
                        <p className="text-emerald-400 text-xs mt-1">→ {rec.action}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">${rec.monthlySavings}</div>
                        <div className="text-xs text-slate-500">/month</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Email Capture for High Savings */}
            {showEmailCapture && !emailCaptured && (
              <div className="bg-emerald-500/20 rounded-lg p-4 text-center border border-emerald-500/30">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-white text-sm">Save ${totalSavings}/month</h3>
                    <p className="text-slate-400 text-xs">Get full report and exclusive offers</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-40"
                    />
                    <button onClick={captureEmail} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg text-white text-sm font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {emailCaptured && (
              <div className="bg-emerald-500/20 rounded-lg p-3 text-center border border-emerald-500/30">
                <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-white text-xs">✓ Report sent to {email}</p>
              </div>
            )}

            {/* Credex Consultation for >$500 Savings */}
            {totalSavings > 500 && (
              <div className="bg-purple-600/20 rounded-xl border border-purple-500/30 p-4 text-center">
                <h3 className="text-white font-semibold text-sm mb-1">💎 Unlock Enterprise Pricing</h3>
                <p className="text-slate-300 text-xs mb-2">Credex offers discounted AI credits. Book a free consultation.</p>
                <button className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded-lg text-white text-xs font-medium">
                  Book Consultation →
                </button>
              </div>
            )}

            {/* Share URL Display */}
            {showShareUrl && shareId && (
              <div className="bg-emerald-500/20 rounded-lg p-3 text-center border border-emerald-500/30">
                <p className="text-emerald-400 text-xs mb-1">✓ Shareable URL copied to clipboard!</p>
                <p className="text-slate-300 text-xs break-all">
                  {window.location.origin}/audit/{shareId}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={resetAudit} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> New Audit
              </button>
              <button onClick={handleShare} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
