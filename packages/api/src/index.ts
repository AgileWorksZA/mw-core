#!/usr/bin/env /Users/hgeldenhuys/.bun/bin/bun

/**
 * MoneyWorks API Server Entry Point
 * 
 * @moneyworks-dsl PURE
 */

import { createSmartClient, loadConfig } from '@moneyworks/data';
import { createApp } from '@moneyworks/api/app';

async function startServer() {
  const port = parseInt(process.env.PORT || '3000');
  const host = process.env.HOST || '0.0.0.0';
  
  console.log('🚀 Starting MoneyWorks API Server...');
  
  try {
    // Load MoneyWorks configuration
    const configPath = process.env.MW_CONFIG_PATH || './mw-config.json';
    const mwConfig = await loadConfig(configPath);
    
    // Create MoneyWorks client
    const client = createSmartClient(mwConfig);
    
    // Test connection
    console.log('📡 Testing MoneyWorks connection...');
    const connected = await client.testConnection();
    if (!connected) {
      throw new Error('Failed to connect to MoneyWorks');
    }
    console.log('✅ Connected to MoneyWorks');
    
    // Create and start API
    const app = createApp(client, {
      port,
      host,
      enableSwagger: process.env.DISABLE_SWAGGER !== 'true',
      enableCors: process.env.DISABLE_CORS !== 'true'
    });
    
    app.listen({
      port,
      hostname: host
    });
    
    console.log(`
✨ MoneyWorks API Server is running!

🌍 Server: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}
📚 API Base: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/api/v1
📖 Swagger: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/api/v1/swagger

Available endpoints:
- GET  /api/v1/tables           - List available tables
- GET  /api/v1/tables/:table    - Export table data
- GET  /api/v1/tables/:table/schema - Get table schema
- POST /api/v1/eval             - Evaluate MWScript
- GET  /api/v1/health           - Health check
- GET  /api/v1/version          - Version info
    `);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MoneyWorks API Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down MoneyWorks API Server...');
  process.exit(0);
});

// Start the server
startServer().catch(console.error);