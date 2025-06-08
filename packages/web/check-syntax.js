import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'app/modules/ui-designer/transformers');

// Common issues to check for
const patterns = [
  { pattern: /^\s*console\.log\(/, message: 'Console log should be removed' },
  { pattern: /^\s*\/\/\s*TODO:/, message: 'TODO comment should be addressed' },
  { pattern: /[^\w]any[^\w]/, message: 'Explicit any should be avoided if possible' },
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let issues = [];

  lines.forEach((line, lineNumber) => {
    patterns.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        issues.push({
          file: filePath,
          line: lineNumber + 1,
          message,
          content: line.trim()
        });
      }
    });
  });

  return issues;
}

function checkDirectory(directory) {
  const files = fs.readdirSync(directory);
  let allIssues = [];

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      allIssues = [...allIssues, ...checkDirectory(filePath)];
    } else if (stats.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      allIssues = [...allIssues, ...checkFile(filePath)];
    }
  });

  return allIssues;
}

const issues = checkDirectory(directoryPath);

// Print the results
if (issues.length > 0) {
  console.log(`Found ${issues.length} issues:\n`);
  issues.forEach(issue => {
    console.log(`${issue.file}:${issue.line} - ${issue.message}`);
    console.log(`  ${issue.content}\n`);
  });
} else {
  console.log('No issues found!');
}