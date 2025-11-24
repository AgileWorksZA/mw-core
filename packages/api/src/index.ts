#!/usr/bin/env /Users/hgeldenhuys/.bun/bin/bun

/**
 * MoneyWorks API Server Entry Point
 *
 * @moneyworks-dsl PURE
 */

import { createApp } from "./app";

async function startServer() {
	const port = Number.parseInt(process.env.PORT || "3000");
	const host = process.env.HOST || "0.0.0.0";

	console.log("🚀 Starting MoneyWorks API Server with Token Authentication...");

	try {
		// Create and start API
		const app = createApp({
			port,
			host,
			enableSwagger: process.env.DISABLE_SWAGGER !== "true",
			enableCors: process.env.DISABLE_CORS !== "true",
		});

		app.listen({
			port,
			hostname: host,
		});

		console.log(`
✨ MoneyWorks API Server is running!

🌍 Server: http://${host === "0.0.0.0" ? "localhost" : host}:${port}
📚 API Base: http://${host === "0.0.0.0" ? "localhost" : host}:${port}/api/v1
📖 Swagger: http://${host === "0.0.0.0" ? "localhost" : host}:${port}/api/v1/swagger

Available endpoints:
- POST /api/v1/auth/token          - Exchange MW credentials for token
- POST /api/v1/auth/refresh        - Refresh access token
- DELETE /api/v1/auth/token/:id    - Revoke token

Protected endpoints (require Authorization: Bearer <token>):
- GET  /api/v1/tables              - List available tables
- GET  /api/v1/tables/:table       - Export table data
- GET  /api/v1/tables/:table/schema - Get table schema
- GET  /api/v1/tables/:table/labels - Get field labels
- GET  /api/v1/company             - Get company information
- GET  /api/v1/company/fields      - List company fields
- POST /api/v1/eval                - Evaluate MWScript
- POST /api/v1/eval/template/:table - Evaluate template
- GET  /api/v1/i18n/languages      - List supported languages
- GET  /api/v1/i18n/translations/:lang - Get UI translations
- GET  /api/v1/i18n/labels/:lang   - Get all field labels
- GET  /api/v1/health              - Health check
- GET  /api/v1/version             - Version info
    `);
	} catch (error) {
		console.error("❌ Failed to start server:", error);
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on("SIGINT", () => {
	console.log("\n👋 Shutting down MoneyWorks API Server...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.log("\n👋 Shutting down MoneyWorks API Server...");
	process.exit(0);
});

// Start the server
startServer().catch(console.error);
