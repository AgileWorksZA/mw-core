/**
 * MoneyWorks Documentation Resource for MCP
 *
 * @moneyworks-dsl PURE
 */
export const moneyworksDocsResource = {
	definition: {
		uri: "moneyworks://docs/overview",
		name: "MoneyWorks DSL Documentation",
		description: "Core concepts and canonical DSL for MoneyWorks development",
		mimeType: "text/markdown",
	},
	handler() {
		const content = `# MoneyWorks Canonical DSL Documentation

## Overview

MoneyWorks is a comprehensive accounting and ERP system with its own Domain-Specific Language (DSL). This documentation covers the canonical representation of MoneyWorks entities and best practices for working with the MoneyWorks REST API.

## Design Principles

### 1. Developer Experience (DX)
- Clear, intuitive APIs that follow MoneyWorks terminology
- Comprehensive TypeScript types for all entities
- Helpful error messages that guide developers

### 2. LLM Context Quality
- Structured data formats that preserve semantic meaning
- Multiple export formats to balance efficiency and clarity
- Schema-enriched exports for maximum context

### 3. Canonical MoneyWorks DSL
- Preserve MoneyWorks terminology (e.g., "TaxRate" not "tax_rate")
- Use MoneyWorks field names and data types
- Maintain consistency with MoneyWorks UI and documentation

### 4. Performance
- Compact formats for network efficiency
- Smart caching of field structures
- Lazy loading of entity definitions

## Export Formats

MoneyWorks data can be exported in multiple formats:

### compact
- Raw arrays without field names
- Minimal network overhead
- Best for high-volume data transfer

### compact-headers
- Arrays with field names in first row
- Balance between size and self-documentation
- Good for CSV/TSV exports

### full (default)
- Complete objects with field names
- Best developer experience
- Ideal for application development

### schema
- Objects with complete field metadata
- Includes data types and canonical types
- Best for LLM context and data validation

## Currently Available Entities

### TaxRate
The tax rate entity represents tax codes and their associated rates in MoneyWorks.

Fields:
- TaxCode: The unique identifier for the tax rate
- Description: Human-readable description
- Rate: The tax rate as a percentage
- TaxCollected: Account code for collected tax
- TaxPaid: Account code for paid tax
- Active: Whether the tax rate is currently active

## MWScript in REST Context

The MoneyWorks REST API supports evaluating MWScript expressions through the /evaluate endpoint. However, some operations that work in the MoneyWorks application may not work in the REST context.

Examples of working expressions:
- Mathematical: "1 + 1", "10 * 0.15"
- Date functions: "Date()", "Month(Date())"
- String operations: "Upper('hello')"

Note: Direct table queries like "Count(TaxRate)" may not work in REST context.

## Best Practices

1. **Always specify export format explicitly** - Don't rely on defaults
2. **Use field discovery** - Let the system discover field structures dynamically
3. **Handle errors gracefully** - MoneyWorks errors contain useful context
4. **Respect MoneyWorks terminology** - Use exact field and table names
5. **Cache when appropriate** - Field structures don't change frequently

## Future Entities

The following entities are being vetted for canonical representation:
- Account: Chart of accounts
- Transaction: Financial transactions
- Name: Customers, suppliers, and other entities
- Product: Inventory and service items
- Job: Project tracking
- Category1/2: Custom categorization

Each entity will be added to the MCP server as it completes the vetting process.`;
		return {
			contents: [
				{
					uri: "moneyworks://docs/overview",
					mimeType: "text/markdown",
					text: content,
				},
			],
		};
	},
};
