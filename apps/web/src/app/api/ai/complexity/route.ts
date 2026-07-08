import { NextResponse } from "next/server";
import { generateComplexityAnalysis } from "@openforge/ai-analysis";
import type { IssueContext } from "@openforge/ai-analysis";

export async function POST(request: Request) {
  try {
    const body = await request.json() as IssueContext;
    const result = await generateComplexityAnalysis(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to analyze complexity";
    return NextResponse.json({ success: false, data: null, error: message, cached: false, model: "", durationMs: 0 }, { status: 500 });
  }
}
