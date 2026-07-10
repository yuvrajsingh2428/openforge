import { NextResponse } from "next/server";
import { z } from "zod";

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: any;
}

export function standardResponse<T>(data: T, status: number = 200, meta?: any): NextResponse<ApiResponseEnvelope<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta
    },
    { status }
  );
}

export function errorResponse(message: string, status: number = 500, details?: any): NextResponse<ApiResponseEnvelope<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: message,
      meta: details
    },
    { status }
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
  } catch (error: any) {
    return {
      success: false,
      errorResponse: errorResponse(`Invalid request structure: ${error.message}`, 400)
    };
  }
}
