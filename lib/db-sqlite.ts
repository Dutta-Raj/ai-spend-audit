// Mock database for Vercel - no actual database connection
// All data is stored in memory or not persisted

export const db = null;

export function saveAudit(data: any) {
  console.log("Mock save - Audit:", data.shareId);
  return data.shareId;
}

export function getAudit(shareId: string) {
  console.log("Mock get - Audit:", shareId);
  return null;
}

export function saveLead(email: string, companyName: string, teamSize: number, savings: number) {
  console.log("Mock save - Lead:", email);
}

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10);
}
