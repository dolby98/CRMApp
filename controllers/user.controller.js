/**
 * Controller for user resources
 */

const User = require('../models/user.model');
const objconvert = require('../utils/objectConvertor');

exports.findAll = async(req,res)=>{

    const queryObj = {};
    
    const userTypeQP = req.query.userType;
    const userStatus = req.query.userStatus;

    if(userTypeQP){
        queryObj.userType = userTypeQP;
    }

    if(userStatus){
        queryObj.userStatus = userStatus;
    }

    try{
        users = await User.find(queryObj);

        if(!users){
            return res.status(404).send({
                message : "No users found"
            });
        }

        return res.status(200).send(objconvert.userResponse(users));
    }

    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured"
        });

    }
    
}

exports.findByUserId = async(req,res) =>{

    try{
        console.log("have I reached here?");
        const user = [await User.findOne({userId : req.params.userId})];

        if(!user){
            return res.status(404).send({
                message : "User not found"
            });
        }

        return res.status(200).send(objconvert.userResponse(user));
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured"
        });

    }
    
}

exports.updateUser = async (req,res)=>{

    try{
        const user = await User.findOne({userId : req.params.userId});
        console.log(user);
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus;
        user.name = req.body.name ? req.body.name : user.name;
        user.userType = req.body.userType ? req.body.userType : user.userType;

        const updatedUser = [await user.save()];

        return res.status(200).send(objconvert.userResponse(updatedUser));

    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured while updating user details"
        });

    }
}