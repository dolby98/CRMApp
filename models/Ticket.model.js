const mongoose = require('mongoose');
const constants = require('../utils/constants');

let ticketSchema = new mongoose.Schema({
    
    title : {
        type : String,
        required : true
    },
    ticketPriority : {
        type : String,
        required : true,
        default : 4
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : constants.ticketStatus.Open,
        enum : [constants.ticketStatus.Open,constants.ticketStatus.Closed, constants.ticketStatus.Blocked]
    },
    reporter : {
        type : String,
        required : true,
    },
    assignee : {
        type : String
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
    }
});

module.exports = mongoose.model("ticket", ticketSchema);