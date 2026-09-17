import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@openforge/config";

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta: any;
}

const SECRET_PATTERNS = [
  /ghp_[a-zA-Z0-9]{36,255}/g,
  /github_pat_[a-zA-Z0-9_]{30,255}/g,
  /sk-or-v1-[a-zA-Z0-9]{32,255}/g,
  /sk-[a-zA-Z0-9]{32,255}/g,
  /Bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*/gi,
];

export function sanitizeError(error: unknown, fallbackMessage: string = "An internal error occurred"): string {
  if (env.NODE_ENV === "production") {
    // Prevent internal database / stack / key exposure in production
    return fallbackMessage;
  }
  let message = error instanceof Error ? error.message : String(error);
  for (const pattern of SECRET_PATTERNS) {
    message = message.replace(pattern, "[REDACTED_SECRET]");
  }
  return message;
}

export function standardResponse<T>(
  data: T,
  status: number = 200,
  meta: any = {},
  headers: Record<string, string> = {}
): NextResponse<ApiResponseEnvelope<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta
    },
    { status, headers }
  );
}

export function errorResponse(
  message: string,
  status: number = 500,
  details: any = {},
  headers: Record<string, string> = {}
): NextResponse<ApiResponseEnvelope<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: message,
      meta: details
    },
    { status, headers }
  );
}

export async function validateRequest<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; errorResponse: NextResponse }> {
  try {
    const method = req.method.toUpperCase();
    let dataToValidate: any;
    
    if (method === "GET") {
      const { searchParams } = new URL(req.url);
      dataToValidate = Object.fromEntries(searchParams.entries());
    } else {
      dataToValidate = await req.json();
    }

    const parsed = schema.safeParse(dataToValidate);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
      return {
        success: false,
        errorResponse: errorResponse(`Validation failed: ${errorMsg}`, 400, parsed.error.format())
      };
    }
    return { success: true, data: parsed.data };
  } catch (error: unknown) {
    return {
      success: false,
      errorResponse: errorResponse(`Invalid request structure: ${sanitizeError(error, "Malformed request body")}`, 400)
    };
  }
}
