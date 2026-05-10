"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, TrendingDown, Users, Plus, Trash2, CheckCircle, 
  Mail, Building, Cpu, Zap, Shield, Award, Copy, Check, ArrowRight,
  DollarSign, X, Share2, Briefcase, BarChart3, FileText, PieChart,
  Hash, Calendar, Clock, Target, Globe, Star, Heart
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/audit/${shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-5 py-8">
        
        {/* Header - Green Text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm mb-4">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium tracking-wide">CORPORATE EDITION</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span className="text-gray-800">AI Spend</span>
            <span className="text-green-600">Audit</span>
          </h1>
          
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Stop overpaying for AI tools. Get instant analysis of your entire AI stack.
          </p>
          
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Shield className="w-3 h-3 text-green-600" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Zap className="w-3 h-3 text-green-600" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Award className="w-3 h-3 text-green-600" />
              <span>Verified Pricing</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isAudited ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Company Profile - Grey background */}
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-3.5 h-3.5 text-green-600" />
                  <h2 className="text-gray-700 font-medium text-sm">Company Profile</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter your company name"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Primary Use Case</label>
                    <select
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="coding">💻 Coding / Development</option>
                      <option value="writing">✍️ Writing / Content</option>
                      <option value="data">📊 Data Analysis</option>
                      <option value="research">🔬 Research</option>
                      <option value="mixed">🎯 Mixed / General</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Stack Section - Grey rows */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-green-600" />
                    <h2 className="text-gray-700 font-medium text-sm">Your AI Stack</h2>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                    {tools.length} tools
                  </span>
                </div>
                
                {/* Table Header - Grey text */}
                <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-2 py-1">
                  <div className="col-span-3 text-xs font-medium text-gray-400">Tool</div>
                  <div className="col-span-3 text-xs font-medium text-gray-400">Plan</div>
                  <div className="col-span-2 text-xs font-medium text-gray-400 text-center">Seats</div>
                  <div className="col-span-2 text-xs font-medium text-gray-400 text-center">Monthly ($)</div>
                  <div className="col-span-2 text-xs font-medium text-gray-400"></div>
                </div>
                
                <div className="space-y-2">
                  {tools.map((tool, idx) => (
                    <div
                      key={tool.id}
                      onMouseEnter={() => setHoveredRow(tool.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`bg-gray-50 rounded-lg p-2 border transition-all duration-200 ${
                        hoveredRow === tool.id ? 'border-green-200 shadow-sm' : 'border-gray-100'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                        <div className="col-span-3 flex items-center gap-2">
                          <span className="text-base">{getToolIcon(tool.id)}</span>
                          <span className="text-gray-700 font-medium text-sm">{tool.name}</span>
                        </div>
                        <div className="col-span-3">
                          <select
                            value={tool.plan}
                            onChange={(e) => updateTool(tool.id, "plan", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                          >
                            {getPlanOptions(tool.id).map(plan => (
                              <option key={plan} value={plan}>{plan}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="number"
                              value={tool.seats}
                              onChange={(e) => updateTool(tool.id, "seats", parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-center text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                            <input
                              type="number"
                              value={tool.spend}
                              onChange={(e) => updateTool(tool.id, "spend", parseInt(e.target.value) || 0)}
                              className="w-full pl-5 pr-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          {tool.id.startsWith("tool-") && (
                            <button onClick={() => removeTool(tool.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addTool}
                  className="mt-3 text-green-600 hover:text-green-700 text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another tool
                </button>
              </div>

              {/* Footer Summary - Grey background */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total Tools</span>
                  <span className="text-green-600 font-medium">{tools.length} tools</span>
                </div>
              </div>

              {/* Run Audit Button */}
              <div className="px-5 py-4 bg-white">
                <button
                  onClick={runAudit}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm"
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
                  <Shield className="w-3 h-3 text-gray-400" />
                  <p className="text-center text-gray-400 text-[11px]">
                    Your data is encrypted and completely private
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Savings Card - Green accent */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <div className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full mb-2">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <span className="text-[11px] text-green-700 font-medium">SAVINGS POTENTIAL</span>
                </div>
                <p className="text-gray-400 text-xs mb-1">Total Monthly Savings</p>
                <p className="text-3xl font-bold text-green-600 mb-1">${totalSavings}</p>
                <p className="text-gray-400 text-xs">That's ${annualSavings} per year</p>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                    <h3 className="text-gray-700 font-medium text-sm">Smart Recommendations</h3>
                  </div>
                  <div className="space-y-2">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 border-l-2 border-green-500">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-800 text-sm">{rec.toolName}</h4>
                              <span className="text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                                {rec.currentPlan} → {rec.recommendedPlan}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs">{rec.reason}</p>
                            <p className="text-green-600 text-xs mt-1">→ {rec.action}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-green-600">${rec.monthlySavings}</p>
                            <p className="text-[10px] text-gray-400">saved/month</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Capture */}
              {showEmailCapture && !emailCaptured && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <Mail className="w-4 h-4 text-green-600" />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-medium text-gray-700 text-sm">Save ${totalSavings}/month</h3>
                      <p className="text-gray-400 text-xs">Get full report and exclusive offers</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm w-44 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      <button onClick={captureEmail} className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg text-white text-sm font-medium">
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {emailCaptured && (
                <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-gray-600 text-xs">✓ Report sent to <span className="font-medium">{email}</span></p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={resetAudit} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium">
                  New Audit
                </button>
                <button onClick={handleShare} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Share Results"}
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
