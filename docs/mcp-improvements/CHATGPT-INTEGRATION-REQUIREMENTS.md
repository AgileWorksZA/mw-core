# ChatGPT MCP Integration Requirements

## Overview

This document outlines the requirements and implementation strategy for integrating the MoneyWorks MCP server with ChatGPT, specifically for Teams accounts. ChatGPT's MCP support is currently in beta with specific limitations and requirements that differ significantly from Claude's implementation.

## 🚨 Current Status & Limitations

### **ChatGPT MCP Support Status (as of 2025)**
- **ChatGPT Desktop App**: MCP support confirmed but **not yet publicly released**
- **ChatGPT Teams**: **Beta access** for custom MCP connectors via workspace admins
- **Available Tiers**: Pro, Teams, and Enterprise accounts (NOT Plus accounts)
- **Current Implementation**: Limited to search/retrieve operations only

### **Critical Limitations in Beta**
1. **Tool Restrictions**: Only "search" and "retrieve" tools supported
2. **Server Type**: Must be remote HTTP servers (not stdio/local servers like Claude)
3. **Read-Only**: No write operations or data modification tools
4. **Content Guidelines**: Must pass OpenAI's strict content validation
5. **Protocol**: Requires specific JSON-RPC over HTTP/SSE

## MoneyWorks MCP Compatibility Analysis

### ✅ **Compatible Tools (Search/Retrieve Pattern)**
- **`accounts`**: Search accounts by code, description, type → Maps to "search"
- **`transactions`**: Retrieve transaction data with filtering → Maps to "retrieve" 
- **`names`**: Search customers/suppliers by various criteria → Maps to "search"
- **`builds`**: Search manufacturing/build records → Maps to "search"

### ❌ **Incompatible Tools (Current Beta Restrictions)**
- **`logTicket`**: Creates database entries (write operation)
- **System Tools**: 40+ metadata/configuration tools (not search/retrieve)
- **Evaluation Tools**: MoneyWorks expression evaluation (not search/retrieve)
- **Reporting Tools**: Report generation and parameter tools
- **Company Info Tools**: Configuration and settings tools

### **Architecture Incompatibilities**
- **stdio Protocol**: Current implementation uses stdio (Claude compatible)
- **Local Server**: Runs locally via Bun/TypeScript execution
- **Direct API Access**: Makes direct MoneyWorks API calls
- **Write Operations**: Includes database modification capabilities

## Implementation Requirements

### **1. Server Architecture Migration**

#### **Current (Claude Compatible)**
```typescript
// stdio-based MCP server
// Communicates via stdin/stdout JSON-RPC
// Runs locally as subprocess
const server = new Server({
  name: "moneyworks",
  version: "1.0.0"
}, {
  capabilities: { tools: {} }
});
```

#### **Required (ChatGPT Compatible)**
```typescript
// HTTP/SSE-based MCP server
// RESTful API with Server-Sent Events
// Deployed as public HTTPS service
app.post('/mcp/invoke', async (req, res) => {
  const { method, params } = req.body;
  if (method === 'tools/call') {
    // Handle tool invocation
    const result = await handleToolCall(params.name, params.arguments);
    res.json({ result });
  }
});
```

### **2. Tool Simplification Strategy**

#### **Phase 1: Core Search Tools Only**
```typescript
// Consolidate 44 tools into 4 search-focused tools
const chatgptTools = [
  {
    name: "searchAccounts",
    description: "Search MoneyWorks accounts by code, description, or type",
    inputSchema: { 
      type: "object",
      properties: {
        query: { type: "string" },
        type: { type: "string", enum: ["Asset", "Liability", "Income", "Expense"] },
        limit: { type: "number", default: 10 }
      }
    }
  },
  {
    name: "searchTransactions", 
    description: "Search and retrieve transaction data with filtering",
    inputSchema: { /* ... */ }
  },
  {
    name: "searchContacts",
    description: "Search customers and suppliers by name or code", 
    inputSchema: { /* ... */ }
  },
  {
    name: "searchBuilds",
    description: "Search manufacturing and build records",
    inputSchema: { /* ... */ }
  }
];
```

