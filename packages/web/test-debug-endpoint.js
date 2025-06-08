// Test the debug endpoint
const testDebugEndpoint = async () => {
  const chatId = 'test-chat-123';
  const debugUrl = `http://localhost:5173/api/chat/debug/${chatId}`;
  
  try {
    const response = await fetch(debugUrl);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      return;
    }
    
    const debugInfo = await response.json();
    console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testDebugEndpoint();