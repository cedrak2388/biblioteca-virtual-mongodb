const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

let db;

async function conectarBanco() {
    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log("MongoDB conectado");
}

function getDb() {
    return db;
}

module.exports = {
    conectarBanco,
    getDb
};