#!/usr/bin/env bun

async function testMoneyWorksQuery() {
  console.log("Testing MoneyWorks data query...");
  
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
            content: "Show me the first 3 accounts in the chart of accounts"
          }
        ],
        chatId: "test-mw-" + Date.now()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim()) {
          // Extract text content from streaming format
          const match = line.match(/^0:"(.*)"/);
          if (match) {
            fullResponse += match[1];
          }
        }
      }
    }
    
    console.log("\nFull response:");
    console.log(fullResponse.replace(/\\n/g, '\n'));
    console.log("\nMoneyWorks query test completed!");
  } catch (error) {
    console.error("Error testing MoneyWorks query:", error);
  }
}

testMoneyWorksQuery();