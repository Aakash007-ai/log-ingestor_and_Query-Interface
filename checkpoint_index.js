const express = require("express");
// const { Client } = require("@elastic/elasticsearch");
const { Client } = require("@elastic/enterprise-search");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//configure your client
const client = new Client({
  url: "https://d84b2890a1d7f30699b04c7b1d6930f8.ent-search.europe-west1.gcp.cloud.es.io",
  auth: {
    token: "my-token",
  },
});

// const elasticClient = new Client({
//   cloud: {
//     id: "dyte_log_ingestor_assessment:YXNpYS1zb3V0aDEuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJGFkNjYxZjRiMmY0YzQ5ZjFhMjFjYThmYzgwYjM4NmEzJDU4YWRmY2U5ZGM3YzQ0NjBhNjk4NTYyNTg0MzU4M2My",
//   },
//   node: "https://ad661f4b2f4c49f1a21ca8fc80b386a3.asia-south1.gcp.elastic-cloud.com:443",
//   auth: {
//     apiKey: "WUZwbTVvc0JIVEZkRUZxWnNXZlc6eTBvcVRqRjFTamlTRjM4ZktLUHY5QQ==",
//   },
// });

const logs = []; // In-memory storage for logs

// Log Ingestor route
app.post("/", async (req, res) => {
  const body = req.body;
  console.log(body);

  //   logs.push(body);
  //   //index logs to ElasticSearch
  //   try {
  //     res.status(201).json({ message: "Log ingested successfully" });
  //   } catch (error) {
  //     console.error(`Error indexing log in Elasticsearch: ${error}`);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  res.status(201).json({ message: "Log ingested successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
