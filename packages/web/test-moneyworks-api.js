// Test MoneyWorks AI API
const testMoneyWorksAPI = async () => {
  try {
    const response = await fetch('http://localhost:5173/api/moneyworks-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What is the company name?',
          },
        ],
        chatId: 'test-' + Date.now(),
      }),
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      return;
    }

    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    console.log('Starting to read stream...');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      process.stdout.write(chunk);
    }
    
    console.log('\n\nStream complete');
  } catch (error) {
    console.error('Error:', error);
  }
};

testMoneyWorksAPI();