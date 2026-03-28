#!/usr/bin/env bun

async function testChatAPI() {
  console.log("Testing MoneyWorks AI Chat API...");
  
  try {
    const response = await fetch("http://localhost:5173/api/moneyworks-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "What accounting tools do you have available?"
          }
        ],
        chatId: "test-" + Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim()) {
          console.log("Received:", line);
        }
      }
    }
    
    console.log("\nChat API test completed successfully!");
  } catch (error) {
    console.error("Error testing chat API:", error);
  }
}

testChatAPI();