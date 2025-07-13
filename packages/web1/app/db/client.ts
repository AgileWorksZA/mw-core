import { SCHEMA_SQL } from "./schema";
import path from "path";
import fs from "fs";

let db: any = null;
let dbInitPromise: Promise<any> | null = null;

async function initDatabase() {
  // Check if already initialized
  if (db) {
    console.log("Database already initialized");
    return db;
  }
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), "data");
  const dbPath = path.join(dataDir, "mw-connections.db");
  
  console.log("Initializing database...");
  console.log("Runtime check - Bun:", typeof Bun !== 'undefined');
  console.log("Runtime check - global.Bun:", !!global.Bun);
  console.log("Runtime check - window:", typeof window !== 'undefined');
  
  // Ensure data directory exists
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, ".gitkeep"), "", { flag: 'wx' });
  } catch (e) {
    // Directory might already exist or file already exists
  }
  
  // Check if we have Bun runtime available
  if (typeof Bun !== 'undefined' || global.Bun) {
    // @ts-ignore - Bun-specific import
    const { Database } = await import("bun:sqlite");
    db = new Database(dbPath, { create: true });
    console.log("Using Bun SQLite database");
  } else if (typeof window === 'undefined') {
    // Server-side without Bun - we're in a React Router action/loader
    // Try to use the bun:sqlite module if available
    try {
      // @ts-ignore - Dynamic import
      const { Database } = await import("bun:sqlite");
      db = new Database(dbPath, { create: true });
      console.log("Using Bun SQLite database (dynamic import)");
    } catch (e) {
      // If bun:sqlite is not available, create a better mock with in-memory storage
      console.warn("SQLite not available on server, using in-memory mock database");
      
      // Create a simple in-memory storage
      const mockData: Record<string, any[]> = {
        mw_connections: [],
        chat_sessions: [],
        chat_messages: []
      };
      
      // Pre-seed with a connection for our test user
      mockData.mw_connections.push({
        id: "mock-connection-1",
        clerk_user_id: "user_2zLoF3qzDl79hyJoTvEC5bOBc5O",
        connection_name: "Test Connection (Mock)",
        connection_type: "datacentre",
        mw_username: "encrypted-username",
        mw_password: "encrypted-password",
        mw_folder_name: null,
        mw_folder_password: null,
        mw_data_file: "encrypted-datafile",
        mw_host: "localhost",
        mw_port: 6710,
        mw_now_account_id: null,
        mw_now_file_id: null,
        mw_now_metadata: null,
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_used_at: null,
        organization_id: null
      });
      
      // For automation mode, pre-seed with a connection
      if (process.env.VITE_AUTOMATION === "true" || process.env.AUTOMATION === "true") {
        mockData.mw_connections.push({
          id: "mock-connection-2",
          clerk_user_id: "automation_user",
          connection_name: "Test Connection (Mock)",
          connection_type: "datacentre",
          mw_username: "encrypted-username",
          mw_password: "encrypted-password",
          mw_folder_name: null,
          mw_folder_password: null,
          mw_data_file: "encrypted-datafile",
          mw_host: "localhost",
          mw_port: 6710,
          mw_now_account_id: null,
          mw_now_file_id: null,
          mw_now_metadata: null,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_used_at: null,
          organization_id: null
        });
      }
      
      db = {
        prepare: (sql: string) => ({
          all: (...params: any[]) => {
            // Simple mock - return connections for the given user
            if (sql.includes("FROM mw_connections")) {
              const userId = params[0];
              return mockData.mw_connections.filter(c => c.clerk_user_id === userId);
            }
            // Return chat sessions
            if (sql.includes("FROM chat_sessions")) {
              const [connectionId, userId] = params;
              return mockData.chat_sessions.filter(s => 
                s.connection_id === connectionId && s.clerk_user_id === userId
              );
            }
            // Return chat messages
            if (sql.includes("FROM chat_messages")) {
              const sessionId = params[0];
              return mockData.chat_messages.filter(m => m.session_id === sessionId);
            }
            return [];
          },
          get: (...params: any[]) => {
            // Mock for COUNT queries
            if (sql.includes("COUNT(*)")) {
              const count = mockData.mw_connections.filter(c => 
                c.clerk_user_id === params[0]
              ).length;
              return { count };
            }
            // Mock for SELECT queries - connections
            if (sql.includes("FROM mw_connections") && sql.includes("WHERE id = ?")) {
              const [id, userId] = params;
              return mockData.mw_connections.find(c => 
                c.id === id && c.clerk_user_id === userId
              ) || null;
            }
            // Mock for SELECT queries - chat sessions
            if (sql.includes("FROM chat_sessions") && sql.includes("WHERE id = ?")) {
              const sessionId = params[0];
              return mockData.chat_sessions.find(s => s.id === sessionId) || null;
            }
            return null;
          },
          run: (...params: any[]) => {
            // Mock for INSERT
            if (sql.includes("INSERT INTO mw_connections")) {
              const newConnection = {
                id: params[0],
                clerk_user_id: params[1],
                connection_name: params[2],
                connection_type: params[3],
                mw_username: params[4],
                mw_password: params[5],
                mw_folder_name: params[6],
                mw_folder_password: params[7],
                mw_data_file: params[8],
                mw_host: params[9],
                mw_port: params[10],
                mw_now_account_id: params[11],
                mw_now_file_id: params[12],
                mw_now_metadata: params[13],
                is_default: params[14],
                created_at: params[15],
                updated_at: params[16],
                last_used_at: null,
                organization_id: null
              };
              mockData.mw_connections.push(newConnection);
            }
            // Mock for INSERT INTO chat_sessions
            if (sql.includes("INSERT INTO chat_sessions")) {
              const newSession = {
                id: params[0],
                connection_id: params[1],
                clerk_user_id: params[2],
                title: params[3],
                created_at: params[4],
                updated_at: params[5],
                message_count: params[6],
                last_message_at: null,
                summary: null
              };
              mockData.chat_sessions.push(newSession);
            }
            // Mock for INSERT INTO chat_messages
            if (sql.includes("INSERT INTO chat_messages")) {
              const newMessage = {
                id: params[0],
                session_id: params[1],
                role: params[2],
                content: params[3],
                tool_invocations: params[4],
                mw_data: params[5],
                tokens_used: params[6],
                created_at: params[7]
              };
              mockData.chat_messages.push(newMessage);
            }
            // Mock for UPDATE
            if (sql.includes("UPDATE")) {
              // Simple mock - just return success
            }
            return { changes: 1 };
          },
        }),
        exec: () => {},
      };
      return db;
    }
  } else {
    // Client-side without Bun
    throw new Error("SQLite database driver not available on client-side.");
  }
  
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON");
  
  // Create tables
  db.exec(SCHEMA_SQL);
  
  // Run migrations
  const { runMigrations } = await import("./migrate");
  await runMigrations(db);
  
  // Set WAL mode for better concurrency
  db.exec("PRAGMA journal_mode = WAL");
  
  // Clear the init promise since we're done
  dbInitPromise = null;
  
  // Schedule automation seeding after initialization completes
  if (process.env.VITE_AUTOMATION === "true" || process.env.AUTOMATION === "true") {
    // Use setImmediate or setTimeout to run after current execution
    setImmediate(async () => {
      console.log("Running automation seeding...");
      const { seedAutomationData } = await import("./seed-automation");
      await seedAutomationData();
    });
  }
  
  return db;
}

export function getDatabase() {
  if (!db && !dbInitPromise) {
    dbInitPromise = initDatabase();
  }
  
  if (!db) {
    // Database is still initializing
    // For synchronous access, we need to have initialized the database already
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  
  return db;
}

export async function getDatabaseAsync() {
  if (!db && !dbInitPromise) {
    console.log("[DB] Starting database initialization");
    dbInitPromise = initDatabase();
  }
  
  if (dbInitPromise) {
    console.log("[DB] Waiting for database initialization");
    await dbInitPromise;
    console.log("[DB] Database initialization complete");
  }
  
  console.log("[DB] Returning database instance");
  return db;
}

export { initDatabase };

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Ensure database is closed on process exit
process.on("beforeExit", () => {
  closeDatabase();
});