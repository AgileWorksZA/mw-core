import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  const page = await browser.newPage();
  
  // Capture console messages
  const logs = [];
  page.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    console.error('Page error:', error.message);
  });
  
  // Capture request failures
  page.on('requestfailed', request => {
    console.error('Request failed:', request.url(), request.failure().errorText);
  });
  
  try {
    console.log('Navigating to chat route with network logging...');
    
    // Try with domcontentloaded instead of networkidle0
    await page.goto('http://localhost:5173/chat', { 
      waitUntil: 'domcontentloaded',
      timeout: 10000 
    });
    
    console.log('DOM loaded!');
    
    // Wait a bit to capture any async errors
    await page.waitForTimeout(3000);
    
    // Print all console logs
    console.log('\n=== Console Logs ===');
    logs.forEach(log => {
      console.log(`[${log.type}] ${log.text}`);
      if (log.location?.url) {
        console.log(`  at ${log.location.url}:${log.location.lineNumber}`);
      }
    });
    
    // Check if there's any content
    const bodyContent = await page.$eval('body', el => el.innerHTML);
    console.log('\n=== Body Content (first 500 chars) ===');
    console.log(bodyContent.substring(0, 500));
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Print logs even on error
    console.log('\n=== Console Logs (on error) ===');
    logs.forEach(log => {
      console.log(`[${log.type}] ${log.text}`);
    });
  }
  
  console.log('\nBrowser will stay open. Press Ctrl+C to exit.');
})();