const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://frostadmin:2sHVgLKrp2frost@frostcore.anbhe4r.mongodb.net/?retryWrites=true&w=majority&appName=FrostCore";

const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  } finally {
    await client.close();
  }
}

run();
