# AI Grammar Corrector - Next.js Application

A modern, full-stack AI-powered grammar correction application built with Next.js, TypeScript, AWS Cognito, and AWS S3. Features secure user authentication and correction history storage with Groq's free LLM API for intelligent grammar corrections.

## Features

✨ **AI-Powered Corrections** - Uses Groq's free API with Llama 3.3 70B and other models
🔐 **AWS Cognito Authentication** - Enterprise-grade user authentication
📦 **AWS S3 Storage** - Persistent correction history storage
📝 **Detailed Explanations** - Get insights into what was corrected and why
📚 **Correction History** - View and manage your past corrections
🎨 **Modern UI** - Beautiful dark-themed interface with Tailwind CSS
🔒 **Secure** - AWS security best practices, encrypted storage
⚡ **Fast** - Built on Next.js 15 with App Router
📱 **Responsive** - Works perfectly on all devices
☁️ **Cloud-Native** - Fully integrated with AWS services

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: AWS Cognito
- **Storage**: AWS S3
- **AI Provider**: Groq API (Free)
- **Models**: Llama 3.3 70B, Llama 3.1 70B, Mixtral 8x7B
- **AWS SDK**: @aws-sdk/client-s3, amazon-cognito-identity-js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key (free from [console.groq.com](https://console.groq.com))

### Installation

1. **Clone or navigate to the project directory**:
```bash
cd grammar-corrector-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:

Edit the `.env.local` file and add your Groq API key:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
GROQ_API_KEY=your-groq-api-key-here
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Create an Account
- Click "Get Started Free" on the home page
- Fill in your name, email, and password
- Click "Sign Up"

### 2. Sign In
- Use your email and password to log in
- You'll be redirected to the dashboard

### 3. Correct Your Text
- Type or paste your text in the left text area
- Select your preferred AI model (Llama 3.3 70B recommended)
- Click "✨ Correct Grammar"
- View the corrected text and explanation
- Copy the corrected text with one click

### 4. Sign Out
- Click "Sign Out" in the header when done

## Project Structure

```
grammar-corrector-app/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth.js API routes
│   │   ├── register/             # User registration endpoint
│   │   └── correct/              # Grammar correction endpoint
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── dashboard/                # Main application (protected)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home/landing page
│   └── providers.tsx             # Session provider wrapper
├── lib/
│   └── auth.ts                   # NextAuth configuration
├── .env.local                    # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### User Management
- `POST /api/register` - Register new user

### Grammar Correction
- `POST /api/correct` - Correct text (requires authentication)

## Available Models

1. **Llama 3.3 70B Versatile** (Recommended)
   - Best balance of speed and quality
   - Excellent for grammar correction

2. **Llama 3.1 70B Versatile**
   - High-quality corrections
   - Slightly slower than 3.3

3. **Mixtral 8x7B**
   - Fast and efficient
   - Good for quick corrections

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based session management
- Protected API routes (authentication required)
- Secure HTTP-only cookies
- CSRF protection via NextAuth.js

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure Node.js 18+ is available
- Set all environment variables
- Run `npm run build && npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes |
| `GROQ_API_KEY` | Your Groq API key | Yes |

## Troubleshooting

### "Invalid API key" error
- Verify your Groq API key in `.env.local`
- Ensure the key starts with `gsk_`
- Check if the key is active in Groq Console

### Authentication not working
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check if `NEXTAUTH_URL` matches your domain

### Build errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Ensure all dependencies are installed

## Limitations

- User data is stored in-memory (resets on server restart)
- For production, integrate a database (PostgreSQL, MongoDB, etc.)
- Rate limits apply based on Groq's free tier

## Future Enhancements

- [ ] Database integration (Prisma + PostgreSQL)
- [ ] User profile management
- [ ] Correction history
- [ ] Multiple language support
- [ ] Tone adjustment options
- [ ] Export to PDF/Word
- [ ] Real-time collaboration
- [ ] Browser extension

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Credits

- Built with [Next.js](https://nextjs.org/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- AI powered by [Groq](https://groq.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Support

For issues or questions:
1. Check this README
2. Review [Groq's documentation](https://console.groq.com/docs)
3. Check [NextAuth.js docs](https://next-auth.js.org/)

---

**Note**: This is a demo application. For production use, implement proper database storage, error handling, and security measures.
