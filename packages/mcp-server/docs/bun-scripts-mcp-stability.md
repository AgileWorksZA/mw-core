# Bun-Scripts MCP Server Stability Documentation

## Server Implementation Requirements

### Process Isolation
The MCP server MUST protect itself from being terminated by client operations:

```typescript
// MCP server should implement process isolation
class BunScriptsMCPServer {
  constructor() {
    // Set process title to identify MCP server
    process.title = 'mcp-bun-scripts-server';
    
    // Ignore SIGTERM from child processes
    process.on('SIGTERM', (signal) => {
      console.log('MCP Server received SIGTERM, staying alive...');
    });
  }
}
```

### Safe Process Management
The MCP server should provide safe process management methods:

```typescript
// Instead of allowing dangerous commands, provide safe alternatives
export const tools = {
  stopAllScripts: {
    description: "Safely stop all running scripts without affecting MCP server",
    handler: async () => {
      const runningScripts = await getRunningScripts();
      for (const script of runningScripts) {
        // Kill only child processes, not the MCP server
        if (script.pid !== process.pid) {
          process.kill(script.pid, 'SIGTERM');
        }
      }
    }
  },
  
  restartScript: {
    description: "Safely restart a script",
    handler: async ({ scriptName, workspace }) => {
      // Stop existing instance
      await stopScript({ scriptName, workspace });
      // Wait for clean shutdown
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Start new instance
      return await runScript({ scriptName, workspace });
    }
  }
}
```

### Client Safety Instructions
The MCP server should provide clear warnings to clients:

```json
{
  "name": "bun-scripts",
  "version": "1.0.0",
  "warnings": {
    "process_management": "Never use 'killall bun' or similar broad process killers. This will terminate the MCP server itself.",
    "recommended_usage": "Always use the provided MCP tools for process management instead of direct system commands."
  }
}
```

### Error Recovery
Implement automatic recovery mechanisms:

```typescript
class MCPServer {
  private healthCheck() {
    // Monitor child processes
    setInterval(() => {
      this.runningScripts.forEach((script, key) => {
        try {
          process.kill(script.pid, 0); // Check if process exists
        } catch (e) {
          // Process died unexpectedly
          this.runningScripts.delete(key);
          this.emit('script-died', { scriptName: script.name, workspace: script.workspace });
        }
      });
    }, 5000);
  }
}
```

### Workspace Resolution
Handle workspace name changes gracefully:

```typescript
// Cache workspace names and update periodically
class WorkspaceResolver {
  private cache = new Map<string, string>();
  
  async resolveWorkspace(name: string): Promise<string> {
    // Try cache first
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    
    // Scan package.json files
    const workspaces = await this.scanWorkspaces();
    this.updateCache(workspaces);
    
    // Fallback to partial matching
    const match = Array.from(this.cache.entries())
      .find(([key]) => key.includes(name) || name.includes(key));
    
    if (match) {
      return match[1];
    }
    
    throw new Error(`Workspace "${name}" not found. Available: ${Array.from(this.cache.keys()).join(', ')}`);
  }
}
```

### MCP Protocol Extensions
Suggest additions to the MCP protocol for better process management:

```typescript
// Proposed MCP extensions
interface ProcessManagementExtension {
  // Allow MCP servers to declare they manage processes
  capabilities: {
    processManagement: {
      supported: true,
      isolation: true,
      safeKillAll: true
    }
  },
  
  // Provide process metadata
  tools: {
    getProcessInfo: {
      returns: {
        mcp_server_pid: number,
        managed_processes: Array<{
          pid: number,
          name: string,
          safe_to_kill: boolean
        }>
      }
    }
  }
}
```

## Implementation Checklist for MCP Server Developers

- [ ] Implement process isolation to prevent MCP server termination
- [ ] Provide safe process management tools that protect the server
- [ ] Add clear warnings in capability descriptions
- [ ] Implement health monitoring for managed processes
- [ ] Handle workspace resolution dynamically
- [ ] Add recovery mechanisms for unexpected failures
- [ ] Document all safety considerations in tool descriptions
- [ ] Consider implementing a "safe mode" that prevents dangerous operations

## Testing Requirements

1. **Isolation Test**: Verify MCP server survives `killall bun` from managed processes
2. **Recovery Test**: Ensure server can recover from partial failures
3. **Workspace Test**: Handle package.json name changes without restart
4. **Safety Test**: Verify all dangerous operations are blocked or made safe

This documentation should be included with any MCP server that manages processes to ensure stability and reliability.