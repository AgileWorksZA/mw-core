/**
 * MoneyWorks Export/Import Usage Examples
 *
 * Demonstrates how to use the export/import system.
 */

import {
  ExportTemplate,
  MoneyWorksError,
  MoneyWorksErrorCode,
  buildTransaction,
  createClient,
  exportFrom,
  importInto,
  loadConfig,
} from "@moneyworks/core";

async function examples() {
  // Load configuration
  const config = await loadConfig("./mw-config.json");

  // Create client
  const client = createClient(config);

  try {
    // Example 1: Basic export
    console.log("Example 1: Basic Export");
    const customers = await exportFrom("Name")
      .where("Type=1")
      .limit(10)
      .orderBy("Code")
      .execute(client);

    console.log(`Found ${customers.length} customers`);

    // Example 2: Export with custom template
    console.log("\nExample 2: Template Export");
    const invoiceList = await client.export("Transaction", {
      format: ExportTemplate.transaction.invoice,
      filter: 'TypeCode="DI" AND Period=7',
    });

    console.log("Invoice list:", invoiceList);

    // Example 3: Streaming large dataset
    console.log("\nExample 3: Streaming Export");
    const stream = client.exportStream("Transaction", {
      filter: "Period>=1",
      chunkSize: 100,
      onProgress: (progress) => {
        console.log(`Progress: ${progress.current} records processed`);
      },
    });

    let totalCount = 0;
    for await (const batch of stream) {
      totalCount += batch.length;
      console.log(`Received batch of ${batch.length} transactions`);
    }
    console.log(`Total transactions: ${totalCount}`);

    // Example 4: Simple import
    console.log("\nExample 4: Simple Import");
    const productImport = importInto("Product")
      .add({
        code: "WIDGET001",
        description: "Premium Widget",
        sellPrice: 99.99,
        sellUnit: "EA",
        buyPrice: 45.0,
        buyUnit: "EA",
      })
      .add({
        code: "GADGET001",
        description: "Deluxe Gadget",
        sellPrice: 149.99,
        sellUnit: "EA",
        buyPrice: 65.0,
        buyUnit: "EA",
      })
      .workItOut("stockOnHand", "stockValue");

    const importResult = await productImport.execute(client);
    console.log("Import result:", importResult);

    // Example 5: Transaction with details
    console.log("\nExample 5: Transaction Import");
    const transaction = buildTransaction()
      .setHeader({
        nameCode: "CUST001",
        transDate: new Date(),
        description: "Sales Invoice #1234",
        typeCode: "DI",
      })
      .addInventoryLine(
        "4100", // Sales account
        "WIDGET001",
        2, // quantity
        99.99, // unit price
        "Premium Widget x 2",
      )
      .addLine(
        "2100", // Tax account
        19.99, // tax amount
        "GST 10%",
      )
      .addLine(
        "1100", // Accounts receivable
        -219.97, // total (negative for credit)
        "Payment due",
      );

    const transResult = await transaction.execute(client);
    console.log("Transaction import result:", transResult);

    // Example 6: Batch import with validation
    console.log("\nExample 6: Batch Import with Validation");
    const customerImport = importInto("Name", { validate: true }).mode(
      "upsert",
    );

    // Add multiple customers
    const customerData = [
      {
        code: "ACME001",
        name: "Acme Corporation",
        customerType: 1,
        email: "contact@acme.com",
        phone: "555-1234",
      },
      {
        code: "WIDG001",
        name: "Widget Industries",
        customerType: 1,
        email: "sales@widget.com",
        phone: "555-5678",
      },
    ];

    customerImport.addMany(customerData);

    // Validate before import
    const errors = customerImport.validate();
    if (errors.length > 0) {
      console.error("Validation errors:", errors);
    } else {
      const result = await customerImport.execute(client);
      console.log("Customer import result:", result);
    }

    // Example 7: Custom export format
    console.log("\nExample 7: Custom Export Format");
    const customTemplate = `
Customer Report
===============
{
Code: [Code]
Name: [Name]
Balance: $[Balance]
Credit Limit: $[CreditLimit]
Status: If([StopCredit], "ON HOLD", "ACTIVE")
---
}
Total Customers: Count(Name, "Type=1")
Total Outstanding: Sum([Balance], "Type=1 AND Balance>0")
`;

    const report = await client.export("Name", {
      format: { template: customTemplate },
      filter: "Type=1 AND Balance>0",
      orderBy: "Balance DESC",
    });

    console.log("Customer report:", report);

    // Example 8: Error handling
    console.log("\nExample 8: Error Handling");
    try {
      await client.export("InvalidTable", {});
    } catch (error) {
      if (error instanceof MoneyWorksError) {
        console.error(`MoneyWorks error: ${error.message}`);
        console.error(`Error code: ${error.code}`);

        if (error.is(MoneyWorksErrorCode.AUTH_FAILED)) {
          console.error("Authentication failed - check credentials");
        }
      }
    }
  } catch (error) {
    console.error("Error in examples:", error);
  }
}

// Run examples
if (require.main === module) {
  examples().catch(console.error);
}
