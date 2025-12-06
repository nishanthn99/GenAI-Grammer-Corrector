# AWS Setup Guide for Grammar Corrector

This guide will walk you through setting up AWS Cognito for authentication and AWS S3 for storing correction history.

## Prerequisites

- An AWS Account
- AWS CLI installed (optional but recommended)
- Basic understanding of AWS services

## Part 1: AWS Cognito Setup

### Step 1: Create a Cognito User Pool

1. **Go to AWS Console**
   - Navigate to [AWS Cognito Console](https://console.aws.amazon.com/cognito)
   - Click "Create user pool"

2. **Configure Sign-in Experience**
   - Select "Email" as sign-in option
   - Click "Next"

3. **Configure Security Requirements**
   - Password policy: Choose your preferred settings (default is fine)
   - Multi-factor authentication: Optional (can enable later)
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-registration: Enable "Allow users to sign themselves up"
   - Required attributes: Select "name" and "email"
   - Click "Next"

5. **Configure Message Delivery**
   - Email provider: Choose "Send email with Cognito" (for testing)
   - For production, configure SES
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `grammar-corrector-users`
   - App client name: `grammar-corrector-client`
   - Client secret: Select "Don't generate a client secret"
   - Click "Next"

7. **Review and Create**
   - Review all settings
   - Click "Create user pool"

8. **Note Your Credentials**
   - After creation, note down:
     - **User Pool ID** (e.g., `us-east-1_XXXXXXXXX`)
     - **App Client ID** (found under "App integration" tab)
     - **AWS Region** (e.g., `us-east-1`)

### Step 2: Configure User Pool Settings

1. **App Integration Settings**
   - Go to your user pool
   - Click "App integration" tab
   - Under "App clients", click your app client
   - Note the Client ID

2. **Optional: Configure Domain**
   - Under "App integration" → "Domain"
   - Add a domain prefix for hosted UI (optional)

## Part 2: AWS S3 Setup

### Step 1: Create an S3 Bucket

1. **Go to S3 Console**
   - Navigate to [AWS S3 Console](https://console.aws.amazon.com/s3)
   - Click "Create bucket"

2. **Configure Bucket**
   - Bucket name: `grammar-corrector-history-[your-unique-id]`
     - Must be globally unique
     - Example: `grammar-corrector-history-12345`
   - AWS Region: Choose same region as Cognito (e.g., `us-east-1`)
   - Block Public Access: Keep all boxes checked (recommended)
   - Bucket Versioning: Optional (can enable for backup)
   - Click "Create bucket"

3. **Configure CORS (if needed for direct browser uploads)**
   - Go to your bucket
   - Click "Permissions" tab
   - Scroll to "Cross-origin resource sharing (CORS)"
   - Add this configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

### Step 2: Create IAM User for S3 Access

1. **Go to IAM Console**
   - Navigate to [AWS IAM Console](https://console.aws.amazon.com/iam)
   - Click "Users" → "Create user"

2. **Create User**
   - User name: `grammar-corrector-s3-user`
   - Access type: Select "Programmatic access"
   - Click "Next"

3. **Set Permissions**
   - Click "Attach policies directly"
   - Search for and select: `AmazonS3FullAccess` (or create custom policy below)
   - Click "Next"

4. **Custom Policy (Recommended for Production)**
   Instead of full access, create a custom policy:
   - Click "Create policy"
   - Choose JSON tab
   - Paste this policy (replace `YOUR-BUCKET-NAME`):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::YOUR-BUCKET-NAME/*",
           "arn:aws:s3:::YOUR-BUCKET-NAME"
         ]
       }
     ]
   }
   ```
   - Name it: `GrammarCorrectorS3Policy`
   - Create and attach to user

5. **Download Credentials**
   - After user creation, download the CSV with:
     - **Access Key ID**
     - **Secret Access Key**
   - ⚠️ **IMPORTANT**: Save these securely, you won't see them again!

## Part 3: Configure Environment Variables

Update your `.env.local` file with the credentials:

```env
# Groq API Configuration
GROQ_API_KEY=your-groq-api-key-here

# AWS Cognito Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id-here
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key

# AWS S3 Configuration
AWS_S3_BUCKET_NAME=grammar-corrector-history-12345
AWS_S3_REGION=us-east-1

# NextAuth (keeping for session management)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

## Part 4: Test Your Setup

### Test Cognito

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/signup`
3. Create a test account
4. Check your email for verification code
5. Verify your account
6. Try logging in

### Test S3

1. After logging in, try correcting some text
2. The correction should be saved to S3
3. Check your S3 bucket in AWS Console
4. You should see files under `corrections/[user-id]/`

## Security Best Practices

### For Production:

1. **Cognito**
   - Enable MFA (Multi-Factor Authentication)
   - Configure password policies
   - Set up email verification via SES
   - Enable advanced security features
   - Configure custom domains

2. **S3**
   - Enable bucket versioning
   - Enable server-side encryption
   - Set up lifecycle policies
   - Enable access logging
   - Use VPC endpoints if possible

3. **IAM**
   - Use least privilege principle
   - Rotate access keys regularly
   - Use IAM roles instead of access keys when possible
   - Enable CloudTrail for auditing

4. **Application**
   - Never commit `.env.local` to git
   - Use AWS Secrets Manager for production
   - Implement proper JWT verification
   - Add rate limiting
   - Enable HTTPS only

## Troubleshooting

### Cognito Issues

**"User pool not found"**
- Verify User Pool ID is correct
- Check AWS region matches

**"Invalid client id"**
- Verify App Client ID is correct
- Ensure client secret is not required

**"Email not verified"**
- Check spam folder for verification email
- Use Cognito console to manually verify user

### S3 Issues

**"Access Denied"**
- Verify IAM user has correct permissions
- Check bucket policy
- Verify access keys are correct

**"Bucket not found"**
- Verify bucket name is correct
- Check region matches

**"CORS error"**
- Add CORS configuration to bucket
- Verify allowed origins include your domain

## Cost Estimation

### AWS Cognito
- **Free Tier**: 50,000 MAUs (Monthly Active Users)
- **After Free Tier**: $0.0055 per MAU

### AWS S3
- **Storage**: $0.023 per GB/month (first 50 TB)
- **Requests**: 
  - PUT: $0.005 per 1,000 requests
  - GET: $0.0004 per 1,000 requests
- **Data Transfer**: First 100 GB/month free

### Estimated Monthly Cost (for small app)
- 100 users: ~$0.55 (Cognito)
- 1 GB storage: ~$0.02 (S3)
- 10,000 requests: ~$0.05 (S3)
- **Total**: ~$0.62/month

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Free Tier](https://aws.amazon.com/free/)

## Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Review IAM permissions
3. Verify environment variables
4. Check AWS service health dashboard
5. Review application logs

---

**Note**: Keep your AWS credentials secure and never commit them to version control!
