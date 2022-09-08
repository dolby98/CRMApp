/**
 * This contains logic to send and connect to Notifications ervice App
 */


const Client = require('node-rest-client').Client;

const client = new Client(); //Client objec for calling rest apis
const serverConfig = require('../configs/server.config');


//Exposing a method which takes parameters to send a notification request to notification service

module.exports = async(subject, content, reciepients, requestor)=>{

    //Create request body
    const requestBody = {
        subject : subject,
        reciepientEmails : reciepients,
        content : content,
        requestor : requestor
    }

    //Prepare headers
    const requestHeader = {
        "Content-Type" : "application/json"
    }

    //Combine headers and payload
    const args = {
        data : requestBody,
        headers : requestHeader
    }
    
    //Make POST call and handle the request
    try{
        
        const notify = await client.post(serverConfig.NServiceApi, args,(data, res)=>{

            console.log("Request sent to notification service");
        });

    }
    catch(err){
        
        console.log(err.message);

    }
    return;

}