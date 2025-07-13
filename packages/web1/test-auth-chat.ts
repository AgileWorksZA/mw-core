import puppeteer from "puppeteer";

async function testAuthAndChat() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
  
  // Capture page errors
  page.on('pageerror', error => consoleMessages.push(`PAGE ERROR: ${error.message}`));
  
  try {
    console.log("1. Navigating to /chat...");
    await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0" });
    
    // Check if we're redirected to sign-in
    const currentUrl = page.url();
    console.log("Current URL:", currentUrl);
    
    if (currentUrl.includes("/sign-in")) {
      console.log("2. Redirected to sign-in page as expected");
      
      // Get test credentials from env
      const email = process.env.TEST_USER_EMAIL || "herman@agileworks.co.za";
      const password = process.env.TEST_USER_PASSWORD || "the-sun-shines-0n-NARNIA!";
      
      console.log("3. Attempting to sign in with test credentials...");
      
      // Wait for Clerk's sign-in form to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clerk uses specific input names
      // Try to find the email input first
      try {
        await page.waitForSelector('input[name="identifier"]', { timeout: 5000 });
        await page.click('input[name="identifier"]');
        await page.type('input[name="identifier"]', email);
        console.log("Entered email");
        
        // Press Tab or Enter to continue to password
        await page.keyboard.press('Tab');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Now try password field
        const passwordInput = await page.$('input[type="password"]');
        if (passwordInput) {
          await passwordInput.click();
          await passwordInput.type(password);
          console.log("Entered password");
          
          // Submit the form
          await page.keyboard.press('Enter');
        } else {
          // Maybe we need to click continue first
          const continueButton = await page.$('button[type="submit"]');
          if (continueButton) {
            await continueButton.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Now try password
            await page.waitForSelector('input[type="password"]', { timeout: 5000 });
            await page.type('input[type="password"]', password);
            console.log("Entered password after continue");
            
            // Submit
            await page.keyboard.press('Enter');
          }
        }
      } catch (e) {
        console.log("Error during sign in:", e);
        // Take a screenshot to see what's on the page
        await page.screenshot({ path: 'signin-form-error.png', fullPage: true });
        throw e;
      }
      
      console.log("4. Waiting for navigation after sign in...");
      await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 });
      
      const afterSignInUrl = page.url();
      console.log("URL after sign in:", afterSignInUrl);
      
      // Now try to access /chat again
      console.log("5. Navigating to /chat after authentication...");
      await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0" });
      
      const chatUrl = page.url();
      console.log("Final URL:", chatUrl);
      
      // Check if we're on a chat session page
      if (chatUrl.includes("/chat/")) {
        console.log("✅ SUCCESS: Redirected to chat session!");
      } else {
        console.log("❌ ERROR: Not redirected to chat session. Current URL:", chatUrl);
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'chat-error.png', fullPage: true });
        console.log("Screenshot saved as chat-error.png");
      }
      
    } else if (currentUrl.includes("/chat/")) {
      console.log("✅ Already authenticated and redirected to chat session!");
    } else {
      console.log("❌ Unexpected redirect to:", currentUrl);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'unexpected-redirect.png', fullPage: true });
      console.log("Screenshot saved as unexpected-redirect.png");
    }
    
    // Wait a bit to capture any late console messages
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (consoleMessages.length > 0) {
      console.log("\nConsole messages:");
      consoleMessages.forEach(msg => console.log(msg));
    }
    
  } catch (error) {
    console.error("❌ Test failed with error:", error);
    
    // Take a screenshot on error
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log("Error screenshot saved as error-screenshot.png");
    
  } finally {
    await browser.close();
  }
}

// Run the test
testAuthAndChat().catch(console.error);