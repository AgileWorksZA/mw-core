// Test with Node.js instead of Bun
const { MoneyWorksRESTClient } = require('./packages/core/dist/rest/client');

const client = new MoneyWorksRESTClient({
  host: 'localhost',
  port: 6710,
  dataFile: 'acme.moneyworks',
  username: 'Herman Geldenhuys',
  password: ''
});

async function test() {
  console.log('Testing export with limit=1...');
  
  try {
    const result = await client.export('Transaction', {
      format: 'json',
      limit: 1
    });
    
    console.log('Success!');
    console.log('Result type:', typeof result);
    console.log('Is array:', Array.isArray(result));
    if (Array.isArray(result)) {
      console.log('Record count:', result.length);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Set timeout to prevent hanging
setTimeout(() => {
  console.error('Timeout after 10 seconds');
  process.exit(1);
}, 10000);

test();