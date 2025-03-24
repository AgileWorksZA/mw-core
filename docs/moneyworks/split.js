const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Splits a large HTML file into smaller files while preserving anchor links
 * @param {string} inputFilePath - Path to the input HTML file
 * @param {string} outputDir - Directory where split files will be saved
 * @param {number} maxElements - Maximum number of elements per file (default: 100)
 * @param {string} splitSelector - CSS selector for elements to split on (default: 'h1, h2')
 * @param {string} baseFileName - Base name for output files (default: 'part')
 */
function splitHtmlFile(
  inputFilePath,
  outputDir,
  maxElements = 100,
  splitSelector = 'h1, h2',
  baseFileName = 'part'
) {
  // Read the input file
  const htmlContent = fs.readFileSync(inputFilePath, 'utf8');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Parse the HTML content
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Get all elements that match the split selector
  const splitPoints = Array.from(document.querySelectorAll(splitSelector));

  if (splitPoints.length === 0) {
    console.error('No split points found. Check your splitSelector.');
    return;
  }

  // Create a map to track original IDs and their new locations
  const idMap = new Map();

  // Extract title, head content, etc.
  const title = document.querySelector('title')?.textContent || 'MoneyWorks';
  const head = document.querySelector('head').innerHTML;
  const bodyAttributes = document.querySelector('body').attributes;

  // Create containers for each split file
  const containers = [];
  let currentContainer = [];
  let elementCount = 0;

  // Function to start a new container
  const startNewContainer = () => {
    if (currentContainer.length > 0) {
      containers.push([...currentContainer]);
      currentContainer = [];
      elementCount = 0;
    }
  };

  // Process body elements
  const bodyElements = Array.from(document.body.childNodes);

  for (const element of bodyElements) {
    // Skip text nodes with only whitespace
    if (element.nodeType === 3 && element.textContent.trim() === '') {
      continue;
    }

    // Check if this is a split point and we've reached max elements
    const isSplitPoint = element.nodeType === 1 &&
      element.matches && element.matches(splitSelector);

    if ((isSplitPoint && elementCount >= maxElements) ||
        (elementCount >= maxElements * 2)) {
      startNewContainer();
    }

    // Add element to current container
    currentContainer.push(element.cloneNode(true));
    elementCount++;

    // Store IDs for anchor link mapping
    if (element.nodeType === 1 && element.id) {
      const fileIndex = containers.length;
      idMap.set(element.id, fileIndex);
    }
  }

  // Add the last container if not empty
  if (currentContainer.length > 0) {
    containers.push(currentContainer);
  }

  // Create navigation links for the split files
  const navLinks = containers.map((_, index) => {
    const fileName = `${baseFileName}-${index + 1}.html`;
    return `<a href="${fileName}">${title} - Page ${index + 1}</a>`;
  }).join(' | ');

  // Create and write each split file
  containers.forEach((container, index) => {
    const fileName = `${baseFileName}-${index + 1}.html`;
    const filePath = path.join(outputDir, fileName);

    // Create new document
    const newDom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
    const newDoc = newDom.window.document;

    // Set head content
    newDoc.head.innerHTML = head;

    // Set body attributes
    const newBody = newDoc.querySelector('body');
    Array.from(bodyAttributes).forEach(attr => {
      newBody.setAttribute(attr.name, attr.value);
    });

    // Add navigation at the top
    const nav = newDoc.createElement('div');
    nav.className = 'navigation';
    nav.innerHTML = `<p>${navLinks}</p><hr>`;
    newBody.appendChild(nav);

    // Add content
    container.forEach(element => {
      newBody.appendChild(element);
    });

    // Add navigation at the bottom
    const bottomNav = newDoc.createElement('div');
    bottomNav.className = 'navigation';
    bottomNav.innerHTML = `<hr><p>${navLinks}</p>`;
    newBody.appendChild(bottomNav);

    // Update anchor links in this file to point to correct split files
    const anchors = newDoc.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      const targetId = href.substring(1); // Remove # from the href

      if (idMap.has(targetId)) {
        const targetFileIndex = idMap.get(targetId);
        if (targetFileIndex !== index) {
          // Target is in a different file
          const targetFileName = `${baseFileName}-${targetFileIndex + 1}.html`;
          anchor.setAttribute('href', `${targetFileName}${href}`);
        }
        // If target is in the same file, leave the anchor as is
      }
    });

    // Write the new file
    fs.writeFileSync(filePath, newDom.serialize(), 'utf8');
    console.log(`Created ${filePath}`);
  });

  // Create an index file
  const indexPath = path.join(outputDir, 'index.html');
  const indexDom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
  const indexDoc = indexDom.window.document;

  // Set title and basic styling
  indexDoc.head.innerHTML = `
    <title>${title} - Index</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #333; }
      .parts { margin: 20px 0; }
      .parts a { display: block; margin: 10px 0; text-decoration: none; color: #0066cc; }
      .parts a:hover { text-decoration: underline; }
    </style>
  `;

  // Add content
  indexDoc.body.innerHTML = `
    <h1>${title} - Index</h1>
    <p>This HTML file has been split into ${containers.length} parts:</p>
    <div class="parts">
      ${containers.map((_, index) => {
        const fileName = `${baseFileName}-${index + 1}.html`;
        return `<a href="${fileName}">${title} - Page ${index + 1}</a>`;
      }).join('\n')}
    </div>
  `;

  // Write the index file
  fs.writeFileSync(indexPath, indexDom.serialize(), 'utf8');
  console.log(`Created ${indexPath}`);

  console.log(`
Split complete:
- Original file: ${inputFilePath}
- Split into: ${containers.length} files
- Output directory: ${outputDir}
- Index file: ${indexPath}
  `);
}

// Example usage:
// splitHtmlFile('large-document.html', './split-output', 150, 'h1, h2, h3', 'chapter');

module.exports = { splitHtmlFile };
splitHtmlFile(
  './MoneyWorks.html',  // Input file
  './',            // Output directory
  100,                             // Max elements per file
  'h1, h2',                        // CSS selector for split points
  'section'                        // Base filename for parts
);
