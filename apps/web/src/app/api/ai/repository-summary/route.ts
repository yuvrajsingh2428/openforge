import { NextResponse } from "next/server";
import { generateRepositorySummary } from "@openforge/ai-analysis";
import type { RepositoryContext } from "@openforge/ai-analysis";

export async function POST(request: Request) {
  try {
    const body = await request.json() as RepositoryContext;
    const result = await generateRepositorySummary(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate repository summary";
    return NextResponse.json({ success: false, data: null, error: message, cached: false, model: "", durationMs: 0 }, { status: 500 });
  }
}
