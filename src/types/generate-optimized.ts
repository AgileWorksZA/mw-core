import fs from "node:fs";

// list of all json files in the schemas folder
const files = fs
  .readdirSync("./json-schema")
  .filter((file) => file.endsWith(".json"));

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(`./${file}`, "utf-8"));
  const dataTypes: Record<
    string,
    "string" | "number" | "boolean" | "integer" | "date" | "date-time"
  > = {};
  for (const key of Object.keys(data.properties)) {
    if (data.properties[key].type === "string") {
      if (data.properties[key].format === "date") {
        dataTypes[key] = "date";
      } else if (data.properties[key].format === "date-time") {
        dataTypes[key] = "date-time";
      } else {
        dataTypes[key] = "string";
      }
    } else if (data.properties[key].type === "integer") {
      dataTypes[key] = "integer";
    } else if (data.properties[key].type === "boolean") {
      dataTypes[key] = "boolean";
    } else if (data.properties[key].type === "number") {
      dataTypes[key] = "number";
    } else {
      console.error("Unknown type", key, data.properties[key].type);
    }
  }
  fs.writeFileSync(
    `./optimized/${file.replace(".json", ".ts")}`,
    `export default ${JSON.stringify(dataTypes, null, 2)};\n`,
  );
}
