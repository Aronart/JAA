import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Ensure raw file data is processed
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Log all formData keys for debugging
    console.log("FormData keys:", Array.from(formData.keys()));

    const file = formData.get("files"); // Updated to match the key from the frontend

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    // Forward the file to the Make.com webhook
    const webhookFormData = new FormData();
    webhookFormData.append("file", file);

    const webhookUrl = "https://hook.eu2.make.com/m6ljwzz64sdeb81mo3b8by5waer7mzey"; // Replace with your actual Make webhook URL
    const makeResponse = await fetch(webhookUrl, {
      method: "POST",
      body: webhookFormData,
    });

    if (!makeResponse.ok) {
      const errorText = await makeResponse.text();
      console.error("Error from Make.com:", errorText);
      return NextResponse.json(
        { error: `Failed to send file to Make.com: ${makeResponse.statusText}` },
        { status: 500 }
      );
    }

    console.log("File sent to Make.com successfully!");
    return NextResponse.json({ success: true, message: "File sent to Make.com successfully" });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}