import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "audit.db");
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    share_id TEXT UNIQUE NOT NULL,
    email TEXT,
    company_name TEXT,
    team_size INTEGER,
    use_case TEXT,
    tools_data TEXT,
    recommendations TEXT,
    total_savings INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    team_size INTEGER,
    savings INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("✅ Database initialized at:", dbPath);

// Save audit function
export function saveAudit(data: {
  shareId: string;
  companyName: string;
  teamSize: number;
  useCase: string;
  tools: any;
  recommendations: any;
  totalSavings: number;
  email?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO audits (id, share_id, company_name, team_size, use_case, tools_data, recommendations, total_savings, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    data.shareId,
    data.shareId,
    data.companyName || null,
    data.teamSize,
    data.useCase,
    JSON.stringify(data.tools),
    JSON.stringify(data.recommendations),
    data.totalSavings,
    data.email || null
  );
  
  return data.shareId;
}

// Get audit function - SINGLE DECLARATION
export function getAudit(shareId: string) {
  const stmt = db.prepare('SELECT * FROM audits WHERE share_id = ?');
  return stmt.get(shareId);
}

// Save lead function
export function saveLead(email: string, companyName: string, teamSize: number, savings: number) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO leads (id, email, company_name, team_size, savings)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const id = Math.random().toString(36).substring(2, 10);
  stmt.run(id, email, companyName || null, teamSize, savings);
}

export { db };
