const express = require("express");
// const { Client } = require("@elastic/elasticsearch");
const { Client } = require("@elastic/enterprise-search");

const app = express();
const PORT = process.env.PORT || 3000;

const ENGINE_NAME = "dyte-logs";

app.use(express.static("./build"));
const path = require("path");
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.json());

//configure your client
const client = new Client({
  url: "https://dyte-log-ingestor-assessment.ent.asia-south1.gcp.elastic-cloud.com",
  auth: {
    username: "elastic",
    password: "cQdAeRsmEXOSYoWYaDvnNNOs",
  },
});

async function ListDocuments() {
  const documentsList = await client.app.listDocuments({
    engine_name: "dyte-logs",
  });
  console.log(documentsList);
}

async function ListEngine() {
  const enginesList = await client.app.listEngines();
  if (enginesList.error) {
    console.log(enginesList.error);
  }
  console.log("Engine List : ", enginesList); //show name of engine
}

const logs = []; // In-memory storage for logs

// Function to convert keys to lowercase
function convertKeysToLowerCase(obj) {
  const newObject = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObject[key.toLowerCase()] = obj[key];
    }
  }
  return newObject;
}

async function SingleSearchQuery() {
  const searchResponse = await client.app.search({
    engine_name: ENGINE_NAME,
    body: { query: "error" },
  });
  if (searchResponse.errors) {
    console.log(searchResponse[0].toString());
    process.exit(1);
  }
  console.log(searchResponse);
}

// Log Ingestor route
app.post("/", async (req, res) => {
  const body = req.body;
  // Convert keys to lowercase
  const lowercaseJson = convertKeysToLowerCase(body);

  //   lowercase_json_data = {key.lower(): value for key, value in body.items()}

  //   console.log(lowercaseJson);

  try {
    // add document to Elasticsearch
    await client.app
      .indexDocuments({
        engine_name: ENGINE_NAME,
        documents: lowercaseJson,
      })
      .then((result) => {
        // console.log("Document indexed successfully", result);
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(result);

    res.status(201).json({ message: "Log ingested successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  //   res.status(201).json({ message: "Log ingested successfully" });
});

app.get("/", async (req, res) => {
  //send query result

  res.send("Hello World");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  //   ListEngine().catch(console.error);
  //   console.info("List of Logs Document");
  //   ListDocuments().catch(console.error);
  SingleSearchQuery().catch(console.error);
});

// async function run () {
//     const listSources = await client
//     .workplace
//     .listContentSources()
//     if (listSources.errors) {
//         console.log(listSources)
//         process.exit(1)
//       }
//     console.log(listSources)}

//   run().catch(console.log)
