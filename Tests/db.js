/**
 * Initiate connection with mongodb memory server
 */

const mongoose = require("mongoose");

const {MongoMemoryServer} = require("mongodb-memory-server");

let mongod;

/**
 * COnnecting to DB
 */
module.exports.connect = async()=>{
    if(!mongod){
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const mongooseOpts = {
            unseUnifiedTopology : true,
            valueOfmaxPoolSize : 10
        }
        mongoose.connect(uri, mongooseOpts);
    }
}

/**
 * Disconnect DB and close all connection
 */
module.exports.closeDatabase = async() =>{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    if(mongod){
        await mongod.stop();
    }
}

/**
 * Clear db and remove all records after testing is complete
 */
module.exports.clearDatabase = ()=>{
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        collection.deleteMany(); //delete all documents from this collection
    }
}