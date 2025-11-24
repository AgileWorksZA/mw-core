#!/usr/bin/env bun

// Direct test without going through CLI
async function test() {
	const url =
		"http://Admin:@localhost:6710/REST/Acme%2fWidgets/export?table=Name&format=xml-verbose&limit=1";

	console.log("Fetching:", url);

	const response = await fetch(url, {
		headers: {
			Authorization: `Basic ${btoa("Admin:")}`,
			"Authorization-Folder": "Acme Widgets",
		},
	});

	const text = await response.text();

	console.log("Status:", response.status);
	console.log("Response length:", text.length);
	console.log("\nFirst 500 chars:");
	console.log(text.substring(0, 500));

	// Check if it's just "Name"
	if (text.trim() === "Name") {
		console.log("\nERROR: Server returned just 'Name' instead of XML!");
	}
}

test().catch(console.error);
