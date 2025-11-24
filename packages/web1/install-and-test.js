#!/usr/bin/env node

const { execSync, spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

console.log("🧹 Cleaning up old files...");
try {
	execSync(
		"rm -rf node_modules bun.lockb package-lock.json yarn.lock .parcel-cache dist build",
		{
			cwd: __dirname,
			stdio: "inherit",
		},
	);
} catch (e) {
	console.log("Clean up done (some files may not have existed)");
}

console.log("\n📦 Installing dependencies with bun...");
try {
	execSync("bun install", {
		cwd: __dirname,
		stdio: "inherit",
		env: { ...process.env },
	});
	console.log("✅ Dependencies installed successfully!");
} catch (error) {
	console.error("❌ Failed to install dependencies:", error.message);
	console.log("\n🔄 Trying with npm instead...");

	try {
		execSync("npm install", {
			cwd: __dirname,
			stdio: "inherit",
		});
		console.log("✅ Dependencies installed with npm!");
	} catch (npmError) {
		console.error("❌ npm install also failed:", npmError.message);
		process.exit(1);
	}
}

console.log("\n🚀 Starting development server...");
const devProcess = spawn("bun", ["dev"], {
	cwd: __dirname,
	stdio: "inherit",
	env: { ...process.env },
});

devProcess.on("error", (error) => {
	console.error("❌ Failed to start dev server:", error);
	process.exit(1);
});

devProcess.on("close", (code) => {
	console.log(`Dev server exited with code ${code}`);
});
