"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState("llama-3.3-70b-versatile");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to correct");
      return;
    }

    setLoading(true);
    setError("");
    setCorrectedText("");
    setExplanation("");

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText, model }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to correct text");
      }

      setCorrectedText(data.correctedText);
      setExplanation(data.explanation);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      alert("Copied to clipboard!");
    } catch (error) {
      alert("Failed to copy");
    }
  };

  const handleClear = () => {
    setInputText("");
    setCorrectedText("");
    setExplanation("");
    setError("");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              ✨ Grammar Corrector
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-6">
          {/* Settings Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Correct Your Text</h2>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Recommended)</option>
              <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
              <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Text Areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter or paste your text here..."
                className="w-full h-64 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <p className="mt-2 text-sm text-slate-400">{inputText.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Corrected Text
              </label>
              <textarea
                value={correctedText}
                readOnly
                placeholder="Corrected text will appear here..."
                className="w-full h-64 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none resize-none"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!correctedText}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📋 Copy
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Correct Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleCorrect}
              disabled={loading || !inputText.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Correcting...
                </span>
              ) : (
                "✨ Correct Grammar"
              )}
            </button>
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="bg-slate-700 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-white mb-3">📝 Explanation</h3>
              <div className="text-slate-300 whitespace-pre-wrap">{explanation}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Powered by Groq&apos;s Free LLM API • Built with Next.js</p>
        </div>
      </main>
    </div>
  );
}
