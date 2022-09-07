const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const secretConfig = require('../configs/auth.config');
// Registeration of users:

// Users:
//     Customer :
//         1. Registers and is approved by default
//         2.Login immediately

//     ENginneer:
//         1.Should be able to register
//         2. Registers and is in prnding state
//         3.ADMIN should be able to approve this

//     Admin:
//         1.ADMIN to be created at backend in db already

/**
 * Logic to accept registration and signup
 */

exports.signup = async(req,res)=>{

    if(req.body.userType && req.body.userType!=constants.userTypes.Customer){
        req.body.userStatus = constants.userStatus.Pending;
    }
    
    try{
        const userObj = {
            name : req.body.name,
            userId : req.body.userId,
            email : req.body.email,
            userType : req.body.userType,
            password : bcrypt.hashSync(req.body.password,10),
            userStatus : req.body.userStatus
        }

        
    
        const isUserCreated = await User.create(userObj,);
        const response = {
            name : isUserCreated.name,
            userId : isUserCreated.userId,
            email : isUserCreated.email,
            userType : isUserCreated.userType,
            userStatus : isUserCreated.userStatus,
            createdAt : isUserCreated.createdAt,
            updatedAt : isUserCreated.updatedAt
        }

        res.status(201).send(response);
    }
    catch(err){
        console.log("Some error occured : ", err.message);
        res.status(500).send({
            message : "Some internal server error"
        });
    }

}

exports.signin = async (req,res)=>{

    /**
     * if userid is correct
     */
    try{
        const user = await User.findOne({userId: req.body.userId});
        console.log(user);
        if(!user){
            return res.status(404).send({message:"User not found"});
        }

        if(user.userStatus==constants.userStatus.Pending){
            return res.status(400).send({
                message : "User not yet approved from admin"
            });
        }

        /**
         * if password is correct
         */
        const passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
        if(!passwordIsValid){
            return res.status(401).send({message:"Invalid Password"});
        }
        /**
         * create jwt token
         */
        const token = jwt.sign({
            id : user.userId
        },secretConfig.secretKey,
        {expiresIn : 6000});

        /**
         * send successfull login response
         */

        return res.status(200).send({
            access_token : token,
            expiresIn : 6000
        });
    }

    catch(err){
        return res.status(500).send({message : "Some error occurred while signing in"});
    }
    

}