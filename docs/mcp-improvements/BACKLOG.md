# MoneyWorks MCP Tools Improvement Backlog

## 🚨 NEXT SESSION PRIORITIES

### IMMEDIATE (Session 1) 
1. **🔥 CRITICAL**: Fix logTicket database constraint error (BLOCKING)
   - File: `packages/mcp-server/src/tools/log-ticket.ts`  
   - Add `type: args.type` to database insert
   - Test with valid feature request

### STRATEGIC ARCHITECTURE (Sessions 2-4)
1. **🏗️ ARCHITECTURAL**: Dual Transport MCP Implementation
   - **Phase 1**: Migrate to official MCP TypeScript SDK (Week 1)
   - **Phase 2**: Add HTTP/SSE transport for ChatGPT (Week 2) 
   - **Phase 3**: ChatGPT Teams integration optimization (Week 3)
   - **Phase 4**: Documentation and production deployment (Week 4)
   - **Reference**: `DUAL-TRANSPORT-ARCHITECTURE-DECISION.md`

### FOLLOW-UP (Sessions 5-6)
2. **📈 HIGH**: accounts response structure hierarchy
   - Implement enhanced format option with SDK patterns
   - Add human-readable labels
   - Include balance information

3. **📈 HIGH**: transaction pagination optimization
   - Optimize large dataset queries with transport awareness
   - Implement smart field selection
   - Add protocol-specific response formatting

## Progress Overview

**Total Tools**: 44 | **Categories**: 8 + 1 Platform Integration | **Completed**: 0 | **In Progress**: 0 | **Planned**: 44

**Platform Integration**: Comprehensive dual transport architecture decision completed with 4-phase implementation plan

## Current Session Context

- **Documentation Created**: Complete structure for tracking all improvements
- **Critical Issue Identified**: logTicket tool completely non-functional  
- **High-Priority Issues**: accounts structure, transaction pagination
- **Implementation Files Known**: Specific files and locations documented
- **🏗️ MAJOR ARCHITECTURE DECISION**: Dual transport MCP architecture selected
  - **Decision Document**: `DUAL-TRANSPORT-ARCHITECTURE-DECISION.md` (comprehensive analysis)
  - **Strategy**: Official MCP TypeScript SDK with shared core + transport adapters
  - **Timeline**: 4-week phased implementation (SDK migration → HTTP transport → ChatGPT integration → production)
  - **Outcome**: Single codebase supporting both Claude (stdio) and ChatGPT (HTTP/SSE)

---

## 1. Core Data Table Tools (4/4 tools)

### Primary Business Data Access

- [ ] **accounts** - Chart of accounts management
  - [ ] Improve response structure hierarchy
  - [ ] Add balance information integration
  - [ ] Enhance human-readable labels
  - [ ] Implement smart filtering and grouping

- [ ] **transactions** - Financial transaction management
  - [ ] Optimize large dataset pagination
  - [ ] Add transaction analysis capabilities
  - [ ] Improve date range filtering
  - [ ] Enhance summary reporting

- [ ] **names** - Customer/supplier contact management
  - [ ] Streamline contact search interface
  - [ ] Add contact relationship mapping
  - [ ] Improve category filtering
  - [ ] Enhance contact data validation

- [ ] **builds** - Manufacturing/build record management
  - [ ] Improve build tracking interface
  - [ ] Add component dependency mapping
  - [ ] Enhance production reporting
  - [ ] Optimize build search performance

---

## 2. System Metadata Tools (12/12 tools)

### Schema and Structure Management

- [ ] **listTables** - Available table enumeration
  - [ ] Add table usage statistics
  - [ ] Include table relationship overview
  - [ ] Enhance metadata descriptions

- [ ] **describeTableSchema** - Comprehensive schema details
  - [ ] Improve field type documentation
  - [ ] Add constraint explanations
  - [ ] Include example data patterns

- [ ] **getFieldMetadata** - Detailed field information
  - [ ] Enhance field validation rules
  - [ ] Add usage pattern analysis
  - [ ] Improve constraint documentation

- [ ] **getTableRelationships** - Foreign key relationships
  - [ ] Add visual relationship mapping
  - [ ] Include referential integrity checks
  - [ ] Enhance dependency analysis

