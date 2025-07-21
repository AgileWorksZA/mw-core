#!/usr/bin/env bun

// Security guard for dangerous operations

let input = "";
for await (const chunk of process.stdin) {
  input += chunk;
}

try {
  const data = JSON.parse(input);
  
  // Check for dangerous bash commands
  if (data.tool_name === "Bash" && data.tool_input?.command) {
    const cmd = data.tool_input.command.toLowerCase();
    
    const dangerousPatterns = [
      /rm\s+-rf\s+\//,      // rm -rf /
      /:(\){.*:\|:&\s*}/,  // Fork bomb
      /dd\s+if=.*of=\/dev/,  // Disk overwrite
      /mkfs/,                  // Format filesystem
      />\s*\/dev\/[sh]da/,   // Overwrite disk
    ];
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(cmd)) {
        console.error("❌ Blocked dangerous command");
        process.exit(1);
      }
    }
  }
  
  // Check for sensitive file access
  const sensitiveFiles = [
    /\.ssh\//,
    /\.aws\//,
    /\.env/,
    /password/i,
    /secret/i,
    /private.*key/i,
  ];
  
  const inputStr = JSON.stringify(data.tool_input || {});
  for (const pattern of sensitiveFiles) {
    if (pattern.test(inputStr)) {
      console.error("⚠️  Warning: Accessing potentially sensitive files");
      // Don't block, just warn
      break;
    }
  }
  
  // Pass through
  process.stdout.write(input);
  process.exit(0);
  
} catch (error: any) {
  // On error, pass through
  process.stdout.write(input);
  process.exit(0);
}