import { MoneyWorksRESTClient } from "./packages/core/src/rest/client";

const client = new MoneyWorksRESTClient({
  host: "localhost",
  port: 6710,
  dataFile: "acme.moneyworks",
  username: "Herman Geldenhuys",
  password: ""
});

client.export("Transaction", { limit: 1, format: "json" })
  .then(result => {
    console.log("Success!");
    console.log("Is array:", Array.isArray(result));
    if (Array.isArray(result)) {
      console.log("Length:", result.length);
    }
  })
  .catch(err => {
    console.error("Error:", err.message);
  });