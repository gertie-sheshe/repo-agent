import { createMCPClient } from "@ai-sdk/mcp";

type MCPTools = Awaited<ReturnType<Awaited<ReturnType<typeof createMCPClient>>["tools"]>>;

let tools: MCPTools | null = null;

export async function getGithubMCPTools(): Promise<MCPTools> {
  if (tools) return tools;

  const client = await createMCPClient({
    transport: {
      type: "http",
      url: "https://api.githubcopilot.com/mcp/",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    },
  });

  tools = await client.tools();
  return tools;
}