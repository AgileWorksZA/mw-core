#!/usr/bin/env bun

async function testUnpostedInvoices() {
  console.log("Testing 'list my unposted invoices' query...\n");
  
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
            content: "list my unposted invoices"
          }
        ],
        chatId: "test-unposted-" + Date.now()
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
    let toolCalls = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim()) {
          // Extract tool calls
          if (line.includes('"toolName"')) {
            const match = line.match(/"toolName":"([^"]+)","args":(.+)\}/);
            if (match) {
              toolCalls.push({
                tool: match[1],
                args: JSON.parse(match[2])
              });
            }
          }
          // Extract text content
          const textMatch = line.match(/^0:"(.*)"/);
          if (textMatch) {
            fullResponse += textMatch[1];
          }
        }
      }
    }
    
    console.log("Tool calls made:");
    toolCalls.forEach(call => {
      console.log(`- ${call.tool}:`, JSON.stringify(call.args, null, 2));
    });
    
    console.log("\nFull response:");
    console.log(fullResponse.replace(/\\n/g, '\n'));
    console.log("\nTest completed!");
  } catch (error) {
    console.error("Error:", error);
  }
}

testUnpostedInvoices();