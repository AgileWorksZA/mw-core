# Dual Transport MCP Architecture Decision Record

## 📋 Decision Summary

**Decision**: Migrate MoneyWorks MCP server to official TypeScript SDK with shared core + transport adapters architecture to support both Claude (stdio) and ChatGPT (HTTP/SSE) protocols.

**Date**: January 2025  
**Status**: Approved for Implementation  
**Decision Makers**: Development Team  
**Stakeholders**: Claude Desktop users, ChatGPT Teams users, MoneyWorks integration consumers

## 🎯 Context and Problem Statement

### The Challenge
We have a fully functional MoneyWorks MCP server that works excellently with Claude Desktop and Claude Code CLI using stdio transport. However, ChatGPT Teams requires HTTP/SSE transport with significant architectural differences:

**Current State:**
- ✅ 44 MCP tools working perfectly with Claude
- ✅ Complete stdio-based implementation 
- ✅ Production-ready authentication and error tracking
- ❌ No ChatGPT Teams compatibility (requires HTTP/SSE)
- ❌ Risk of code duplication if building separate servers

**Requirements:**
1. **Maintain Claude compatibility** - Cannot break existing excellent integration
2. **Add ChatGPT support** - Enable Teams account access to MoneyWorks data
3. **Minimize maintenance** - Avoid duplicate business logic
4. **Future-proof** - Follow MCP specification evolution
5. **Performance** - No significant overhead for either protocol

### Strategic Question
**"What is the best strategy to keep Claude stdio format and add ChatGPT HTTP/SSE support without sacrificing code quality or maintainability?"**

## 🔍 Research Process and Analysis

### Investigated Options

#### 1. **Official MCP TypeScript SDK** ✅ **SELECTED**
**Research Finding**: The official SDK is designed exactly for this dual-transport scenario.

```typescript
// Native dual transport support
import { McpServer, StdioServerTransport, StreamableHTTPTransport } from "@modelcontextprotocol/typescript-sdk";

// Single server, multiple transports
const server = new McpServer({ name: "moneyworks", version: "1.0.0" });
const transport = process.env.MCP_TRANSPORT === 'http' 
  ? new StreamableHTTPTransport({ port: 3000 })
  : new StdioServerTransport();
```

**Advantages:**
- ✅ **Native dual transport** - Designed for exactly this use case
- ✅ **Official support** - Follows MCP specification evolution
- ✅ **Single codebase** - No business logic duplication
- ✅ **Type safety** - Full TypeScript definitions
- ✅ **Performance** - Optimized protocol implementation
- ✅ **Future-proof** - Specification compliance guaranteed

**Trade-offs:**
- ⚠️ **Migration effort** - 2-3 weeks to refactor current implementation
- ⚠️ **Learning curve** - Adapt to SDK patterns and conventions

#### 2. **Custom HTTP Server Implementation** ❌ **REJECTED**
**Analysis**: Building HTTP/SSE from scratch using Express/Fastify.

**Why Rejected:**
- ❌ **Maintenance burden** - HTTP/SSE protocol implementation complexity
- ❌ **Protocol compliance risk** - Manual JSON-RPC over HTTP/SSE implementation
- ❌ **Development time** - 4-6 weeks vs 2-3 weeks with SDK
- ❌ **Future compatibility** - Risk of breaking with MCP spec updates
- ❌ **Code duplication** - Separate server implementations

#### 3. **Proxy Bridge Service (mcp-proxy)** ❌ **REJECTED**
**Research Finding**: Third-party proxy that bridges stdio to HTTP/SSE.

```typescript
// mcp-proxy example
await startStdioServer({
  serverType: ServerType.SSE,
  url: "http://127.0.0.1:8080/sse",
});
```

**Why Rejected:**
- ❌ **Additional dependency** - External proxy service requirement
- ❌ **Performance overhead** - stdio → proxy → HTTP conversion layer
- ❌ **Deployment complexity** - Multiple service management
- ❌ **Limited control** - Proxy behavior and customization constraints

#### 4. **Separate Server Implementations** ❌ **REJECTED**
**Analysis**: Maintain current stdio server, build separate HTTP server.

**Why Rejected:**
- ❌ **Code duplication** - 44 tools implemented twice
- ❌ **Maintenance nightmare** - Synchronizing business logic changes
- ❌ **Testing overhead** - Double the test surface area
- ❌ **Feature drift risk** - Implementations diverging over time

## 🏗️ Chosen Architecture: Shared Core + Transport Adapters

### Architecture Pattern

```
MoneyWorks Business Logic (unchanged)
    ↓
MCP Tools Implementation (shared, refactored to SDK patterns)
    ↓
MCP Server Core (@modelcontextprotocol/typescript-sdk)
    ↓
Transport Layer (SDK built-in):
├── StdioServerTransport (Claude Desktop/CLI)
└── StreamableHTTPTransport (ChatGPT Teams)
```

### Key Design Principles

