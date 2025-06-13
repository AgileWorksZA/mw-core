import { buildDocumentPath } from "./packages/core/src/rest/auth";
import { readFileSync } from "fs";

// Load config
const configPath = "./mw-config.json";
const config = JSON.parse(readFileSync(configPath, "utf-8"));

const protocol = config.protocol || "http";
const docPath = buildDocumentPath(config);

// What the REST client should be building
console.log("=== URL Components ===");
console.log("Base:", `${protocol}://${config.host}:${config.port}/REST`);
console.log("Doc path:", docPath);

const exportPath = "/export/table=Transaction&search=" + encodeURIComponent("TransDate >= '2024-01-01' and Amount > 1000") + "&limit=1&format=xml-verbose";
console.log("Export path:", exportPath);

const fullUrl = `${protocol}://${config.host}:${config.port}/REST/${docPath}${exportPath}`;
console.log("\nFull URL should be:");
console.log(fullUrl);