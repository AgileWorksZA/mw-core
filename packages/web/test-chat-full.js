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
    console.log('Testing full chat route with persistence...');
    
    await page.goto('http://localhost:5173/chat', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('Page loaded successfully!');
    
    // Wait for the chat interface
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    console.log('Chat input found');
    
    // Type a message
    await page.type('input[type="text"]', 'Test message with persistent storage');
    console.log('Typed test message');
    
    // Submit the form
    await page.click('button[type="submit"]');
    console.log('Submitted message');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Click the hamburger menu to open history
    await page.click('button:has-text("☰")');
    console.log('Opened history sidebar');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if session is saved
    const sessions = await page.$$eval('.font-medium.truncate', elements => 
      elements.map(el => el.textContent)
    );
    
    console.log('Sessions found:', sessions);
    
    // Click "New Chat" button
    await page.click('button:has-text("+ New Chat")');
    console.log('Started new chat');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Type another message in new chat
    await page.type('input[type="text"]', 'Second chat session test');
    await page.click('button[type="submit"]');
    console.log('Sent message in second chat');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Take a screenshot
    await page.screenshot({ path: 'chat-persistence-test.png', fullPage: true });
    console.log('Screenshot saved as chat-persistence-test.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\nTest complete. Browser will stay open. Press Ctrl+C to exit.');
})();