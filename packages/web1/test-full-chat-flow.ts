import puppeteer from "puppeteer";

async function testFullChatFlow() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    devtools: true
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const text = `${msg.type()}: ${msg.text()}`;
    if (!text.includes('[vite]') && !text.includes('React DevTools')) {
      consoleMessages.push(text);
    }
  });
  
  try {
    console.log("=== Testing Full Chat Flow with MoneyWorks ===\n");
    
    // 1. First check if we're logged in by going to tax-rates
    console.log("1. Checking authentication status...");
    await page.goto("http://localhost:5173/tax-rates", { waitUntil: "networkidle0" });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentUrl = page.url();
    
    if (currentUrl.includes("/sign-in")) {
      console.log("   Not logged in. Signing in...");
      
      const email = process.env.TEST_USER_EMAIL || "herman@agileworks.co.za";
      const password = process.env.TEST_USER_PASSWORD || "the-sun-shines-0n-NARNIA!";
      
      // Sign in
      await page.waitForSelector('input[name="identifier"]', { timeout: 5000 });
      await page.click('input[name="identifier"]');
      await page.type('input[name="identifier"]', email);
      
      await page.keyboard.press('Tab');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const passwordInput = await page.$('input[type="password"]');
      if (passwordInput) {
        await passwordInput.click();
        await passwordInput.type(password);
        await page.keyboard.press('Enter');
      } else {
        const continueButton = await page.$('button[type="submit"]');
        if (continueButton) {
          await continueButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          await page.waitForSelector('input[type="password"]', { timeout: 5000 });
          await page.type('input[type="password"]', password);
          await page.keyboard.press('Enter');
        }
      }
      
      await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 });
      console.log("✅ Signed in successfully\n");
    } else {
      console.log("✅ Already authenticated\n");
    }
    
    // 2. Go to connections page to check if we have any
    console.log("2. Checking for existing connections...");
    await page.goto("http://localhost:5173/connections", { waitUntil: "networkidle0" });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we need to create a connection
    const pageContent = await page.content();
    if (pageContent.includes("No connections") || pageContent.includes("Create your first connection")) {
      console.log("   No connections found. Creating one...");
      
      // Click create connection button
      const createButton = await page.$('a[href="/connections/new"], button:has-text("Create Connection"), button:has-text("Add Connection")');
      if (createButton) {
        await createButton.click();
      } else {
        await page.goto("http://localhost:5173/connections/new", { waitUntil: "networkidle0" });
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fill in connection form
      console.log("   Filling connection form...");
      
      // Connection name
      await page.waitForSelector('input[name="connection_name"]', { timeout: 5000 });
      await page.type('input[name="connection_name"]', 'Test MoneyWorks');
      
      // Host
      const hostInput = await page.$('input[name="mw_host"]');
      if (hostInput) {
        await hostInput.click({ clickCount: 3 }); // Select all
        await page.type('input[name="mw_host"]', 'localhost');
      }
      
      // Port
      const portInput = await page.$('input[name="mw_port"]');
      if (portInput) {
        await portInput.click({ clickCount: 3 });
        await page.type('input[name="mw_port"]', '6710');
      }
      
      // Username
      await page.type('input[name="mw_username"]', 'Admin');
      
      // Password
      await page.type('input[name="mw_password"]', 'test');
      
      // Data file
      await page.type('input[name="mw_data_file"]', 'Acme.moneyworks');
      
      // Submit
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 10000 });
        console.log("✅ Connection created\n");
      }
    } else {
      console.log("✅ Connection already exists\n");
    }
    
    // 3. Now navigate to chat
    console.log("3. Navigating to chat...");
    await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0" });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const chatUrl = page.url();
    console.log("   Current URL:", chatUrl);
    
    if (!chatUrl.includes("/chat/")) {
      console.log("❌ Failed to reach chat session");
      await page.screenshot({ path: 'chat-navigation-error.png', fullPage: true });
      return;
    }
    
    console.log("✅ Reached chat session page\n");
    
    // 4. Send a message to get suppliers
    console.log("4. Sending message to AI assistant...");
    
    // Wait for chat interface to load
    await page.waitForSelector('textarea[placeholder*="Ask"], textarea[placeholder*="Type"], input[placeholder*="message"]', { timeout: 10000 });
    
    // Type the message
    const messageInput = await page.$('textarea[placeholder*="Ask"], textarea[placeholder*="Type"], input[placeholder*="message"]');
    if (messageInput) {
      await messageInput.click();
      await page.type('textarea[placeholder*="Ask"], textarea[placeholder*="Type"], input[placeholder*="message"]', 'Can you list all suppliers?');
      
      // Send the message (Enter or click send button)
      await page.keyboard.press('Enter');
      
      console.log("   Message sent. Waiting for response...");
      
      // Wait for response (look for supplier-related content)
      await page.waitForFunction(
        () => {
          const messages = document.querySelectorAll('[role="article"], .message, .chat-message');
          const lastMessage = messages[messages.length - 1];
          if (!lastMessage) return false;
          const text = lastMessage.textContent || '';
          return text.toLowerCase().includes('supplier') || 
                 text.includes('No suppliers found') ||
                 text.includes('error') ||
                 text.includes('failed');
        },
        { timeout: 30000 }
      );
      
      // Get the response
      const messages = await page.$$eval('[role="article"], .message, .chat-message', elements => 
        elements.map(el => el.textContent?.trim() || '')
      );
      
      console.log("\n✅ AI Response received!");
      console.log("Last message:", messages[messages.length - 1]?.substring(0, 200) + "...");
      
      // Take screenshot of successful chat
      await page.screenshot({ path: 'chat-success.png', fullPage: true });
      console.log("\nScreenshot saved as chat-success.png");
      
    } else {
      console.log("❌ Could not find message input");
      await page.screenshot({ path: 'chat-input-error.png', fullPage: true });
    }
    
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    await page.screenshot({ path: 'error-full-test.png', fullPage: true });
    console.log("Error screenshot saved as error-full-test.png");
    
    // Print recent console messages
    console.log("\nRecent console messages:");
    consoleMessages.slice(-20).forEach(msg => console.log("  ", msg));
  } finally {
    console.log("\n=== Test Complete ===");
    await browser.close();
  }
}

// Run the test
testFullChatFlow().catch(console.error);