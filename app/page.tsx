import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6">
          ✨ AI Grammar Corrector
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8">
          Perfect your writing with AI-powered grammar correction
        </p>
        <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
          Powered by advanced language models, our tool helps you write with confidence.
          Correct grammar, spelling, and punctuation errors instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border-2 border-slate-600 hover:border-slate-500 transition-all duration-200 text-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast & Accurate</h3>
            <p className="text-slate-400">
              Get instant corrections powered by state-of-the-art AI models
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-slate-400">
              Your data is protected with industry-standard security
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Learn & Improve</h3>
            <p className="text-slate-400">
              Get detailed explanations for every correction
            </p>
          </div>
        </div>

        <div className="mt-16 text-slate-400 text-sm">
          <p>Powered by Groq&apos;s Free LLM API • Built with Next.js & TypeScript</p>
        </div>
      </div>
    </div>
  );
}
