/**
 * Test different filter syntaxes
 */

import config from "./mw-config.json";

async function testSearchFilter() {
  console.log("Testing different filter syntaxes...\n");

  const filters = [
    'type="CA"',
    'Type="CA"',
    "type=CA",
    "Type=CA",
    'search=type="CA"',
    'where=type="CA"',
    'type CONTAINS "CA"',
    'description CONTAINS "Asset"',
  ];

  for (const filter of filters) {
    console.log(`\nTesting filter: ${filter}`);

    try {
      const response = await fetch(
        `http://localhost:6710/REST/Herman%20Geldenhuys:spoon.1024@GeldenTech%2fGeldenTech.moneyworks/export?table=Account&format=xml-verbose&filter=${encodeURIComponent(filter)}&limit=3`,
        {
          headers: {
            Authorization: `Basic ${btoa("Herman Geldenhuys:spoon.1024")}`,
          },
        },
      );

      const xml = await response.text();

      // Extract table attributes
      const countMatch = xml.match(/count="(\d+)"/);
      const foundMatch = xml.match(/found="(\d+)"/);

      console.log(`  Status: ${response.status}`);
      console.log(
        `  Count: ${countMatch ? countMatch[1] : "N/A"}, Found: ${foundMatch ? foundMatch[1] : "N/A"}`,
      );

      // Show first account type if any
      const typeMatch = xml.match(/<type>([^<]+)<\/type>/);
      if (typeMatch) {
        console.log(`  First account type: ${typeMatch[1]}`);
      }
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

testSearchFilter();
