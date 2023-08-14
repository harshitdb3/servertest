

require("dotenv").config();
const PORT = process.env.PORT;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
const data = require("./jsondata.json");
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,

  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("test").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const collection = client.db("test").collection("data");
    // Drop the collection if it exists
    await collection.drop().catch(() => {});
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted into the collection`);
  } finally {
 
  }
}
run().catch(console.dir);

 
// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://chart-graph-9ftr.vercel.app/"
  ],                                                         
  credentials: true,                                                 
}));
app.get("/", (req, resp) => {
 
    resp.send("App is Working");
});
 
app.get("/getdata", async (req, res) => {
    try {

        //get data collection from mongodb
        const collection = client.db("test").collection("data");
        const result = await collection.find({}).toArray();
        
        //send data to frontend
        res.send(result);
        
    } catch (e) {
        console.log(e);
        res.send("Something Went Wrong");
    }
});
app.listen(PORT);