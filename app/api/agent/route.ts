import { createMCPClient } from "@ai-sdk/mcp";
// import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { streamText, stepCountIs } from "ai";

const mcpClient = await createMCPClient({
    transport: {
      type: "http",
      url: "https://api.githubcopilot.com/mcp/",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    },
  });

  const tools = await mcpClient.tools();

export async function POST(req: Request) {
  const { topic } = await req.json();

  const result = streamText({
    // model: anthropic("claude-sonnet-4-5"),
    model: google("gemini-2.5-flash"),
    tools,
    stopWhen: stepCountIs(5),
    system: `You are RepoRadar, a GitHub research assistant. 
        When given a topic, search GitHub and respond with ONLY the final structured markdown summary.
        Do NOT narrate your process or thinking. Do NOT say things like "I'll research..." or "Let me search...".
        Just silently use the tools and then return the final summary directly.

        Your summary must cover:
        - What the repo does
        - Its popularity (stars, forks)
        - The language it is written in
        - What problems people are currently reporting in open issues

        Format with clear markdown headings and bullet points. No emojis.`,
    prompt: `Research this topic on GitHub and give me a summary: ${topic}`,
    onFinish: async () => {
      await mcpClient.close();
    },
  });

  return result.toTextStreamResponse();
}
