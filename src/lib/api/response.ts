import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiError(message: string, status = 400, code?: string) {
  return NextResponse.json({ error: { message, code } }, { status });
}
