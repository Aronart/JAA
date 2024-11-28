import { NextResponse } from "next/server";

// Temporary in-memory storage
const results: Record<string, string> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recordId, result } = body;

    if (!recordId || !result) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Store the result in memory
    results[recordId] = result;
    console.log(`Stored result for Record ID: ${recordId}`);

    return NextResponse.json({ success: true, message: "Result received" });
  } catch (error) {
    console.error("Error handling result:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process result" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recordId = searchParams.get("id");

  if (!recordId || !results[recordId]) {
    return NextResponse.json(
      { success: false, error: "Result not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, result: results[recordId] });
}