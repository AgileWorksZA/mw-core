import puppeteer from "puppeteer";

async function testCompleteFlow() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    console.log("=== Testing Complete Authentication and Chat Flow ===\n");
    
    console.log("1. Navigating to /chat...");
    await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0" });
    
    const currentUrl = page.url();
    console.log("   Current URL:", currentUrl);
    
    if (currentUrl.includes("/sign-in")) {
      console.log("✅ Correctly redirected to sign-in (not authenticated)\n");
      
      // Sign in
      const email = process.env.TEST_USER_EMAIL || "herman@agileworks.co.za";
      const password = process.env.TEST_USER_PASSWORD || "the-sun-shines-0n-NARNIA!";
      
      console.log("2. Signing in...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Enter credentials
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
        // Click continue first
        const continueButton = await page.$('button[type="submit"]');
        if (continueButton) {
          await continueButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          await page.waitForSelector('input[type="password"]', { timeout: 5000 });
          await page.type('input[type="password"]', password);
          await page.keyboard.press('Enter');
        }
      }
      
      console.log("   Waiting for navigation...");
      await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 30000 });
      console.log("✅ Signed in successfully\n");
    }
    
    console.log("3. Navigating to /chat again...");
    await page.goto("http://localhost:5173/chat", { waitUntil: "networkidle0" });
    
    // Wait a bit for any redirects
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const finalUrl = page.url();
    console.log("   Final URL:", finalUrl);
    
    if (finalUrl.includes("/connections/new")) {
      console.log("✅ Correctly redirected to create connection (no connections exist)\n");
      console.log("=== TEST PASSED ===");
      console.log("Authentication flow is working correctly!");
      console.log("- Unauthenticated users are redirected to sign-in");
      console.log("- Authenticated users without connections are redirected to create one");
    } else if (finalUrl.includes("/chat/")) {
      console.log("✅ Successfully redirected to chat session (user has connections)\n");
      console.log("=== TEST PASSED ===");
      console.log("Full flow is working correctly!");
    } else {
      console.log("❌ Unexpected final URL:", finalUrl);
      await page.screenshot({ path: 'final-state.png', fullPage: true });
      console.log("Screenshot saved as final-state.png");
    }
    
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
    await page.screenshot({ path: 'error-final.png', fullPage: true });
    console.log("Error screenshot saved as error-final.png");
  } finally {
    console.log("\nConsole messages:");
    consoleMessages.slice(-10).forEach(msg => console.log("  ", msg));
    
    await browser.close();
  }
}

// Run the test
testCompleteFlow().catch(console.error);