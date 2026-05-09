import { NextResponse } from "next/server";
import { db } from "@/lib/db-sqlite";

export async function GET() {
  try {
    const audits = db.prepare("SELECT id, company_name, total_savings, created_at FROM audits ORDER BY created_at DESC LIMIT 10").all();
    return NextResponse.json({ success: true, audits });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
