import { getDatabaseAsync } from "./client";
import fs from "fs";
import path from "path";

const AUTOMATION_USER_ID = "automation_user";

export async function seedAutomationData() {
  const isAutomation = process.env.VITE_AUTOMATION === "true" || process.env.AUTOMATION === "true";
  
  if (!isAutomation) {
    return;
  }
  
  console.log("Seeding automation data...");
  
  // Check if automation user already has connections
  const db = await getDatabaseAsync();
  const existingCount = db.prepare(
    "SELECT COUNT(*) as count FROM mw_connections WHERE clerk_user_id = ?"
  ).get(AUTOMATION_USER_ID) as { count: number };
  
  if (existingCount.count > 0) {
    console.log("Automation data already exists");
    return;
  }
  
  // Read mw-config.json
  const configPath = path.join(process.cwd(), "mw-config.json");
  let config;
  
  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    config = JSON.parse(configContent);
  } catch (error) {
    console.error("Failed to read mw-config.json:", error);
    // Use default values if config file doesn't exist
    config = {
      host: "localhost",
      port: 6710,
      dataFile: "acme.moneyworks",
      username: "Herman Geldenhuys",
      password: "",
      folderPassword: "",
      folderName: ""
    };
  }
  
  // Create default connection for automation user directly
  const { createCryptoService } = await import("../services/crypto");
  const crypto = createCryptoService(AUTOMATION_USER_ID);
  const { randomUUID } = await import("crypto");
  const id = randomUUID();
  
  const stmt = db.prepare(`
    INSERT INTO mw_connections (
      id, clerk_user_id, connection_name, mw_username, mw_password,
      mw_folder_name, mw_folder_password, mw_data_file, mw_host, mw_port,
      is_default, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    AUTOMATION_USER_ID,
    "Automation Test Connection",
    crypto.encrypt(config.username),
    crypto.encrypt(config.password || ""),
    config.folderName ? crypto.encrypt(config.folderName) : null,
    config.folderPassword ? crypto.encrypt(config.folderPassword) : null,
    crypto.encrypt(config.dataFile),
    config.host,
    config.port,
    1, // is_default
    new Date().toISOString(),
    new Date().toISOString()
  );
  
  console.log("Automation data seeded successfully");
}