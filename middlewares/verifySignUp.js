/**
 * logic to validate incoming request body
 */

User = require('../models/user.model');
const constants = require('../utils/constants');

validateSignUpRequestBody = async (req,res,next)=>{

    //Validate name is present
    if(!req.body.name){
        return res.status(400).send({
            message : "Failed! User name is not provided"
        });
    }
    //Validate userId present
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed! User Id is not provided"
        });
    }
    try{
        const user = await User.findOne({userId : req.body.userId});
        if(user){
            return res.status(400).send({
                message : "Failed! User Id already exists"
            });
        }
    }
    catch(err){
        console.log(err, "Error in signup catch");
        return res.status(500).send({
            message : "Some internal server error occured"
        });
    }
    
    //Validate email present
    if(!req.body.email){
        return res.status(400).send({
            message : "Failed! Email Id is not provided"
        });
    }

    //validate password present
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed! password is not provided"
        });
    }

    //validate userType value
    if(req.body.userType && req.body.userType=="ADMIN"){
        return res.status(400).send({
            message : "ADMIN registraton not allowed"
        });
    }

    const userTypes = [constants.userTypes.Customer,constants.userTypes.Engineer];

    if(req.body.userType && !userTypes.includes(req.body.userType)){
        return res.status(400).send({
            message : "Invalid user type provided"
        });
    }

    next();
}

validateSignInReqBody = async(req,res,next) =>{

    //Validate userId present
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed! User Id is not provided"
        });
    }
    try{
        const user = await User.findOne({userId : req.body.userId});
        if(!user){
            return res.status(404).send({
                message : "Failed! User Id does not exist"
            });
        }
    }
    catch(err){
        console.log(err, "Error in signup catch");
        return res.status(500).send({
            message : "Some internal server error occured"
        });
    }
    //validate password present
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed! password is not provided"
        });
    }

    next();
}

module.exports = {validateSignUpRequestBody, validateSignInReqBody}