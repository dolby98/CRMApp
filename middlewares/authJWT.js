const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const constants = require('../utils/constants');
const User = require('../models/user.model');

const isUserAdmin = async (req,res,next) =>{
    console.log(req.userId);
    const user = await User.findOne({userType:constants.userTypes.Admin});
    console.log(user);
    if(user.userId!=req.userId){
        return res.status(500).send({
            message : "Insufficent rights. Only Admin can perform this operation"
        });
    }

    next();
}

const isValidUserIdInReqParams = async(req,res,next) =>{
    
    try{
        const user = await User.findOne({userId : req.params.userId});
        if(!user){
            return res.status(404).send({
                message : "User not found"
            });
        }
        
        next();
    }
    catch(err){
        return res.status(500).send({
            message : "Internal Server error"
        });
    }

}

const isAdminOrOwner = async(req,res,next) =>{

    try{
        const currentUser = await User.findOne({userId: req.userId});
        console.log("I am here");
        console.log(currentUser);
        if(currentUser.userType==constants.userTypes.Admin || req.userId==req.params.userId){
            console.log("Ikde");
            next();
        }
        else{
            return res.status(403).send({
                message : "Insufficent permission to view user details"
            });
        }
    }
    catch(err){
        return res.status(500).send({
            message : "Internal Server error"
        });
    }    

}

const verifyToken = (req,res,next) =>{

    let token = req.headers["authorization"];

    //Validate token is present
    if(!token){
        return res.status(403).send({
            message : "Failed! Access token is not provided"
        });
    }
    
    try{
        jwt.verify(token,authConfig.secretKey, (err, decoded)=>{
            if(err){
                console.log(err);
                return res.status(401).send({
                    message : "Unauthorized"
                });
            }
    
            req.userId = decoded.id;

            next();
        });
        
    }
    catch(err){
        return res.status(500).send({
            message : "Internal server error"
        });
    }
    
}

module.exports = {verifyToken, isUserAdmin, isAdminOrOwner, isValidUserIdInReqParams}