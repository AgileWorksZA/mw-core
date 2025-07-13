// Test the /chat route directly
async function testChatRoute() {
  console.log("Testing /chat route directly...");
  
  try {
    const response = await fetch("http://localhost:5173/chat", {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "manual"
    });
    
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    
    if (response.status === 302 || response.status === 303) {
      console.log("Redirect location:", response.headers.get("location"));
    } else if (response.status === 401) {
      console.log("Got 401 Unauthorized - auth is not working properly");
      const text = await response.text();
      console.log("Response body:", text.substring(0, 200) + "...");
    } else {
      const text = await response.text();
      console.log("Response body:", text.substring(0, 200) + "...");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testChatRoute();