### API Information Management

- [ ] **listEndpoints** - API endpoint catalog
  - [ ] Add endpoint usage analytics
  - [ ] Include performance metrics
  - [ ] Enhance categorization

- [ ] **describeEndpoint** - Endpoint documentation
  - [ ] Improve parameter documentation
  - [ ] Add response examples
  - [ ] Include usage patterns

### System Status and Health

- [ ] **getSystemInfo** - System information
  - [ ] Add performance monitoring
  - [ ] Include capacity planning data
  - [ ] Enhance version tracking

- [ ] **getApiCapabilities** - API feature catalog
  - [ ] Add feature usage tracking
  - [ ] Include compatibility matrix
  - [ ] Enhance capability testing

- [ ] **getSystemStatus** - Health monitoring
  - [ ] Add real-time metrics
  - [ ] Include alerting capabilities
  - [ ] Enhance diagnostic tools

### Data Validation Management

- [ ] **getValidationRules** - Field validation rules
  - [ ] Improve rule documentation
  - [ ] Add validation testing tools
  - [ ] Enhance error messaging

- [ ] **getTableValidationRules** - Table-level validation
  - [ ] Add cross-field validation
  - [ ] Include business rule validation
  - [ ] Enhance validation reporting

- [ ] **getBusinessRules** - Business logic rules
  - [ ] Improve rule categorization
  - [ ] Add rule dependency mapping
  - [ ] Enhance rule testing framework

---

## 3. Data Format and Localization Tools (16/16 tools)

### Enumeration Value Management

- [ ] **getEnumValues** - Field enumeration values
  - [ ] Add enum value validation
  - [ ] Include usage frequency data
  - [ ] Enhance deprecation handling

- [ ] **searchEnumValues** - Cross-table enum search
  - [ ] Improve search performance
  - [ ] Add fuzzy matching capabilities
  - [ ] Enhance result relevance

- [ ] **getTableEnumFields** - Table enum field catalog
  - [ ] Add enum field relationships
  - [ ] Include validation dependencies
  - [ ] Enhance field documentation

- [ ] **getEnumUsagePatterns** - Enum usage analytics
  - [ ] Add trend analysis
  - [ ] Include performance impact data
  - [ ] Enhance reporting capabilities

### Date and Time Management

- [ ] **getDateFormats** - Field date formatting
  - [ ] Add locale-specific formatting
  - [ ] Include timezone handling
  - [ ] Enhance validation rules

- [ ] **getTableDateFields** - Table date field catalog
  - [ ] Add date field relationships
  - [ ] Include temporal validation
  - [ ] Enhance format consistency

- [ ] **getSupportedDateFormats** - Format catalog
  - [ ] Add format validation tools
  - [ ] Include conversion utilities
  - [ ] Enhance format documentation

- [ ] **parseDateString** - Date parsing and validation
  - [ ] Improve error messaging
  - [ ] Add fuzzy date parsing
  - [ ] Enhance format detection

### Currency Management

- [ ] **getCurrencyInfo** - Currency information
  - [ ] Add historical currency data
  - [ ] Include regulatory information
  - [ ] Enhance symbol handling

- [ ] **getCurrencyFormatting** - Currency formatting rules
  - [ ] Add locale-specific formatting
  - [ ] Include precision handling
  - [ ] Enhance validation rules

- [ ] **getExchangeRates** - Exchange rate management
  - [ ] Add rate history tracking
  - [ ] Include rate source validation
  - [ ] Enhance update mechanisms

- [ ] **convertCurrency** - Currency conversion
  - [ ] Add conversion accuracy tracking
  - [ ] Include fee calculations
  - [ ] Enhance rounding rules

- [ ] **getMoneyWorksCurrencySettings** - MW currency config
  - [ ] Add multi-currency validation
  - [ ] Include setting migration tools
  - [ ] Enhance configuration testing

### Internationalization

- [ ] **getTableLabels** - Field label translations
  - [ ] Add translation validation
  - [ ] Include context information
  - [ ] Enhance missing translation handling

