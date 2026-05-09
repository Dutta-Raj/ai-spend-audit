import { runAudit } from "../lib/audit-engine";

describe("AI Spend Audit - Engine Tests", () => {
  
  test("Test 1: Cursor Business with 2 seats should recommend Pro", () => {
    const tools = [
      { id: "cursor", name: "Cursor", plan: "Business", seats: 2, spend: 80 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.recommendations[0].toolName).toBe("Cursor");
    expect(result.recommendations[0].action).toContain("Pro");
  });

  test("Test 2: Claude Team with 2 seats should recommend Pro", () => {
    const tools = [
      { id: "claude", name: "Claude", plan: "Team", seats: 2, spend: 60 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedPlan).toBe("Pro");
  });

  test("Test 3: Copilot Business with 1 seat should recommend Individual", () => {
    const tools = [
      { id: "copilot", name: "GitHub Copilot", plan: "Business", seats: 1, spend: 19 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.totalMonthlySavings).toBe(9);
    expect(result.recommendations[0].action).toContain("Individual");
  });

  test("Test 4: Cursor Pro with 2 seats properly priced should return no savings", () => {
    const tools = [
      { id: "cursor", name: "Cursor", plan: "Pro", seats: 2, spend: 40 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.recommendations.length).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });

  test("Test 5: ChatGPT Team with 2 seats should recommend Plus", () => {
    const tools = [
      { id: "chatgpt", name: "ChatGPT", plan: "Team", seats: 2, spend: 60 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].action).toContain("Plus");
  });

  test("Test 6: Cursor Hobby with payment should recommend free", () => {
    const tools = [
      { id: "cursor", name: "Cursor", plan: "Hobby", seats: 3, spend: 80 }
    ];
    
    const result = runAudit(tools);
    
    expect(result.totalMonthlySavings).toBe(80);
    expect(result.recommendations[0].action).toContain("free");
  });
});
