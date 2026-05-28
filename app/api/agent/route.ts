import { createMCPClient } from "@ai-sdk/mcp";
// import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { getGithubMCPTools } from "@/lib/github-mcp";
import { streamText, stepCountIs } from "ai";

export async function POST(req: Request) {
  const { topic } = await req.json();

  let tools;

  try {
    tools = await getGithubMCPTools();
  } catch (e) {
    return Response.json(
      {
        error:
          "Could not connect to GitHub MCP Server. Check your token and try again.",
      },
      { status: 503 },
    );
  }

  const result = streamText({
    // model: anthropic("claude-sonnet-4-5"),
    model: google("gemini-2.5-flash"),
    tools,
    stopWhen: stepCountIs(5),
    system: `You are RepoRadar, a GitHub research assistant.
    When given a topic, silently use your tools to research GitHub, then respond.

    STRICT RULES:
    - Your response must begin immediately with a markdown heading. No preamble.
    - Do NOT write anything before the first heading.
    - Do NOT narrate your process ("I'll search...", "Let me look...", "Great, I found...").
    - Do NOT explain what you are about to do. Just do it and then write the summary.
    - No emojis anywhere in the response.

    Your summary must cover:
    - What the repo does
    - Its popularity (stars, forks)
    - The language it is written in  
    - What problems people are currently reporting in open issues

    Format with clear markdown headings and bullet points.`,
    prompt: `Research this topic on GitHub and give me a summary: ${topic}`,
  });

  return result.toTextStreamResponse();
}
