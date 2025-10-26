import { type NextRequest, NextResponse } from "next/server"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown) {
  console.error("[Error]", error)

  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode })
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

export function withErrorHandler(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleError(error)
    }
  }
}
