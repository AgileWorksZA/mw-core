console.log("Test script started");

// Simple test to see if bun works
setTimeout(() => {
  console.log("Timeout reached");
  process.exit(0);
}, 1000);

console.log("Waiting for timeout...");