import { NextResponse } from "next/server";
import { generateIssueSummary } from "@openforge/ai-analysis";
import type { IssueContext } from "@openforge/ai-analysis";

export async function POST(request: Request) {
  try {
    const body = await request.json() as IssueContext;
    const result = await generateIssueSummary(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json({ success: false, data: null, error: message, cached: false, model: "", durationMs: 0 }, { status: 500 });
  }
}
