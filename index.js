const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const serverConfigs = require('./configs/server.config');
const bodyParser = require("body-parser");
const User = require("./models/user.model");
const mongo = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(serverConfigs.PORT, ()=>{
    console.log("Server start on port 8777");
});

async function init(){

    try{
        let user = await User.findOne({userId:"admin"}).clone();
        
        if(user){

                console.log("Admin present");
                return;
        }

        user = await User.create({
    
            name : "Admin",
            userId : "admin",
            email : "dolbyaaa14@gmail.com",
            userType : "ADMIN",
            password : bcrypt.hashSync("Welcome",10)
        });

        return;
    }
    
    catch(err){
        console.log("Err in db initialization",err.message);
        return;
    }
}


mongo.connect("mongodb+srv://admin:admin@cluster0.ytx7eni.mongodb.net/CRM_DB", ()=>{
    console.log("Connected to MongoDB Atlas");
    init();
},
    err=>{
        console.log(err);
    }
);
console.log("hello");



require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);