1. **Single Source of Truth**: All business logic in one place
2. **Transport Abstraction**: Protocol differences handled by SDK
3. **Environment-Based Selection**: Runtime transport configuration
4. **Protocol-Aware Responses**: Format optimization per client type
5. **Gradual Migration**: Incremental adoption without disruption

### Implementation Strategy

```typescript
// Unified server with transport selection
async function startServer() {
  const server = createMoneyWorksServer(); // Shared business logic
  
  const transport = process.env.MCP_TRANSPORT === 'http'
    ? new StreamableHTTPTransport({ port: 3000 }) // ChatGPT
    : new StdioServerTransport();                  // Claude
    
  await server.connect(transport);
}
```

## 📊 Decision Matrix Analysis

| Criteria | Official SDK | Custom HTTP | Proxy Bridge | Dual Servers |
|----------|--------------|-------------|--------------|--------------|
| **Development Time** | 2-3 weeks ✅ | 4-6 weeks ❌ | 1-2 weeks ⚠️ | 6-8 weeks ❌ |
| **Maintenance Burden** | Low ✅ | High ❌ | Medium ⚠️ | Very High ❌ |
| **Future Compatibility** | High ✅ | Medium ⚠️ | Medium ⚠️ | Low ❌ |
| **Code Quality** | High ✅ | Medium ⚠️ | Medium ⚠️ | Low ❌ |
| **Performance** | Optimal ✅ | Good ⚠️ | Proxy Overhead ❌ | Good ⚠️ |
| **Type Safety** | Full ✅ | Manual ⚠️ | Limited ❌ | Manual ⚠️ |
| **Protocol Compliance** | Guaranteed ✅ | Manual ⚠️ | Proxy-dependent ⚠️ | Manual ⚠️ |

**Score**: Official SDK wins decisively across all critical criteria.

## 🚀 Implementation Roadmap

### **Phase 1: SDK Migration Foundation (Week 1)**
**Goal**: Migrate current server to official SDK while maintaining stdio functionality.

**Tasks**:
- [ ] Install official MCP TypeScript SDK
- [ ] Refactor server initialization to use `McpServer` class
- [ ] Migrate tool handlers to SDK `ToolsRequestSchema` pattern
- [ ] Ensure all 44 tools work with stdio transport
- [ ] Update build and development scripts

**Validation**: All existing Claude integrations continue working flawlessly.

### **Phase 2: HTTP Transport Implementation (Week 2)**
**Goal**: Add HTTP/SSE transport support for ChatGPT compatibility.

**Tasks**:
- [ ] Implement `StreamableHTTPTransport` configuration
- [ ] Add environment-based transport selection logic
- [ ] Configure CORS for ChatGPT domains
- [ ] Add ChatGPT-specific tool filtering (search/retrieve only)
- [ ] Implement API key authentication for HTTP endpoints

**Validation**: HTTP server responds correctly to MCP protocol requests.

### **Phase 3: ChatGPT Optimization (Week 3)**
**Goal**: Optimize for ChatGPT Teams integration and deployment.

**Tasks**:
- [ ] Deploy HTTP server to secure HTTPS endpoint
- [ ] Configure ChatGPT Teams workspace connector
- [ ] Test search/retrieve tools with actual ChatGPT Teams account
- [ ] Implement response format optimization for each client type
- [ ] Add monitoring and logging for HTTP endpoints

**Validation**: ChatGPT Teams users can successfully access MoneyWorks data.

### **Phase 4: Enhancement & Documentation (Week 4)**
**Goal**: Polish implementation and comprehensive documentation.

**Tasks**:
- [ ] Performance optimization and caching for HTTP transport
- [ ] Comprehensive testing suite for both transports
- [ ] Update all setup documentation for dual transport
- [ ] Create troubleshooting guides for each platform
- [ ] Plan next iteration improvements

**Validation**: Production-ready dual transport MCP server.

## 🔧 Technical Implementation Details

### **Current Architecture (stdio only)**
```typescript
// packages/mcp-server/src/index.ts - Current implementation
import { Server } from "@modelcontextprotocol/server/stdio";

const server = new Server({
  name: "moneyworks", 
  version: "1.0.0"
});

// Custom tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});
```

### **Target Architecture (dual transport)**
```typescript
// packages/mcp-server/src/server.ts - New shared server
import { McpServer } from "@modelcontextprotocol/typescript-sdk";
import { ToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

export const createMoneyWorksServer = () => {
  const server = new McpServer({
    name: "moneyworks",
    version: "1.0.0"
  });

  // Unified tool handler for all transports
  server.setRequestHandler(ToolsRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return await toolRegistry.handle(name, args);
  });

  return server;
};

// packages/mcp-server/src/index.ts - Transport selection
import { StdioServerTransport, StreamableHTTPTransport } from "@modelcontextprotocol/typescript-sdk";

const server = createMoneyWorksServer();

if (process.env.MCP_TRANSPORT === 'http') {
  // ChatGPT Teams mode
  const transport = new StreamableHTTPTransport({
    port: parseInt(process.env.PORT || "3000"),
    cors: { origin: ["https://chatgpt.com", "https://chat.openai.com"] }
  });
  await server.connect(transport);
} else {
  // Claude mode (default)
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
```

