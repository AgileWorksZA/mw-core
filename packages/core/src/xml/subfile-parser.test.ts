import { describe, it, expect } from "bun:test";
import { parseXML } from "./parser";

describe("XMLParser - Transaction with subfiles", () => {
  it("should parse transaction with detail subfile", async () => {
    const xml = `<?xml version="1.0"?>
<export>
  <table name="Transaction">
    <transaction>
      <SequenceNumber>12345</SequenceNumber>
      <NameCode>CUST001</NameCode>
      <TransDate>20250101</TransDate>
      <Gross>1000.00</Gross>
      <subfile name="Detail">
        <Detail>
          <LineNumber>1</LineNumber>
          <Gross>500.00</Gross>
        </Detail>
      </subfile>
    </transaction>
  </table>
</export>`;

    const result = await parseXML(xml, "Transaction", "xml-verbose");
    
    expect(result).toHaveLength(1);
    expect(result[0].sequenceNumber).toBe("12345");
    expect(result[0].nameCode).toBe("CUST001");
    expect(result[0].transDate).toBe("20250101");
    expect(result[0].gross).toBe(1000);
    
    // Check subfile
    expect(result[0].subfile).toBeDefined();
    expect(Array.isArray(result[0].subfile)).toBe(true);
    expect(result[0].subfile[0].name).toBe("Detail");
    expect(result[0].subfile[0].detail).toBeDefined();
    expect(result[0].subfile[0].detail[0].lineNumber).toBe(1);
    expect(result[0].subfile[0].detail[0].gross).toBe(500);
  });

  it("should handle MoneyWorks attribute-style XML", async () => {
    const xml = `<?xml version="1.0"?>
<transaction>
  <SequenceNumber _="12345"/>
  <Gross _="1000.00"/>
  <subfile name="Detail">
    <Detail>
      <LineNumber _="1"/>
      <Gross _="500.00"/>
    </Detail>
  </subfile>
</transaction>`;

    const result = await parseXML(xml, "Transaction", "xml-verbose");
    
    expect(result).toHaveLength(1);
    expect(result[0].sequenceNumber).toBe("12345");
    expect(result[0].gross).toBe(1000);
  });
});