import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to chat route...');
    
    // Navigate with longer timeout
    await page.goto('http://localhost:5173/chat', { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });
    
    console.log('Page loaded successfully!');
    
    // Wait for chat interface to be visible
    await page.waitForSelector('.container', { timeout: 10000 });
    console.log('Chat container found');
    
    // Take a screenshot
    await page.screenshot({ path: 'chat-loaded.png' });
    console.log('Screenshot saved as chat-loaded.png');
    
    // Check if there are any console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    // Wait a bit to see if there are any errors
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('Error:', error);
    
    // Take a screenshot on error
    await page.screenshot({ path: 'chat-error.png' });
    console.log('Error screenshot saved as chat-error.png');
  }
  
  // Keep browser open for debugging
  console.log('Browser will stay open for debugging. Press Ctrl+C to exit.');
})();