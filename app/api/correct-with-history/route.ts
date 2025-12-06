import { NextResponse } from "next/server";
import { saveCorrectionToS3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    // Get user ID from Cognito token (passed in headers)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Extract token and decode (in production, verify the JWT)
    const token = authHeader.substring(7);
    
    // For now, we'll extract userId from request body
    // In production, decode and verify the Cognito JWT token
    const { text, model = "llama-3.3-70b-versatile", userId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Call Groq API for grammar correction
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `You are an expert grammar correction assistant. Your task is to:
1. Correct all grammar, spelling, and punctuation errors
2. Improve sentence structure and clarity
3. Maintain the original meaning and tone
4. Provide the corrected text first
5. Then provide a brief explanation of the main corrections made

Format your response as:
CORRECTED TEXT:
[corrected version here]

EXPLANATION:
[brief explanation of main corrections]`,
            },
            {
              role: "user",
              content: `Please correct the following text:\n\n${text}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the response
    const parts = result.split(/EXPLANATION:|CORRECTIONS:/i);
    let correctedText = "";
    let explanation = "";

    if (parts.length >= 2) {
      correctedText = parts[0].replace(/CORRECTED TEXT:/i, "").trim();
      explanation = parts[1].trim();
    } else {
      correctedText = result.trim();
    }

    // Save to S3
    try {
      const correctionId = await saveCorrectionToS3(userId, {
        originalText: text,
        correctedText,
        explanation,
        model,
      });

      return NextResponse.json({
        correctedText,
        explanation,
        originalText: text,
        correctionId,
        savedToHistory: true,
      });
    } catch (s3Error) {
      // If S3 save fails, still return the correction
      console.error("Failed to save to S3:", s3Error);
      return NextResponse.json({
        correctedText,
        explanation,
        originalText: text,
        savedToHistory: false,
        warning: "Correction successful but failed to save to history",
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to correct text" },
      { status: 500 }
    );
  }
}