#### **Phase 2: Enhanced Search Capabilities**
```typescript
// Add intelligent search aggregation
const enhancedTools = [
  {
    name: "businessQuery",
    description: "Natural language business intelligence queries",
    inputSchema: {
      type: "object",
      properties: {
        query: { 
          type: "string",
          description: "Natural language business question (e.g., 'top customers by revenue')"
        },
        dateRange: { type: "string", description: "Date range filter" },
        limit: { type: "number", default: 10 }
      }
    }
  }
];
```

### **3. Deployment Requirements**

#### **Infrastructure**
- **HTTPS Endpoint**: Public SSL certificate required
- **Authentication**: API key-based security system
- **Rate Limiting**: Request throttling for enterprise use
- **Health Monitoring**: Uptime and performance tracking
- **Logging**: Comprehensive audit trail

#### **Hosting Options**
1. **Vercel/Netlify**: Serverless deployment for HTTP endpoints
2. **Railway/Render**: Container-based hosting for Node.js/Bun
3. **Cloud Run/Lambda**: Auto-scaling serverless options
4. **VPS/Dedicated**: Self-hosted for maximum control

#### **Security Requirements**
```typescript
// API Key authentication
app.use('/mcp', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

// Rate limiting
app.use('/mcp', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## ChatGPT Teams Account Requirements

### **Workspace Admin Setup**
1. **Account Type**: ChatGPT Teams subscription (✅ User has this)
2. **Admin Role**: Must have workspace administrator privileges
3. **Beta Access**: Request access to MCP connector beta program
4. **Configuration Path**: Settings → Connectors → "Create" button

### **Connector Configuration**
```json
{
  "name": "MoneyWorks Integration",
  "description": "Access MoneyWorks accounting data and business intelligence",
  "endpoint": "https://your-mcp-server.com/mcp",
  "authentication": {
    "type": "api_key",
    "key": "your-secure-api-key"
  },
  "capabilities": ["search", "retrieve"],
  "guidelines_compliance": true
}
```

### **Beta Access Process**
1. **Contact OpenAI**: Request Teams MCP beta access
2. **Use Case Documentation**: Provide business justification
3. **Compliance Review**: Ensure content guidelines adherence
4. **Testing Phase**: Limited rollout to workspace members

## Implementation Roadmap

### **Phase 1: Research & Preparation (2-4 weeks)**
- [ ] **Beta Access Request**: Apply for ChatGPT Teams MCP beta
- [ ] **Architecture Design**: Plan HTTP/SSE server implementation
- [ ] **Tool Mapping**: Identify which current tools can be adapted
- [ ] **Security Design**: Plan authentication and rate limiting

### **Phase 2: HTTP Server Development (4-6 weeks)**
- [ ] **Server Framework**: Implement Express/Fastify HTTP server
- [ ] **MCP Protocol**: Implement JSON-RPC over HTTP/SSE
- [ ] **Core Tools**: Adapt accounts, transactions, names, builds for search
- [ ] **Authentication**: Implement API key security system
- [ ] **Testing**: Local testing with HTTP client

### **Phase 3: Deployment & Integration (2-3 weeks)**
- [ ] **Cloud Deployment**: Deploy to secure HTTPS endpoint
- [ ] **ChatGPT Configuration**: Set up connector in Teams workspace
- [ ] **Beta Testing**: Test with workspace team members
- [ ] **Monitoring Setup**: Implement logging and health checks

### **Phase 4: Enhancement & Scaling (4-6 weeks)**
- [ ] **Business Query Tool**: Implement natural language processing
- [ ] **Advanced Search**: Enhanced filtering and aggregation
- [ ] **Performance Optimization**: Caching and query optimization
- [ ] **Documentation**: User guides and API documentation

## Alternative Integration Strategies

### **Option 1: mcp.run Bridge Service**
- **Description**: Third-party service that bridges stdio MCP servers to ChatGPT
- **Pros**: Works with existing server, faster implementation
- **Cons**: External dependency, potential security concerns
- **Timeline**: 1-2 weeks implementation

### **Option 2: Dual Implementation**
- **Description**: Maintain both stdio (Claude) and HTTP (ChatGPT) servers
- **Pros**: Support both platforms, gradual migration
- **Cons**: Code duplication, maintenance overhead
- **Timeline**: 6-8 weeks total development

### **Option 3: Claude Desktop Focus**
- **Description**: Wait for ChatGPT Desktop MCP release, focus on Claude
- **Pros**: Proven working implementation, less complexity
- **Cons**: Limited to Claude ecosystem, delays ChatGPT benefits
- **Timeline**: Indefinite wait

## Technical Specifications

### **HTTP Server API Design**
```typescript
// MCP over HTTP endpoint structure
POST /mcp/invoke
Content-Type: application/json
X-API-Key: {secure-api-key}

