#!/usr/bin/env bun

async function testComplexQuery() {
  console.log("Testing complex transaction queries...\n");
  
  const queries = [
    "show me all purchase invoices from last month",
    "list all transactions for customer ACME001",
    "what are my open purchase orders?"
  ];
  
  for (const query of queries) {
    console.log(`\n=== Testing: "${query}" ===\n`);
    
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
              content: query
            }
          ],
          chatId: "test-complex-" + Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let toolCalls = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.trim() && line.includes('"toolName"')) {
            const match = line.match(/"toolName":"([^"]+)","args":(.+)\}/);
            if (match) {
              toolCalls.push({
                tool: match[1],
                args: JSON.parse(match[2])
              });
            }
          }
        }
      }
      
      console.log("Tool calls:");
      toolCalls.forEach(call => {
        console.log(`- ${call.tool}:`, JSON.stringify(call.args, null, 2));
      });
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  console.log("\n\nAll tests completed!");
}

testComplexQuery();