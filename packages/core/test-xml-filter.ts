/**
 * Test to see raw XML with filter
 */

import config from "./mw-config.json";

async function testXMLFilter() {
  console.log("Testing raw XML response with filter...\n");

  // Test with filter
  console.log("1. Fetching CA accounts (with filter)...");
  const response1 = await fetch(
    "http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech%2fGeldenTech.moneyworks/export?table=Account&format=xml-verbose&filter=type%3D%22CA%22",
    {
      headers: {
        Authorization: `Basic ${btoa("Herman Geldenhuys:spoon.1024")}`,
      },
    },
  );

  const xml1 = await response1.text();
  console.log("Response (first 500 chars):");
  console.log(xml1.substring(0, 500));

  // Count accounts in XML
  const accountMatches = xml1.match(/<account>/g);
  console.log(
    `\nAccounts in XML: ${accountMatches ? accountMatches.length : 0}`,
  );

  // Check the count attribute
  const countMatch = xml1.match(/count="(\d+)"/);
  console.log(`Count attribute: ${countMatch ? countMatch[1] : "not found"}`);

  const foundMatch = xml1.match(/found="(\d+)"/);
  console.log(`Found attribute: ${foundMatch ? foundMatch[1] : "not found"}`);
}

testXMLFilter();
