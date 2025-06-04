# MoneyWorks scripting extends your MCP wrapper capabilities

MoneyWorks fully supports server-side script execution through its REST API, offering powerful automation and integration capabilities far beyond the standard /export and /report endpoints. The software uses **MWScript**, a proprietary embedded scripting language specifically designed for accounting and business operations, accessible via the `/evaluate` endpoint that can seamlessly integrate with your existing MCP wrapper.

## 1. Server script execution is fully supported

MoneyWorks provides robust server-side script execution through multiple interfaces. Scripts can be sent to the MoneyWorks server via the **REST API `/evaluate` endpoint** or through command-line tools. The server processes scripts using pooled worker instances that maintain connections for optimal performance, with scripts executing directly on the server to minimize network latency and enable complex multi-step operations. This server-side architecture is particularly powerful for MoneyWorks Datacentre deployments where multiple clients need access to automated processes.

## 2. MWScript powers MoneyWorks automation

MoneyWorks uses **MWScript**, its own proprietary scripting language introduced in MoneyWorks 7. This isn't JavaScript, SQL, or any third-party language, but rather a purpose-built embedded language designed specifically for accounting operations. The language features:

- **Handler-based architecture** using `on`/`end` blocks for event-driven programming
- **Weakly typed** with automatic type promotion for ease of use
- **Native integration** with all MoneyWorks data structures and operations
- **Cross-platform compatibility** ensuring scripts work identically on Mac and Windows
- **C++ style comments** and one-statement-per-line syntax for clarity

## 3. Extensive operational capabilities through scripting

MWScript enables a comprehensive range of operations that significantly extend MoneyWorks functionality:

**Data Querying**: Direct database access with `CreateSelection()` for filtered queries, complex search expressions, relational finds across linked data, and real-time data extraction in multiple formats including XML, CSV, and JSON.

**Report Generation**: Programmatic report creation using `DoReport()` with output to PDF, HTML, Excel, or screen. Scripts can generate parameterized reports with dynamic content, automate distribution via email, and create custom report templates beyond standard capabilities.

**Data Manipulation**: Full CRUD operations on all data tables including creating transactions, updating customer records, posting journal entries, bulk imports from external sources, and implementing complex business rules for data validation.

**Automation Tasks**: Install custom menu items, handle UI events, automate multi-step workflows, integrate with external systems via HTTP/SMTP, schedule tasks through command-line execution, and enforce business-specific validation rules.

**Custom Business Logic**: Implement complex calculations, date/time processing, string manipulation with RegEx support, conditional logic with loops and decision trees, and create reusable functions for standardized operations.

## 4. Technical implementation via REST API

Scripts are executed through the REST API using this endpoint structure:

```
https://server:6710/REST/DocumentName.moneyworks/evaluate/expr=ScriptName:HandlerName(parameters)
```

**Authentication** uses HTTP Basic Authentication with two possible formats:
- Single-level: `base64(username:Document:password)`
- Two-level (with folder): `base64(folder:Datacentre:folderpass), base64(username:Document:docpass)`

**Command-line execution** provides an alternative method:
```bash
moneyworks -e "evaluate expr='ScriptName:HandlerName()'" moneyworks://user:pass@server/document.moneyworks
```

The server maintains a pool of logged-in instances that persist for approximately 30 seconds after requests, optimizing performance for burst operations while managing concurrent login slots efficiently.

## 5. Comprehensive documentation and examples

MoneyWorks provides extensive documentation through multiple channels:

- **Official Manual**: Complete MWScript reference at cognito.co.nz
- **Developer Resources**: Dedicated section at cognito.co.nz/developer
- **Sample Scripts**: Including POS Rounding, Utilities, Apply Landing Costs, Pick List implementations
- **Code Examples**: Practical implementations for Base64 encoding, SMTP handling, webhook support

Example script structure:
```mwscript
on GetCustomerBalance(customerCode)
    let selection = CreateSelection("Name", "NameCode='" & customerCode & "'")
    if CountSelection(selection) > 0 then
        GoToSelection(selection)
        return NameBalance
    else
        return 0
    endif
end
```

## 6. Primary API endpoint for script execution

The main endpoint for script execution is:
```
/REST/DocumentName.moneyworks/evaluate/expr=expression
```

This GET endpoint accepts URL-encoded MWScript expressions and returns results in plain text format. For complex operations, scripts can return structured data in JSON or XML formats using built-in formatting functions. The endpoint integrates seamlessly with existing REST infrastructure, using the same authentication and connection management as other MoneyWorks REST endpoints.

## 7. Scripts vastly exceed standard endpoint capabilities

The comparison between scripting and standard endpoints reveals significant advantages:

| Capability | /export | /report | Scripts |
|------------|---------|---------|---------|
| **Complex Logic** | No | Limited | Full programming capability |
| **External API Integration** | No | No | HTTP/HTTPS with CURL |
| **Data Modification** | No | No | Full CRUD operations |
| **Multi-step Processing** | No | No | Complex workflows |
| **Error Handling** | Basic | Basic | Try/catch, custom validation |
| **Performance** | Multiple requests | Single output | Batch operations |

Scripts enable **single-request workflows** that would require multiple round-trips with standard endpoints, **conditional processing** based on real-time data evaluation, **integration with external systems** through HTTP requests and file operations, and **transaction-safe operations** with rollback capabilities.

## 8. Security considerations and limitations

**Permission Requirements**: Scripts execute with the authenticated user's permissions, requiring specific "scripting privileges" for advanced operations. The `SetDocumentGlobal` capability must be enabled for script execution, and scripts must be deployed in authorized locations within the document or plugin folders.

**Execution Restrictions**: Server-side scripts operate in a sandboxed environment with no GUI operations allowed, limited file system access to specific directories only, controlled network access through the CURL API, and external tool restrictions requiring symbolic links in the Externals folder.

**Best Practices for Security**:
- Use dedicated REST user accounts with minimal required permissions
- Implement TLS/HTTPS for all production deployments
- Validate all input parameters within scripts
- Implement comprehensive error handling and logging
- Regular credential rotation for API access

**Performance Limitations**: Each script execution consumes a concurrent login slot, connections timeout after 5 minutes of inactivity, and server resources limit parallel execution capacity. Avoid periodic polling with frequencies under 10 minutes to prevent server overload.

## Extending your MCP wrapper

To integrate scripting into your existing MCP wrapper, add support for the `/evaluate` endpoint with proper parameter encoding:

```python
def execute_script(self, script_name, handler_name, parameters=None):
    expr = f"{script_name}:{handler_name}("
    if parameters:
        param_list = [self._format_parameter(p) for p in parameters]
        expr += ",".join(param_list)
    expr += ")"
    return self._request(f"/evaluate/expr={urllib.parse.quote(expr)}")
```

This enhancement would enable your MCP wrapper to leverage MoneyWorks' full programmability, supporting complex automation scenarios, real-time data processing with business logic, multi-step integration workflows, and custom reporting beyond standard templates. The scripting capability complements rather than replaces your existing /export and /report functionality, providing a comprehensive toolkit for MoneyWorks integration.