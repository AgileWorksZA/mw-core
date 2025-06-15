#!/usr/bin/env bun

/**
 * Script to check what test data is available in MoneyWorks
 * Run with: bun run check-test-data.ts
 */

import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";
import { readFileSync } from "fs";

// Load config
const config = JSON.parse(readFileSync("./mw-config.json", "utf-8"));

const client = new MoneyWorksRESTClient(config);

async function checkTestData() {
  console.log("=== MoneyWorks Test Data Availability Check ===\n");

  try {
    // 1. Check Accounts
    console.log("1. ACCOUNTS:");
    const accountTypes = ["BA", "CA", "FA", "OA", "CL", "TL", "EQ", "IN", "OI", "CO", "EX", "OE"];
    
    for (const type of accountTypes) {
      try {
        const accounts = await client.export("Account", {
          filter: `Type="${type}"`,
          limit: 100
        });
        const count = Array.isArray(accounts) ? accounts.length : 0;
        console.log(`   ${type}: ${count} records`);
      } catch (error) {
        console.log(`   ${type}: Error - ${error.message}`);
      }
    }

    // 2. Check Transactions
    console.log("\n2. TRANSACTIONS:");
    const transactionTypes = ["DI", "DC", "DP", "CI", "CC", "CP", "JO", "BR", "BP", "BT"];
    
    for (const type of transactionTypes) {
      try {
        const transactions = await client.export("Transaction", {
          filter: `Type="${type}"`,
          limit: 100
        });
        const count = Array.isArray(transactions) ? transactions.length : 0;
        console.log(`   ${type}: ${count} records`);
      } catch (error) {
        console.log(`   ${type}: Error - ${error.message}`);
      }
    }

    // 3. Check Names
    console.log("\n3. NAMES (Customers/Suppliers):");
    try {
      const customers = await client.export("Name", {
        filter: `Type="C"`,
        limit: 100
      });
      const suppliers = await client.export("Name", {
        filter: `Type="S"`,
        limit: 100
      });
      console.log(`   Customers: ${Array.isArray(customers) ? customers.length : 0}`);
      console.log(`   Suppliers: ${Array.isArray(suppliers) ? suppliers.length : 0}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }

    // 4. Check Products
    console.log("\n4. PRODUCTS:");
    try {
      const products = await client.export("Product", {
        limit: 100
      });
      const count = Array.isArray(products) ? products.length : 0;
      console.log(`   Total products: ${count}`);
      
      if (count > 0) {
        // Check product types
        const sellable = await client.export("Product", {
          filter: `SellPrice>0`,
          limit: 100
        });
        const buyable = await client.export("Product", {
          filter: `BuyPrice>0`,
          limit: 100
        });
        console.log(`   Sellable: ${Array.isArray(sellable) ? sellable.length : 0}`);
        console.log(`   Buyable: ${Array.isArray(buyable) ? buyable.length : 0}`);
      }
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }

    // 5. Check Special Cases
    console.log("\n5. EDGE CASES:");
    
    // Check for unicode/special characters
    try {
      const specialChars = await client.export("Name", {
        filter: `Description~"&" OR Description~"<" OR Description~">"`,
        limit: 10
      });
      console.log(`   Names with special chars: ${Array.isArray(specialChars) ? specialChars.length : 0}`);
    } catch (error) {
      console.log(`   Special chars check: ${error.message}`);
    }

    // Check for long descriptions
    try {
      const result = await client.evaluate(`Count(Name, Length(Description)>50)`);
      console.log(`   Names with long descriptions: ${result}`);
    } catch (error) {
      console.log(`   Long descriptions check: ${error.message}`);
    }

    // 6. Check Periods
    console.log("\n6. PERIODS:");
    try {
      const currentPeriod = await client.evaluate("CurrentPeriod()");
      console.log(`   Current period: ${currentPeriod}`);
      
      // Count transactions by period
      const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let hasData = false;
      for (const period of periods) {
        const count = await client.evaluate(`Count(Transaction, Period=${period})`);
        if (parseInt(count) > 0) {
          console.log(`   Period ${period}: ${count} transactions`);
          hasData = true;
        }
      }
      if (!hasData) {
        console.log("   No period-specific transaction data found");
      }
    } catch (error) {
      console.log(`   Period check: ${error.message}`);
    }

  } catch (error) {
    console.error("Fatal error:", error);
  }
}

// Run the check
checkTestData().catch(console.error);