- [ ] **listAvailableTables** - Label-supported tables
  - [ ] Add translation coverage metrics
  - [ ] Include priority ranking
  - [ ] Enhance table documentation

- [ ] **listSupportedLanguages** - Language support
  - [ ] Add language quality metrics
  - [ ] Include regional variants
  - [ ] Enhance language detection

- [ ] **generateAllLabels** - Bulk label generation
  - [ ] Add incremental updates
  - [ ] Include validation checks
  - [ ] Enhance caching mechanisms

---

## 4. Security and Permissions Tools (5/5 tools)

### Permission Management

- [ ] **getPermissionInfo** - Operation permission requirements
  - [ ] Add permission inheritance mapping
  - [ ] Include role-based analysis
  - [ ] Enhance permission documentation

- [ ] **getTablePermissions** - Table access control
  - [ ] Add field-level permissions
  - [ ] Include dynamic permission evaluation
  - [ ] Enhance permission testing

- [ ] **getUserRoles** - Role management
  - [ ] Add role hierarchy visualization
  - [ ] Include permission aggregation
  - [ ] Enhance role validation

- [ ] **checkUserPermissions** - Permission validation
  - [ ] Add real-time permission checking
  - [ ] Include context-aware validation
  - [ ] Enhance audit logging

- [ ] **getSecurityAuditInfo** - Security auditing
  - [ ] Add compliance reporting
  - [ ] Include threat detection
  - [ ] Enhance audit trail analysis

---

## 5. Evaluation and Scripting Tools (3/3 tools)

### Expression Evaluation

- [ ] **evaluateExpression** - MoneyWorks expression evaluation
  - [ ] Add expression validation
  - [ ] Include performance optimization
  - [ ] Enhance error handling

- [ ] **evaluateTemplate** - Template processing
  - [ ] Add template validation
  - [ ] Include conditional logic
  - [ ] Enhance output formatting

- [ ] **listCommonExpressions** - Expression catalog
  - [ ] Add usage frequency data
  - [ ] Include examples and documentation
  - [ ] Enhance categorization

---

## 6. Reporting Tools (3/3 tools)

### Report Generation

- [ ] **generateReport** - HTML report generation
  - [ ] Add output format options
  - [ ] Include interactive elements
  - [ ] Enhance styling capabilities

- [ ] **getReportParameters** - Report configuration
  - [ ] Add parameter validation
  - [ ] Include default value management
  - [ ] Enhance parameter documentation

- [ ] **listCommonReports** - Report catalog
  - [ ] Add report usage analytics
  - [ ] Include custom report support
  - [ ] Enhance report categorization

---

## 7. Company Information Tools (2/2 tools)

### Company Configuration

- [ ] **getCompanyInformation** - Company details
  - [ ] Add configuration validation
  - [ ] Include change tracking
  - [ ] Enhance data privacy controls

- [ ] **listCompanyInformationFields** - Available fields
  - [ ] Add field usage analytics
  - [ ] Include validation rules
  - [ ] Enhance field documentation

---

## 8. Error Tracking and Support Tools (1/1 tools)

### Issue Management

- [ ] **logTicket** - Bug and feature tracking
  - [ ] **🔥 CRITICAL - BLOCKING**: Fix NOT NULL constraint error
    - **File**: `packages/mcp-server/src/tools/log-ticket.ts`
    - **Issue**: Missing `type: args.type` in database insert
    - **Fix**: Add parameter mapping in ticket object creation
    - **Test**: Create feature request after fix
  - [ ] Add ticket categorization
  - [ ] Include attachment support
  - [ ] Enhance workflow management

---

## 9. Platform Integration & Architecture

### Dual Transport MCP Architecture

- [ ] **🏗️ PHASE 1: SDK Migration Foundation** - Migrate to official TypeScript SDK (Week 1)
  - [ ] Install official MCP TypeScript SDK (`@modelcontextprotocol/typescript-sdk`)
  - [ ] Refactor server initialization to use `McpServer` class
  - [ ] Migrate all 44 tool handlers to SDK `ToolsRequestSchema` pattern  
  - [ ] Ensure stdio transport maintains 100% compatibility with Claude
  - [ ] Update build scripts and development workflow
  - [ ] **Validation**: All existing Claude integrations work flawlessly

