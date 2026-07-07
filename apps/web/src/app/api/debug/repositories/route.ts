import { NextResponse } from "next/server";
import { getRepositories } from "@openforge/github-client";

export async function GET() {
  try {
    const data = await getRepositories("stars:>1000 sort:stars-desc");
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
