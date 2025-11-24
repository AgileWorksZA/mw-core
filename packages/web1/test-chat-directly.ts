import puppeteer from "puppeteer";

async function testChatDirectly() {
	const browser = await puppeteer.launch({
		headless: false,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();

	// Set viewport
	await page.setViewport({ width: 1280, height: 800 });

	try {
		console.log("=== Testing Chat Directly ===\n");

		// Since you said you're logged in and have a connection, let's go directly to chat
		console.log("1. Navigating directly to /chat...");
		await page.goto("http://localhost:5173/chat", {
			waitUntil: "networkidle0",
			timeout: 30000,
		});

		// Wait a bit for any redirects
		await new Promise((resolve) => setTimeout(resolve, 3000));

		const currentUrl = page.url();
		console.log("   Current URL:", currentUrl);

		if (currentUrl.includes("/sign-in")) {
			console.log("❌ Redirected to sign-in - not authenticated");
			return;
		}

		if (currentUrl.includes("/connections/new")) {
			console.log("❌ Redirected to create connection - no connections exist");
			return;
		}

		if (!currentUrl.includes("/chat/")) {
			console.log("❌ Did not reach chat session. Current URL:", currentUrl);
			await page.screenshot({ path: "chat-direct-error.png", fullPage: true });
			return;
		}

		console.log("✅ Successfully reached chat session!\n");

		// Wait for chat interface to fully load
		console.log("2. Waiting for chat interface to load...");
		await page.waitForSelector('textarea, input[type="text"]', {
			timeout: 10000,
		});

		// Find the message input
		const messageInput =
			(await page.$("textarea")) ||
			(await page.$(
				'input[type="text"][placeholder*="message" i], input[type="text"][placeholder*="ask" i], input[type="text"][placeholder*="type" i]',
			));

		if (!messageInput) {
			console.log("❌ Could not find message input");
			await page.screenshot({ path: "no-input-field.png", fullPage: true });
			return;
		}

		console.log("✅ Found message input\n");

		// Type and send message
		console.log("3. Sending message to get suppliers...");
		await messageInput.click();
		await messageInput.type("Please list all suppliers in the system");

		// Try to find and click send button, or just press Enter
		const sendButton = await page.$(
			'button[type="submit"], button:has-text("Send"), button[aria-label*="send" i]',
		);
		if (sendButton) {
			await sendButton.click();
		} else {
			await page.keyboard.press("Enter");
		}

		console.log("   Message sent. Waiting for response...\n");

		// Wait for AI response - look for any new message that appears
		const startTime = Date.now();
		let foundResponse = false;

		while (Date.now() - startTime < 30000 && !foundResponse) {
			const messages = await page.$$eval(
				'div[role="article"], .message, .chat-message, [data-role="message"]',
				(elements) =>
					elements.map((el) => ({
						text: el.textContent?.trim() || "",
						className: el.className,
					})),
			);

			// Check if we have a response about suppliers
			const lastFewMessages = messages.slice(-3);
			for (const msg of lastFewMessages) {
				if (
					msg.text.toLowerCase().includes("supplier") &&
					!msg.text.includes("Please list all suppliers")
				) {
					foundResponse = true;
					console.log("✅ AI Response received!");
					console.log(
						"Response preview:",
						`${msg.text.substring(0, 200)}...\n`,
					);
					break;
				}
			}

			if (!foundResponse) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		}

		if (!foundResponse) {
			console.log("⚠️  No response received after 30 seconds");

			// Check for any error messages
			const errorElements = await page.$$eval(
				'.error, [role="alert"], .text-destructive',
				(elements) => elements.map((el) => el.textContent?.trim() || ""),
			);

			if (errorElements.length > 0) {
				console.log("Errors found:", errorElements);
			}
		}

		// Take final screenshot
		await page.screenshot({ path: "chat-final-state.png", fullPage: true });
		console.log("Screenshot saved as chat-final-state.png");
	} catch (error) {
		console.error("\n❌ Test failed with error:", error);
		await page.screenshot({ path: "chat-test-error.png", fullPage: true });
	} finally {
		console.log("\n=== Test Complete ===");
		await browser.close();
	}
}

// Run the test
testChatDirectly().catch(console.error);
