#!/usr/bin/env bun

// Parse the exported TSV tax rates data
import { readFile } from "node:fs/promises";

async function main() {
  const tsvData = await readFile("/Users/hgeldenhuys/WebstormProjects/mw-core/packages/canonical/src/entities/tax-rates/taxrates.tsv", "utf-8");
  
  const lines = tsvData.trim().split('\n');
  const taxRates = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const fields = line.split('\t');
    
    // Based on the MoneyWorks TaxRate fields
    const taxRate = {
      _SequenceNumber: fields[0],
      _ModStamp: fields[1],
      LastModifiedTime: fields[2],
      TaxCode: fields[3],
      PaidAccount: fields[4],
      RecAccount: fields[5],
      Rate1: parseFloat(fields[6]),
      Date: fields[7],
      Rate2: parseFloat(fields[8]),
      Combine: parseInt(fields[9]),
      CombineRate1: parseFloat(fields[10]),
      CombineRate2: parseFloat(fields[11]),
      GSTPaid: parseFloat(fields[12]),
      GSTReceived: parseFloat(fields[13]),
      NetPaid: parseFloat(fields[14]),
      NetReceived: parseFloat(fields[15]),
      Description: fields[16],
      _FinalisationCount: parseInt(fields[17]),
      _LastFinalised: parseInt(fields[18]),
      _FinalDate: fields[19],
      _PeriodGSTPaid: parseFloat(fields[20]),
      _PeriodGSTReceived: parseFloat(fields[21]),
      Bracket: parseInt(fields[22]),
      Formula: fields[23],
      UserNum: parseFloat(fields[24]),
      Custom1: fields[25],
      Custom2: fields[26],
      Custom3: fields[27],
      Custom4: fields[28],
      UserText: fields[29],
      TaggedText: fields[30]
    };
    
    taxRates.push(taxRate);
  }
  
  console.log("Exported Tax Rates from MoneyWorks:");
  console.log("====================================");
  console.log(`Total Tax Rates: ${taxRates.length}`);
  console.log("\nTax Rate Details:");
  
  for (const rate of taxRates) {
    console.log(`\n${rate.TaxCode} - ${rate.Description}`);
    console.log(`  Rate1: ${rate.Rate1}%${rate.Date ? ` (before ${rate.Date})` : ''}`);
    console.log(`  Rate2: ${rate.Rate2}%${rate.Date ? ` (after ${rate.Date})` : ''}`);
    console.log(`  Paid Account: ${rate.PaidAccount || 'N/A'}`);
    console.log(`  Received Account: ${rate.RecAccount || 'N/A'}`);
    
    if (rate.Combine > 0) {
      console.log(`  Combine Mode: ${rate.Combine} (${rate.Formula || 'N/A'})`);
      console.log(`  Combined Rates: ${rate.CombineRate1}% / ${rate.CombineRate2}%`);
    }
    
    if (rate.GSTPaid > 0 || rate.GSTReceived > 0) {
      console.log(`  Last Finalization: GST Paid: $${rate.GSTPaid.toFixed(2)}, GST Received: $${rate.GSTReceived.toFixed(2)}`);
    }
  }
  
  // Save as JSON for further processing
  await Bun.write(
    "/Users/hgeldenhuys/WebstormProjects/mw-core/packages/cli/taxrates.json",
    JSON.stringify(taxRates, null, 2)
  );
  
  console.log("\n✅ Tax rates exported successfully!");
  console.log("   TSV file: taxrates.tsv");
  console.log("   JSON file: taxrates.json");
}

main().catch(console.error);