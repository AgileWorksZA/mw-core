/**
 * Tests for XML Parser
 */

import { describe, expect, it } from "bun:test";
import { parseXML } from "./parser";

describe("XML Parser", () => {
  describe("parseXML", () => {
    it("should handle malformed XML with string values", async () => {
      // This simulates the case where MoneyWorks returns a string value
      // instead of a proper record structure
      const malformedXML = `<?xml version="1.0"?>
<name>Name</name>`;

      const result = await parseXML(malformedXML, "Name", "xml-terse");
      
      // Should return empty array instead of ['N', 'a', 'm', 'e']
      expect(result).toEqual([]);
    });

    it("should handle export structure with string table value", async () => {
      const malformedXML = `<?xml version="1.0"?>
<export>
  <table>Name</table>
</export>`;

      const result = await parseXML(malformedXML, "Name", "xml-terse");
      
      // Should return empty array instead of ['N', 'a', 'm', 'e']
      expect(result).toEqual([]);
    });

    it("should parse valid Name records correctly", async () => {
      const validXML = `<?xml version="1.0"?>
<export>
  <table name="Name">
    <name>
      <Code>CUST001</Code>
      <Name>John Doe</Name>
      <Phone>555-1234</Phone>
    </name>
    <name>
      <Code>CUST002</Code>
      <Name>Jane Smith</Name>
      <Phone>555-5678</Phone>
    </name>
  </table>
</export>`;

      const result = await parseXML(validXML, "Name", "xml-verbose");
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("code", "CUST001");
      expect(result[0]).toHaveProperty("name", "John Doe");
      expect(result[1]).toHaveProperty("code", "CUST002");
    });

    it("should parse single Name record", async () => {
      const singleRecordXML = `<?xml version="1.0"?>
<name>
  <Code>CUST001</Code>
  <Name>John Doe</Name>
  <Phone>555-1234</Phone>
</name>`;

      const result = await parseXML(singleRecordXML, "Name", "xml-terse");
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("code", "CUST001");
      expect(result[0]).toHaveProperty("name", "John Doe");
    });

    it("should handle XML with attributes", async () => {
      const xmlWithAttrs = `<?xml version="1.0"?>
<export>
  <table name="Name">
    <name>
      <Code system="false">CUST001</Code>
      <Name>John Doe</Name>
    </name>
  </table>
</export>`;

      const result = await parseXML(xmlWithAttrs, "Name", "xml-verbose");
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("code", "CUST001");
      // System attributes should be filtered out
    });
  });
});