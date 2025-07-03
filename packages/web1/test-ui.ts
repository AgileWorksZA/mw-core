import puppeteer from "puppeteer";

const BASE_URL = "http://localhost:5173";

async function testUI() {
  console.log("Starting UI tests with Puppeteer...");
  
  const browser = await puppeteer.launch({
    headless: true, // Set to true for CI
    slowMo: 50, // Slow down actions to see what's happening
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Test 1: Homepage loads
    console.log("\n1. Testing homepage...");
    await page.goto(BASE_URL);
    await page.waitForSelector("h1", { timeout: 10000 });
    const title = await page.$eval("h1", el => el.textContent);
    console.log(`   ✓ Homepage loaded with title: ${title}`);
    
    // Test 2: Navigate to dashboard (should work in automation mode)
    console.log("\n2. Testing dashboard navigation...");
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForSelector(".container", { timeout: 10000 });
    console.log("   ✓ Dashboard loaded");
    
    // Test 3: Navigate to tax rates page
    console.log("\n3. Testing tax rates page...");
    await page.goto(`${BASE_URL}/tax-rates`);
    await page.waitForSelector("h1", { timeout: 10000 });
    const taxRatesTitle = await page.$eval("h1", el => el.textContent);
    console.log(`   ✓ Tax rates page loaded with title: ${taxRatesTitle}`);
    
    // Check if data loads (might show error if MoneyWorks is not running)
    try {
      await page.waitForSelector("table", { timeout: 5000 });
      console.log("   ✓ Tax rates table rendered");
      
      // Count rows
      const rowCount = await page.$$eval("tbody tr", rows => rows.length);
      console.log(`   ✓ Found ${rowCount} tax rate entries`);
    } catch (e) {
      // Check for error message
      const hasError = await page.$(".rounded-lg.border.bg-destructive") !== null;
      if (hasError) {
        const errorText = await page.$eval("[role='alert']", el => el.textContent);
        console.log(`   ⚠ Error loading tax rates: ${errorText}`);
      } else {
        console.log("   ⚠ No tax rates table found (might be empty)");
      }
    }
    
    // Test 4: Navigate to connections page
    console.log("\n4. Testing connections page...");
    await page.goto(`${BASE_URL}/connections`);
    await page.waitForSelector("h1", { timeout: 10000 });
    console.log("   ✓ Connections page loaded");
    
    // Check if automation connection exists
    const connectionCards = await page.$$(".rounded-lg.border");
    console.log(`   ✓ Found ${connectionCards.length} connection(s)`);
    
    // Test 5: Test navigation menu
    console.log("\n5. Testing navigation menu...");
    const navLinks = await page.$$eval("nav a", links => 
      links.map(link => ({
        text: link.textContent,
        href: link.getAttribute("href")
      }))
    );
    console.log("   ✓ Navigation links found:");
    navLinks.forEach(link => {
      console.log(`     - ${link.text} -> ${link.href}`);
    });
    
    // Test 6: Test responsive menu (if exists)
    console.log("\n6. Testing responsive behavior...");
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE size
    await page.waitForTimeout(500);
    
    const mobileMenuButton = await page.$("button[aria-label*='menu']");
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      console.log("   ✓ Mobile menu opened");
    } else {
      console.log("   ℹ No mobile menu found (might not be implemented)");
    }
    
    console.log("\n✅ All UI tests completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    
    // Take screenshot on failure
    await page.screenshot({ 
      path: "test-failure.png",
      fullPage: true 
    });
    console.log("   Screenshot saved as test-failure.png");
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the tests
testUI().catch(error => {
  console.error("Test suite failed:", error);
  process.exit(1);
});