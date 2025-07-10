import { getDatabaseAsync } from "~/db/client";
import { createCryptoService } from "./crypto";
import type { MWNowAccount } from "~/db/schema";
import { randomUUID } from "crypto";
import { MoneyWorksNOWClient, type MoneyWorksNOWFile, type MoneyWorksNOWAuthResponse } from "@moneyworks/data";

export interface CreateNowAccountInput {
  clerk_user_id: string;
  account_name: string;
  mw_now_username: string;
  mw_now_password: string;
}

export interface UpdateNowAccountInput extends Partial<CreateNowAccountInput> {
  id: string;
  mw_now_token?: string;
  mw_now_refresh_token?: string;
}

export class NowAccountService {
  private async getDb() {
    console.log("[NowAccountService] Getting database...");
    try {
      const database = await getDatabaseAsync();
      console.log("[NowAccountService] Got database successfully");
      return database;
    } catch (error) {
      console.error("[NowAccountService] Failed to get database:", error);
      throw error;
    }
  }
  
  async getNowAccountsByUser(userId: string): Promise<MWNowAccount[]> {
    console.log("[NowAccountService] getNowAccountsByUser for:", userId);
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM mw_now_accounts 
      WHERE clerk_user_id = ? 
      ORDER BY account_name ASC
    `);
    
    const accounts = stmt.all(userId) as MWNowAccount[];
    console.log("[NowAccountService] Raw accounts found:", accounts.length);
    
    if (accounts.length === 0) {
      return [];
    }
    
    const crypto = createCryptoService(userId);
    
    // Decrypt sensitive fields
    return accounts.map(account => ({
      ...account,
      mw_now_username: crypto.decrypt(account.mw_now_username),
      mw_now_password: crypto.decrypt(account.mw_now_password),
      mw_now_token: account.mw_now_token ? crypto.decrypt(account.mw_now_token) : undefined,
      mw_now_refresh_token: account.mw_now_refresh_token ? crypto.decrypt(account.mw_now_refresh_token) : undefined,
    }));
  }
  
  async getNowAccount(userId: string, accountId: string): Promise<MWNowAccount | null> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      SELECT * FROM mw_now_accounts 
      WHERE id = ? AND clerk_user_id = ?
    `);
    
    const account = stmt.get(accountId, userId) as MWNowAccount | null;
    if (!account) return null;
    
    const crypto = createCryptoService(userId);
    
    // Decrypt sensitive fields
    return {
      ...account,
      mw_now_username: crypto.decrypt(account.mw_now_username),
      mw_now_password: crypto.decrypt(account.mw_now_password),
      mw_now_token: account.mw_now_token ? crypto.decrypt(account.mw_now_token) : undefined,
      mw_now_refresh_token: account.mw_now_refresh_token ? crypto.decrypt(account.mw_now_refresh_token) : undefined,
    };
  }
  
  async createNowAccount(input: CreateNowAccountInput): Promise<MWNowAccount> {
    console.log("[NowAccountService] Starting createNowAccount");
    const db = await this.getDb();
    const crypto = createCryptoService(input.clerk_user_id);
    const id = randomUUID();
    
    // Encrypt sensitive fields
    const encryptedData = {
      mw_now_username: crypto.encrypt(input.mw_now_username),
      mw_now_password: crypto.encrypt(input.mw_now_password),
    };
    
    const stmt = db.prepare(`
      INSERT INTO mw_now_accounts (
        id, clerk_user_id, account_name, mw_now_username, mw_now_password,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const now = new Date().toISOString();
    stmt.run(
      id,
      input.clerk_user_id,
      input.account_name,
      encryptedData.mw_now_username,
      encryptedData.mw_now_password,
      now,
      now
    );
    
    const result = await this.getNowAccount(input.clerk_user_id, id);
    if (!result) {
      throw new Error("Failed to create NOW account");
    }
    return result;
  }
  
  async updateNowAccount(userId: string, input: UpdateNowAccountInput): Promise<MWNowAccount | null> {
    const db = await this.getDb();
    // Verify account belongs to user
    const existing = await this.getNowAccount(userId, input.id);
    if (!existing) return null;
    
    const crypto = createCryptoService(userId);
    
    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    
    if (input.account_name !== undefined) {
      updates.push("account_name = ?");
      values.push(input.account_name);
    }
    
    if (input.mw_now_username !== undefined) {
      updates.push("mw_now_username = ?");
      values.push(crypto.encrypt(input.mw_now_username));
    }
    
    if (input.mw_now_password !== undefined) {
      updates.push("mw_now_password = ?");
      values.push(crypto.encrypt(input.mw_now_password));
    }
    
    if (input.mw_now_token !== undefined) {
      updates.push("mw_now_token = ?");
      values.push(input.mw_now_token ? crypto.encrypt(input.mw_now_token) : null);
    }
    
    if (input.mw_now_refresh_token !== undefined) {
      updates.push("mw_now_refresh_token = ?");
      values.push(input.mw_now_refresh_token ? crypto.encrypt(input.mw_now_refresh_token) : null);
    }
    
    if (updates.length === 0) return existing;
    
    values.push(input.id);
    values.push(userId);
    
    const stmt = db.prepare(`
      UPDATE mw_now_accounts 
      SET ${updates.join(", ")}
      WHERE id = ? AND clerk_user_id = ?
    `);
    
    stmt.run(...values);
    
    return this.getNowAccount(userId, input.id);
  }
  
  async updateLastSynced(userId: string, accountId: string): Promise<void> {
    const db = await this.getDb();
    const stmt = db.prepare(`
      UPDATE mw_now_accounts 
      SET last_synced_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND clerk_user_id = ?
    `);
    
    stmt.run(accountId, userId);
  }
  
  async deleteNowAccount(userId: string, accountId: string): Promise<boolean> {
    const db = await this.getDb();
    
    // First delete all connections associated with this NOW account
    db.prepare(`
      DELETE FROM mw_connections 
      WHERE mw_now_account_id = ? AND clerk_user_id = ?
    `).run(accountId, userId);
    
    // Then delete the NOW account
    const stmt = db.prepare(`
      DELETE FROM mw_now_accounts 
      WHERE id = ? AND clerk_user_id = ?
    `);
    
    const result = stmt.run(accountId, userId);
    return result.changes > 0;
  }
  
  async authenticateAndGetFiles(account: MWNowAccount): Promise<MoneyWorksNOWAuthResponse> {
    const client = new MoneyWorksNOWClient({
      username: account.mw_now_username,
      password: account.mw_now_password,
    });
    
    const authResponse = await client.authenticate();
    
    // Update tokens if provided
    if (authResponse.token || authResponse.refreshToken) {
      await this.updateNowAccount(account.clerk_user_id, {
        id: account.id,
        mw_now_token: authResponse.token,
        mw_now_refresh_token: authResponse.refreshToken,
      });
    }
    
    // Update last synced
    await this.updateLastSynced(account.clerk_user_id, account.id);
    
    return authResponse;
  }
  
  async refreshFiles(userId: string, accountId: string): Promise<MoneyWorksNOWFile[]> {
    const account = await this.getNowAccount(userId, accountId);
    if (!account) {
      throw new Error("NOW account not found");
    }
    
    const authResponse = await this.authenticateAndGetFiles(account);
    return authResponse.files;
  }
}

export const nowAccountService = new NowAccountService();