### **Tool Registry Pattern**
```typescript
// Unified tool handling with protocol awareness
class ToolRegistry {
  async handle(name: string, args: any): Promise<ToolResponse> {
    const tool = this.tools[name];
    if (!tool) throw new Error(`Tool ${name} not found`);
    
    // Execute business logic (same for all transports)
    const result = await tool.execute(args);
    
    // Format response based on current transport
    return this.formatResponse(result, this.currentTransport);
  }
  
  formatResponse(data: any, transport: 'stdio' | 'http'): ToolResponse {
    if (transport === 'http') {
      return { 
        content: [{ type: "text", text: this.formatForChatGPT(data) }]
      };
    } else {
      return this.formatForClaude(data);
    }
  }
}
```

## 🎯 Success Metrics

### **Technical Success Criteria**
- [ ] **Zero Regression**: All existing Claude integrations work identically
- [ ] **HTTP Compliance**: MCP over HTTP/SSE protocol correctly implemented
- [ ] **Performance**: Response times under 2 seconds for both transports
- [ ] **Reliability**: 99.9% uptime for production HTTP endpoints
- [ ] **Code Quality**: Single codebase with <10% duplication

### **Business Success Criteria**
- [ ] **Claude Users**: No disruption to existing workflows
- [ ] **ChatGPT Users**: Successful access to MoneyWorks data via Teams
- [ ] **Development Team**: Reduced maintenance burden vs separate servers
- [ ] **Scalability**: Easy addition of future transport protocols
- [ ] **Documentation**: Clear setup guides for both platforms

## 🔒 Risk Analysis and Mitigation

### **Technical Risks**

**Risk 1: SDK Migration Breaking Changes**
- *Probability*: Medium  
- *Impact*: High
- *Mitigation*: Comprehensive testing, gradual migration, fallback plan

**Risk 2: Performance Degradation**
- *Probability*: Low
- *Impact*: Medium  
- *Mitigation*: Benchmarking, optimization, caching strategies

**Risk 3: Protocol Compatibility Issues**
- *Probability*: Low
- *Impact*: High
- *Mitigation*: Use official SDK, follow specification exactly

### **Business Risks**

**Risk 1: ChatGPT Beta Access Denial**
- *Probability*: Medium
- *Impact*: Medium
- *Mitigation*: Focus on Claude optimization, prepare mcp.run alternative

**Risk 2: Development Timeline Overrun**
- *Probability*: Medium
- *Impact*: Low
- *Mitigation*: Phased approach, MVP first, iterative improvements

**Risk 3: User Adoption Challenges**
- *Probability*: Low
- *Impact*: Medium
- *Mitigation*: Comprehensive documentation, user training, support

## 🔄 Decision Validation Process

### **Continuous Validation**
1. **Weekly Reviews**: Progress against timeline and quality metrics
2. **User Feedback**: Collect feedback from both Claude and ChatGPT users
3. **Performance Monitoring**: Track response times and reliability
4. **Code Quality**: Regular code reviews and technical debt assessment

### **Go/No-Go Checkpoints**
- **Week 1 Checkpoint**: stdio transport working with SDK
- **Week 2 Checkpoint**: HTTP transport functional
- **Week 3 Checkpoint**: ChatGPT integration successful
- **Week 4 Checkpoint**: Production readiness achieved

### **Success Validation**
- All existing Claude integrations work without modification
- ChatGPT Teams users can access core MoneyWorks functionality
- Single codebase maintains both protocols efficiently
- Documentation enables easy setup for both platforms

## 📚 References and Resources

### **Official Documentation**
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Transport Documentation](https://modelcontextprotocol.io/docs/concepts/transports)
- [ChatGPT Integration Requirements](./CHATGPT-INTEGRATION-REQUIREMENTS.md)

### **Implementation Examples**
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [TypeScript SDK Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples)
- [Dual Transport Patterns](https://blog.ni18.in/how-to-implement-a-model-context-protocol-mcp-server-with-sse/)

### **Alternative Approaches Considered**
- [mcp-proxy Bridge](https://github.com/punkpeye/mcp-proxy) - Rejected due to complexity
- Custom HTTP Implementation - Rejected due to maintenance burden
- Separate Server Strategy - Rejected due to code duplication

## 🎯 Conclusion

The **Official MCP TypeScript SDK with Shared Core + Transport Adapters** architecture provides the optimal balance of:

1. **Immediate Value**: Maintains excellent Claude integration
2. **Strategic Value**: Adds ChatGPT support with minimal overhead  
3. **Long-term Value**: Future-proof, maintainable, standards-compliant

This decision enables us to serve both major AI platforms efficiently while maintaining code quality and minimizing technical debt.

**Next Steps**: Proceed with Phase 1 implementation - SDK migration while preserving all current functionality.

---

*This decision record captures the thorough analysis process that led to our architectural choice, providing context for future development and potential re-evaluation of this decision as the MCP ecosystem evolves.*