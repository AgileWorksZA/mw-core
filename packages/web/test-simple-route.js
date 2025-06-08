import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true 
  });
  const page = await browser.newPage();
  
  try {
    console.log('Testing simple route first...');
    
    // Test simple route
    await page.goto('http://localhost:5173/chat-simple', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('Simple route loaded successfully!');
    
    // Now test the chat route
    console.log('Now testing chat route...');
    await page.goto('http://localhost:5173/chat', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('Chat route loaded!');
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Get console logs
    const logs = await page.evaluate(() => {
      return window.console.logs || [];
    });
    console.log('Console logs:', logs);
  }
  
  console.log('Browser will stay open. Press Ctrl+C to exit.');
})();