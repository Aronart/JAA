import { NextResponse } from "next/server";
import { getAirtableRecord } from "../../../lib/airtable"; // Ensure you have the lib/airtable.ts utility

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recordId = searchParams.get("id");

  if (!recordId) {
    return NextResponse.json(
      { success: false, error: "Missing recordId" },
      { status: 400 }
    );
  }

  try {
    const result = await getAirtableRecord(recordId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}