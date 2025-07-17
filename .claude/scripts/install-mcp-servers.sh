claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
claude mcp add "react-router docs" -- npx -y mcp-remote https://gitmcp.io/remix-run/react-router
claude mcp add "clerk docs" -- npx -y mcp-remote https://gitmcp.io/clerk/javascript
claude mcp add "puppeteer" -- npx -y @modelcontextprotocol/server-puppeteer@latest
claude mcp add "desktop commander" -- npx -y @wonderwhy-er/desktop-commander@latest
claude mcp add "sequential thinking" -- npx -y mcp-sequentialthinking-tools@latest
  claude mcp add "sequential thinking" -e REGISTRY_URL=https://tweakcn.com/r/themes/registry.json -- npx -y shadcn@canary@latest registry:mcp
"shadcn": {
      "command": "npx",
      "args": [
        "-y",
        "shadcn@canary",
        "registry:mcp"
      ],
      "env": {
        "REGISTRY_URL": "https://tweakcn.com/r/themes/registry.json"
      }
    }