#!/usr/bin/env node

/**
 * AUTHENTICATION VERIFICATION SCRIPT
 * 
 * Purpose: Validate MoneyWorks dual authentication header generation
 * Created during: Authentication debugging session (previous session)
 * 
 * What this script does:
 * 1. Tests current authentication header implementation vs expected format
 * 2. Validates credential string formatting (username:Document:password format)
 * 3. Compares Base64 encoding with known test vectors
 * 4. Identifies differences between combined vs separate header approaches
 * 
 * Key discovery: MoneyWorks requires TWO separate Authorization headers,
 * not one combined header with comma separation.
 * 
 * Status: HISTORICAL - Used to identify authentication issues that are now FIXED
 * Note: This script still uses old password (shalom1024) - was created before fix
 */
const config = {
  "host": "hjonck-pro.local",
  "port": 6710,
  "protocol": "http",
  "dataFile": "AgileWorks Information Systems Main GL To Fix.moneyworks",
  "username": "support",
  "password": "shalom1024",
  "folderAuth": {
    "folderName": "Agileworks",
    "password": "shalom1024"
  }
};

// Current implementation
function createAuthHeadersCurrent() {
  // Document auth (always required)
  const documentCredentials = `${config.username}:Document:${config.password}`;
  const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

  // Folder auth (only if configured)
  if (config.folderAuth) {
    const { folderName, password } = config.folderAuth;
    const folderCredentials = `${folderName}:Datacentre:${password}`;
    const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

    // Return combined auth headers
    return {
      Authorization: `${documentAuth}, ${folderAuth}`,
    };
  }

  // Return document auth only
  return {
    Authorization: documentAuth,
  };
}

// Expected Python-style implementation
function createAuthHeadersExpected() {
  // Document credentials: support:Document:shalom1024
  const documentCredentials = `${config.username}:Document:${config.password}`;
  const documentAuth = `Basic ${Buffer.from(documentCredentials).toString("base64")}`;

  // Folder credentials: Agileworks:Datacentre:shalom1024
  const { folderName, password } = config.folderAuth;
  const folderCredentials = `${folderName}:Datacentre:${password}`;
  const folderAuth = `Basic ${Buffer.from(folderCredentials).toString("base64")}`;

  console.log("=== CREDENTIAL STRINGS ===");
  console.log("Document credentials string:", documentCredentials);
  console.log("Folder credentials string:", folderCredentials);
  console.log("");

  console.log("=== BASE64 ENCODED VALUES ===");
  console.log("Document auth:", documentAuth);
  console.log("Folder auth:", folderAuth);
  console.log("");

  // Python returns TWO SEPARATE headers, not combined
  return {
    headers: [
      { name: "Authorization", value: documentAuth },
      { name: "Authorization", value: folderAuth }
    ]
  };
}

// Known working test vectors from specification
const testVectors = {
  folder: {
    input: "Agileworks:Datacentre:SHALOM1024",
    expected: "QWdpbGV3b3JrczpEYXRhY2VudHJlOlNIQUxPTTEwMjQ="
  },
  document: {
    input: "Admin:Document:support1024", 
    expected: "QWRtaW46RG9jdW1lbnQ6c3VwcG9ydDEwMjQ="
  }
};

console.log("🔍 MONEYWORKS AUTHENTICATION VERIFICATION");
console.log("==========================================");
console.log("");

console.log("📋 Current Config:");
console.log(`  Host: ${config.host}:${config.port}`);
console.log(`  Document: ${config.dataFile}`);
console.log(`  Username: ${config.username}`);
console.log(`  Password: ${config.password}`);
console.log(`  Folder Name: ${config.folderAuth.folderName}`);
console.log(`  Folder Password: ${config.folderAuth.password}`);
console.log("");

console.log("🧪 Test Vectors from Specification:");
console.log(`  Expected folder: ${testVectors.folder.input} → ${testVectors.folder.expected}`);
console.log(`  Expected document: ${testVectors.document.input} → ${testVectors.document.expected}`);
console.log("");

const current = createAuthHeadersCurrent();
const expected = createAuthHeadersExpected();

console.log("🔧 CURRENT Implementation (Combined Headers):");
console.log("Authorization:", current.Authorization);
console.log("");

console.log("✅ EXPECTED Implementation (Separate Headers):");
expected.headers.forEach((header, i) => {
  console.log(`Authorization header ${i + 1}:`, header.value);
});
console.log("");

console.log("❗ ISSUES IDENTIFIED:");

// Check if our credentials match test vector format
const ourDocCreds = `${config.username}:Document:${config.password}`;
const ourFolderCreds = `${config.folderAuth.folderName}:Datacentre:${config.folderAuth.password}`;

console.log("1. Credential Format:");
console.log(`   Our document: "${ourDocCreds}"`);
console.log(`   Test vector: "${testVectors.document.input}"`);
console.log(`   Match: ${ourDocCreds === testVectors.document.input ? "✅ YES" : "❌ NO"}`);
console.log("");

console.log(`   Our folder: "${ourFolderCreds}"`);
console.log(`   Test vector: "${testVectors.folder.input}"`);
console.log(`   Match: ${ourFolderCreds === testVectors.folder.input ? "✅ YES" : "❌ NO"}`);
console.log("");

console.log("2. Header Structure:");
console.log("   Current: Single combined header (comma-separated)");
console.log("   Expected: Two separate headers with same name");
console.log("   Issue: HTTP libraries may not handle duplicate header names correctly");
console.log("");

console.log("3. Credential Differences:");
if (ourDocCreds !== testVectors.document.input) {
  console.log(`   Document: We have "support" but test uses "Admin"`);
}
if (ourFolderCreds !== testVectors.folder.input) {
  console.log(`   Folder: We have "shalom1024" but test uses "SHALOM1024"`);
}