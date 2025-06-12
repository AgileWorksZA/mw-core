// Direct test using Node.js
const fetch = require('node:fetch');

async function test() {
  const url = "http://localhost:6710/REST/Admin:@Acme%2fWidgets/export?table=Name&format=xml-verbose&limit=1";
  
  console.log("Testing URL:", url);
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    console.log("Status:", response.status);
    console.log("Response type:", response.headers.get('content-type'));
    console.log("Response length:", text.length);
    console.log("\nFirst 500 chars:");
    console.log(text.substring(0, 500));
    
    if (text.trim() === "Name") {
      console.log("\nERROR: Server returned just 'Name' instead of XML!");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

test();