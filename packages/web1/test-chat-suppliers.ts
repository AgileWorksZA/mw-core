import puppeteer from "puppeteer";

async function testChatSuppliers() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    console.log("=== Testing Chat with Suppliers Query ===\n");
    
    // Since you reported being logged in and having connections, let's bypass auth checks
    // by setting cookies that indicate a logged in state
    await page.setCookie({
      name: '__session',
      value: 'test-session',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    });
    
    // Go directly to chat - this should create a new session if needed
    console.log("1. Navigating to /chat...");
    await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0", timeout: 30000 });
    
    // Wait for any redirects to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentUrl = page.url();
    console.log("   Current URL:", currentUrl);
    
    // If we're on a chat session page, that's good
    if (currentUrl.includes("/chat/")) {
      console.log("✅ Reached chat session page\n");
      
      // Wait for the chat interface to load
      console.log("2. Waiting for chat interface...");
      
      // Wait a bit for React to render
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Look for any textarea or input in the chat area
      const possibleSelectors = [
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        '.chat-input',
        '[data-testid="message-input"]',
        '[role="textbox"]'
      ];
      
      let messageInput = null;
      for (const selector of possibleSelectors) {
        messageInput = await page.$(selector);
        if (messageInput) {
          console.log(`✅ Found message input using selector: ${selector}\n`);
          break;
        }
      }
      
      if (!messageInput) {
        // Try to find any input-like element
        const inputElements = await page.$$eval('textarea, input, [contenteditable], [role="textbox"]', elements => 
          elements.map(el => ({
            tag: el.tagName,
            type: el.getAttribute('type'),
            placeholder: el.getAttribute('placeholder'),
            role: el.getAttribute('role'),
            className: el.className
          }))
        );
        
        console.log("Available input elements on page:");
        inputElements.forEach(el => console.log("  -", JSON.stringify(el)));
        
        throw new Error("Could not find message input field");
      }
      
      try {
        
        // Type the suppliers query
        console.log("3. Sending suppliers query...");
        if (messageInput) {
          await messageInput.click();
          await page.keyboard.type('Can you list all suppliers in the MoneyWorks system?');
          
          // Send message
          await page.keyboard.press('Enter');
          console.log("   Message sent. Waiting for AI response...\n");
          
          // Wait for response - look for any message element that appears
          const responseTimeout = 30000; // 30 seconds
          const startTime = Date.now();
          let foundResponse = false;
          
          while (Date.now() - startTime < responseTimeout && !foundResponse) {
            // Check for any message elements
            const messages = await page.$$eval('[role="article"], .message, .chat-message, [data-message], div[class*="message"]', elements => 
              elements.map(el => ({
                text: el.textContent?.trim() || '',
                className: el.className || '',
                role: el.getAttribute('role') || ''
              }))
            );
            
            // Look for AI response about suppliers
            for (const msg of messages) {
              if (msg.text && 
                  !msg.text.includes('Can you list all suppliers') && 
                  (msg.text.toLowerCase().includes('supplier') || 
                   msg.text.includes('No suppliers') ||
                   msg.text.includes('error') ||
                   msg.text.includes('failed'))) {
                foundResponse = true;
                console.log("✅ AI Response received!");
                console.log("\nAI Response:", msg.text.substring(0, 500));
                if (msg.text.length > 500) {
                  console.log("... [truncated]");
                }
                break;
              }
            }
            
            if (!foundResponse) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (!foundResponse) {
            console.log("⚠️  No response received after 30 seconds");
            
            // Check for errors
            const errorElements = await page.$$eval('.error, [role="alert"], .text-destructive, .text-red-500', elements =>
              elements.map(el => el.textContent?.trim() || '').filter(text => text.length > 0)
            );
            
            if (errorElements.length > 0) {
              console.log("\nErrors found on page:");
              errorElements.forEach(err => console.log("  -", err));
            }
          }
          
          // Take screenshot of final state
          await page.screenshot({ path: 'chat-suppliers-result.png', fullPage: true });
          console.log("\nScreenshot saved as chat-suppliers-result.png");
        }
        
      } catch (error) {
        console.log("❌ Chat interface did not load properly");
        console.error("Error:", error);
        await page.screenshot({ path: 'chat-interface-error.png', fullPage: true });
      }
      
    } else if (currentUrl.includes("/sign-in")) {
      console.log("❌ Redirected to sign-in - authentication required");
      console.log("   Please ensure you're logged in before running this test");
    } else if (currentUrl.includes("/connections/new")) {
      console.log("❌ Redirected to create connection - no connections exist");
      console.log("   Please create a connection before running this test");
    } else {
      console.log("❌ Unexpected redirect to:", currentUrl);
      await page.screenshot({ path: 'unexpected-chat-redirect.png', fullPage: true });
    }
    
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    await page.screenshot({ path: 'chat-test-error.png', fullPage: true });
  } finally {
    console.log("\n=== Test Complete ===");
    await browser.close();
  }
}

// Run the test
testChatSuppliers().catch(console.error);