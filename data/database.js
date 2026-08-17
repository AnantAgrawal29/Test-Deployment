const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let database;
const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";

async function initDatabase() {
  if (database) {
    return database;
  }
  const client = new MongoClient(
    "mongodb+srv://default:Anant2911@cluster0.onvfyiw.mongodb.net/?appName=Cluster0",
  );
  await client.connect();
  database = client.db("deployment");
  console.log("MongoDB connected");
  return database;
}

function getDb() {
  if (!database) throw new Error("No database connected!");
  return database;
}

module.exports = {
  initDatabase,
  getDb,
};
