const { MongoClient } = require('mongodb');
const url = 'mongodb://0.0.0.0:27017';
const client = new MongoClient(url);

async function dbConnection() {

    const result = await client.connect();
    const db = result.db('CURD-app');
    return db.collection('contact-managment');
}

module.exports = dbConnection;
