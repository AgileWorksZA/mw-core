#!/usr/bin/env bun

import { generateAdapter } from "~/modules/ide/adapter/generator";

async function generateServiceConnectionAdapter() {
  console.log("🚀 Generating ServiceConnection adapter...\n");

  try {
    const result = await generateAdapter({
      templateId: "data-source",
      variables: {
        adapterType: "service-connection",
        adapterName: "Service Connection",
        adapterDescription:
          "Service connection configuration for external services",
        moduleNamespace: "serviceconnection",
        contextTypeName: "ServiceConnectionContext",
        dataTypeName: "ServiceConnectionData",
        acceptedFileTypes: ".mw-config.json, .svc.json",
        tags: "connection, service, auth, api",
        includeSchema: "true",
        includeQuickView: "true",
        parseFunction: "JSON.parse",
        stringifyFunction: "(data) => JSON.stringify(data, null, 2)",
        emptyDataValue: `{
          name: "New Service Connection",
          type: "rest",
          url: "",
          authentication: {
            type: "none"
          },
          headers: {},
          queryParams: {},
          metadata: {
            description: "",
            tags: []
          }
        }`,
      },
      overwrite: false,
    });

    console.log("Result:", result);

    if (result.success) {
      console.log("✅ ServiceConnection adapter generated successfully!");
      console.log("\n📝 Generated files:");
      if (result.files.length === 0) {
        console.log("  (No files were generated)");
      } else {
        result.files.forEach((file) => {
          console.log(`  - ${file}`);
        });
      }
    } else {
      console.log("❌ Generation failed!");
      console.log("Errors:", result.errors);
    }

    if (result.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      result.warnings.forEach((warning) => {
        console.log(`  - ${warning}`);
      });
    }

    console.log("\n🎯 Next steps:");
    console.log(
      "1. Review the generated files in app/modules/service-connection.ide/",
    );
    console.log(
      "2. Customize the editor component for connection configuration",
    );
    console.log("3. Add validation for different authentication types");
    console.log("4. Implement connection testing functionality");
    console.log("5. Add import/export capabilities");
    console.log("6. Run 'bun run dev' to test the new adapter");
  } catch (error) {
    console.error("❌ Error generating adapter:", error);
    process.exit(1);
  }
}

generateServiceConnectionAdapter();
