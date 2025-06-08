import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  try {
    console.log('Testing minimal chat route...');
    
    await page.goto('http://localhost:5173/chat-minimal', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('Page loaded successfully!');
    
    // Wait for the chat interface
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    console.log('Chat input found');
    
    // Type a message
    await page.type('input[type="text"]', 'Hello, this is a test message');
    console.log('Typed test message');
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('Submitted message');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for messages
    const messages = await page.$$eval('.mb-4', elements => 
      elements.map(el => el.textContent)
    );
    
    console.log('Messages found:', messages);
    
    // Take a screenshot
    await page.screenshot({ path: 'chat-test-result.png' });
    console.log('Screenshot saved as chat-test-result.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\nTest complete. Browser will stay open. Press Ctrl+C to exit.');
})();