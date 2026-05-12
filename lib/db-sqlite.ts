// Dummy database module for Vercel deployment
// No actual database connection needed for basic audit

export const db = null;

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function saveAudit(data: any) {
  console.log("Audit saved (mock):", data.shareId);
  return data.shareId;
}

export function getAudit(shareId: string) {
  const stmt = db.prepare('SELECT * FROM audits WHERE share_id = ?');
  return stmt.get(shareId);
}

export function getAudit(shareId: string) {
  const stmt = db.prepare('SELECT * FROM audits WHERE share_id = ?');
  return stmt.get(shareId);
}
