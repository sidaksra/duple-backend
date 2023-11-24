const { MongoClient } = require('mongodb');


const client = new MongoClient('mongodb+srv://sidaksra8:Sidak123@cluster0.ob8gkcm.mongodb.net/?retryWrites=true&w=majority');

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas: ", error);
    }
}

module.exports = connectDB;