{
  "jsonrpc": "2.0",
  "id": "request-id",
  "method": "tools/call",
  "params": {
    "name": "searchAccounts",
    "arguments": {
      "query": "cash",
      "type": "Asset",
      "limit": 5
    }
  }
}

// Response format
{
  "jsonrpc": "2.0", 
  "id": "request-id",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Found 3 cash accounts:\n1. Petty Cash (1000)\n2. Operating Cash (1001)\n3. Savings Account (1002)"
      }
    ]
  }
}
```

### **Environment Configuration**
```bash
# Production environment variables
NODE_ENV=production
PORT=3000
MCP_API_KEY=secure-random-api-key
MW_CONFIG_PATH=/app/config/mw-config.json
ALLOWED_ORIGINS=https://chatgpt.com,https://chat.openai.com
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # requests per window
```

## Success Metrics

### **Implementation Success**
- [ ] HTTP server responds to MCP protocol requests
- [ ] Search tools return relevant MoneyWorks data
- [ ] ChatGPT Teams workspace can access connector
- [ ] Response times under 2 seconds for typical queries
- [ ] 99.9% uptime for production deployment

### **User Adoption Success**
- [ ] Workspace team members actively use MoneyWorks integration
- [ ] Positive feedback on search accuracy and usefulness
- [ ] Reduction in manual MoneyWorks queries
- [ ] Integration into business workflows
- [ ] Scalability to additional workspace users

## Risks & Mitigation

### **Technical Risks**
1. **OpenAI API Changes**: Beta API may change frequently
   - *Mitigation*: Implement flexible adapter pattern
2. **Performance Issues**: MoneyWorks API latency may cause timeouts
   - *Mitigation*: Implement caching and query optimization
3. **Security Vulnerabilities**: Public endpoint increases attack surface
   - *Mitigation*: Comprehensive security testing and monitoring

### **Business Risks**
1. **Beta Access Denial**: OpenAI may not approve Teams beta access
   - *Mitigation*: Pursue mcp.run alternative strategy
2. **Feature Limitations**: Search-only tools may not meet user needs
   - *Mitigation*: Focus on high-value search use cases first
3. **Maintenance Overhead**: Supporting multiple platforms increases complexity
   - *Mitigation*: Shared core logic with platform-specific adapters

## Next Steps

### **Immediate Actions (This Week)**
1. **Submit Beta Request**: Apply for ChatGPT Teams MCP beta access
2. **Architecture Planning**: Design HTTP server architecture
3. **Tool Analysis**: Map current 44 tools to search/retrieve patterns
4. **Resource Planning**: Estimate development time and resources

### **Short Term (Next Month)**
1. **Prototype Development**: Build basic HTTP server with core tools
2. **Security Implementation**: Add authentication and rate limiting
3. **Testing Framework**: Set up automated testing for HTTP endpoints
4. **Documentation**: Create API documentation and setup guides

### **Long Term (Next Quarter)**
1. **Production Deployment**: Deploy to secure cloud infrastructure
2. **ChatGPT Integration**: Configure and test in Teams workspace
3. **User Training**: Provide guidance to workspace team members
4. **Performance Monitoring**: Implement comprehensive observability

## Conclusion

Integrating MoneyWorks MCP with ChatGPT Teams requires significant architectural changes from our current Claude-focused implementation. The beta limitations restrict us to search/retrieve operations only, requiring a fundamental redesign of our tool ecosystem.

However, the potential benefits of ChatGPT integration - broader user adoption, enterprise features, and mainstream accessibility - make this a worthwhile strategic investment. The phased approach allows us to maintain our existing Claude integration while gradually building ChatGPT compatibility.

**Recommendation**: Proceed with Phase 1 (beta access request and planning) while continuing to enhance the Claude implementation. This dual-track approach maximizes our options and ensures we're prepared for both integration opportunities.