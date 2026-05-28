"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setResult((prev) => prev + chunk);
    }

    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto mt-16 px-5 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">RepoRadar</h1>
      <p className="text-gray-500 mt-2">
      </p>

      <div className="flex gap-2 mt-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="e.g. AI agents in TypeScript"
          className="flex-1 px-4 py-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-5 py-2 text-base text-white bg-blue-500 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && result === "" && (
        <p className="mt-6 text-gray-400 italic">Searching GitHub...</p>
      )}

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl text-gray-900 leading-relaxed prose prose-gray max-w-none">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}