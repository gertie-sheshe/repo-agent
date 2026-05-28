# RepoAgent

A Next.js AI agent that takes a topic, searches GitHub for the most relevant repository, 
checks its open issues, and streams back a structured summary — all powered by the 
GitHub MCP Server and Vercel AI SDK.

## What it does

Type a topic like "AI agents TypeScript" and the agent will:

1. Connect to GitHub's remote MCP Server
2. Search for the most popular and relevant repositories on that topic
3. Pick the most interesting one and fetch its open issues
4. Stream a structured markdown summary back to you in real time

## Tech stack

- [Next.js 14](https://nextjs.org/) — App Router
- [Vercel AI SDK](https://ai-sdk.dev/) — agentic loop and streaming
- [GitHub MCP Server](https://github.com/github/github-mcp-server) — remote MCP Server hosted by GitHub
- Google Gemini 2.5 Flash — LLM
- Tailwind CSS + `@tailwindcss/typography` — styling

## Getting started

### Prerequisites

- Node.js 18+
- A [GitHub Personal Access Token](https://github.com/settings/tokens) with `Public repositories` access
- A Google AI API key (or swap in your preferred provider)

### Installation

```bash
git clone https://github.com/your-username/repo-radar
cd repo-radar
npm install
```

### Environment variables

Create a `.env.local` file in the root:

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure
repo-radar/
├── app/
│   ├── api/
│   │   └── agent/
│   │       └── route.ts      # Streaming agent API route
│   ├── page.tsx              # Chat UI
│   └── layout.tsx
├── lib/
│   └── github-mcp.ts         # MCP client with cached tool discovery
└── .env.local

## Key concepts

**MCP (Model Context Protocol)** — a standard protocol that lets AI agents connect 
to external tool providers. The GitHub MCP Server exposes GitHub's API as a set of 
tools the LLM can call. Your app acts as the MCP Client.

**Tool discovery vs tool invocation** — when the agent starts, the MCP Client fetches 
the list of available tools once and caches them. Individual tool calls only happen 
when the LLM decides it needs them during the agentic loop.

**Agentic loop** — `streamText` with `stopWhen: stepCountIs(5)` runs the LLM in a 
loop, executing tool calls automatically until the model produces a final text response or hits the step limit.
