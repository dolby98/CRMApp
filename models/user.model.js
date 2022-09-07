const mongoose = require('mongoose');
const constants = require('../utils/constants');
// mongoose.set('setDefaultsOnInsert', true);

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=>{
            return Date.now()
        }
    },
    updatedAt : {
        type : Date,
        default : ()=>{
            return Date.now()
        }
    },
    ticketsCreated : {
        type : [mongoose.SchemaType.ObjectId],
        ref : "ticket"
    },
    // ticketsCreatedCount : {
    //     type : Number,
    //     default : 0
    // },
    ticketsAssignedCount : {
        type : Number,
        default : 0,
        index : true
    },
    ticketsAssigned : {
        type : [mongoose.SchemaType.ObjectId],
        ref : "ticket"
    },
    userType : {
        type : String,
        required : true,
        default: constants.userTypes.Customer,
        enum : [constants.userTypes.Admin,constants.userTypes.Customer,constants.userTypes.Engineer]
    },
    userStatus : {
        type : String,
        required : true,
        default: constants.userStatus.Approved,
        enum : [constants.userStatus.Approved,constants.userStatus.Pending,constants.userStatus.Rejected]
    }
});

module.exports = mongoose.model("user", userSchema);

