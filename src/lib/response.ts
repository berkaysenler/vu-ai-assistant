import { NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function successResponse(message: string, data?: any): NextResponse {
  const response: ApiResponse = {
    success: true,
    message,
    ...(data && { data }),
  };

  return NextResponse.json(response, { status: 200 });
}

export function errorResponse(
  message: string,
  status: number = 400
): NextResponse {
  const response: ApiResponse = {
    success: false,
    message,
  };

  return NextResponse.json(response, { status });
}

export function validationErrorResponse(message: string): NextResponse {
  return errorResponse(message, 422);
}

export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse {
  return errorResponse(message, 401);
}

export function notFoundResponse(message: string = "Not found"): NextResponse {
  return errorResponse(message, 404);
}

export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse {
  return errorResponse(message, 500);
}
