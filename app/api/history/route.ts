import { NextResponse } from "next/server";
import { listUserCorrections } from "@/lib/s3";

export async function GET(request: Request) {
  try {
    // Get user ID from query parameters or token
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Fetch correction history from S3
    const corrections = await listUserCorrections(userId, limit);

    return NextResponse.json({
      corrections,
      count: corrections.length,
    });
  } catch (error: any) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch correction history" },
      { status: 500 }
    );
  }
}
