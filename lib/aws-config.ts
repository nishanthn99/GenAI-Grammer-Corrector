// AWS Cognito Configuration
export const cognitoConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
};

// AWS S3 Configuration
export const s3Config = {
  region: process.env.AWS_S3_REGION || 'us-east-1',
  bucketName: process.env.AWS_S3_BUCKET_NAME || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

// Validate configuration
export function validateAWSConfig() {
  const errors: string[] = [];

  if (!cognitoConfig.userPoolId) {
    errors.push('NEXT_PUBLIC_COGNITO_USER_POOL_ID is not set');
  }
  if (!cognitoConfig.clientId) {
    errors.push('NEXT_PUBLIC_COGNITO_CLIENT_ID is not set');
  }
  if (!s3Config.bucketName) {
    errors.push('AWS_S3_BUCKET_NAME is not set');
  }
  if (!s3Config.credentials.accessKeyId) {
    errors.push('AWS_ACCESS_KEY_ID is not set');
  }
  if (!s3Config.credentials.secretAccessKey) {
    errors.push('AWS_SECRET_ACCESS_KEY is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
