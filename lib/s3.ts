import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Config } from "./aws-config";

// Initialize S3 Client
const s3Client = new S3Client({
  region: s3Config.region,
  credentials: s3Config.credentials,
});

export interface CorrectionHistory {
  id: string;
  userId: string;
  originalText: string;
  correctedText: string;
  explanation: string;
  model: string;
  timestamp: string;
}

// Save correction to S3
export async function saveCorrectionToS3(
  userId: string,
  correction: Omit<CorrectionHistory, "id" | "userId" | "timestamp">
): Promise<string> {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  const correctionData: CorrectionHistory = {
    id,
    userId,
    timestamp,
    ...correction,
  };

  const key = `corrections/${userId}/${id}.json`;

  try {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: JSON.stringify(correctionData),
      ContentType: "application/json",
    });

    await s3Client.send(command);
    return id;
  } catch (error) {
    console.error("Error saving to S3:", error);
    throw new Error("Failed to save correction history");
  }
}

// Get correction from S3
export async function getCorrectionFromS3(
  userId: string,
  correctionId: string
): Promise<CorrectionHistory | null> {
  const key = `corrections/${userId}/${correctionId}.json`;

  try {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);
    const body = await response.Body?.transformToString();

    if (!body) {
      return null;
    }

    return JSON.parse(body) as CorrectionHistory;
  } catch (error) {
    console.error("Error getting from S3:", error);
    return null;
  }
}

// List user's correction history
export async function listUserCorrections(
  userId: string,
  limit: number = 50
): Promise<CorrectionHistory[]> {
  const prefix = `corrections/${userId}/`;

  try {
    const command = new ListObjectsV2Command({
      Bucket: s3Config.bucketName,
      Prefix: prefix,
      MaxKeys: limit,
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    // Fetch all correction files
    const corrections = await Promise.all(
      response.Contents.map(async (item) => {
        if (!item.Key) return null;

        try {
          const getCommand = new GetObjectCommand({
            Bucket: s3Config.bucketName,
            Key: item.Key,
          });

          const getResponse = await s3Client.send(getCommand);
          const body = await getResponse.Body?.transformToString();

          if (!body) return null;

          return JSON.parse(body) as CorrectionHistory;
        } catch (error) {
          console.error(`Error fetching ${item.Key}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls and sort by timestamp (newest first)
    return corrections
      .filter((c): c is CorrectionHistory => c !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error listing corrections:", error);
    return [];
  }
}

// Delete correction from S3
export async function deleteCorrectionFromS3(
  userId: string,
  correctionId: string
): Promise<boolean> {
  const key = `corrections/${userId}/${correctionId}.json`;

  try {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    return false;
  }
}