- [ ] **🌐 PHASE 2: HTTP Transport Implementation** - Add ChatGPT compatibility (Week 2)
  - [ ] Implement `StreamableHTTPTransport` configuration
  - [ ] Add environment-based transport selection (`MCP_TRANSPORT=http|stdio`)
  - [ ] Configure CORS for ChatGPT domains (`chatgpt.com`, `chat.openai.com`)
  - [ ] Add ChatGPT-specific tool filtering (search/retrieve only for beta)
  - [ ] Implement API key authentication for HTTP endpoints
  - [ ] **Validation**: HTTP server responds correctly to MCP protocol requests

- [ ] **⚡ PHASE 3: ChatGPT Teams Integration** - Production optimization (Week 3)  
  - [ ] Deploy HTTP server to secure HTTPS endpoint with SSL certificate
  - [ ] Request and configure ChatGPT Teams workspace MCP connector
  - [ ] Test core search tools (accounts, transactions, names, builds) with ChatGPT
  - [ ] Implement protocol-aware response formatting
  - [ ] Add monitoring, logging, and health checks for HTTP endpoints
  - [ ] **Validation**: ChatGPT Teams users successfully access MoneyWorks data

- [ ] **📚 PHASE 4: Documentation & Production** - Polish and deploy (Week 4)
  - [ ] Performance optimization and caching for HTTP transport
  - [ ] Comprehensive testing suite covering both transport protocols
  - [ ] Update all setup documentation for dual transport architecture
  - [ ] Create troubleshooting guides for Claude vs ChatGPT platforms
  - [ ] Plan next iteration improvements and feature enhancements
  - [ ] **Validation**: Production-ready dual transport MCP server

### Alternative Integration Strategy (Lower Priority)

- [ ] **mcp.run Bridge Evaluation** - Third-party bridge service assessment
  - [ ] Test existing stdio server with mcp.run platform
  - [ ] Document setup process and performance characteristics  
  - [ ] Compare maintenance vs native HTTP implementation
  - [ ] Assess as fallback option if official SDK approach fails

**Reference Documentation**: 
- `DUAL-TRANSPORT-ARCHITECTURE-DECISION.md` - Complete decision analysis and rationale
- `CHATGPT-INTEGRATION-REQUIREMENTS.md` - ChatGPT-specific requirements and limitations

---

## Priority Matrix

### 🔥 Critical (Blocking functionality)
- [ ] logTicket - Fix database constraint error

### 🚨 High Priority (Major usability improvements)
- [ ] accounts - Response structure hierarchy
- [ ] transactions - Large dataset pagination
- [ ] names - Search interface streamlining

### 📈 Medium Priority (Performance and UX enhancements)
- [ ] getSystemStatus - Real-time metrics
- [ ] generateReport - Output format options
- [ ] getTableLabels - Translation validation

### 🏗️ Strategic Priority (Architecture & Platform Integration)
- [ ] **Dual Transport MCP Architecture** - 4-week phased implementation
  - [ ] Phase 1: Official SDK migration (maintains Claude compatibility)
  - [ ] Phase 2: HTTP transport for ChatGPT compatibility
  - [ ] Phase 3: ChatGPT Teams integration and optimization
  - [ ] Phase 4: Documentation and production deployment

### 🔧 Low Priority (Nice-to-have improvements)
- [ ] listCommonExpressions - Usage frequency data
- [ ] getEnumUsagePatterns - Trend analysis
- [ ] listAvailableTables - Translation coverage metrics

---

## Implementation Guidelines

1. **Start with Critical Issues**: Address blocking problems first
2. **Focus by Category**: Complete one category before moving to another
3. **Test Thoroughly**: Each improvement should include validation
4. **Document Changes**: Update both code and documentation
5. **Maintain Backward Compatibility**: Ensure existing users aren't broken

## Progress Tracking Legend

- ✅ **Completed**: Feature implemented and tested
- 🔄 **In Progress**: Currently being worked on  
- 📋 **Planned**: In backlog, ready for implementation
- 🚫 **Blocked**: Cannot proceed due to dependencies
- ❌ **Won't Fix**: Decided against implementation