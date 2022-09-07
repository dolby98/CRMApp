const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const constants = require('../utils/constants');


checkTicketValidity = async(req,res,next)=>{

    if(!req.body.title || !req.body.description){
        return res.status(400).send({
            message : "Fields Title and Description cannot be empty"
        });
    }

    engineers = await User.findOne({userType:constants.userTypes.Engineer});

    if(!engineers){
        return res.status(400).send({
            message : "Please try again later. No engineer available to assign ticket in system"
        });
    }

    next();
     
}

isAdminOrCustomerOrEngineer = async(req,res,next)=>{

    const ticketId = req.params.ticket_id;

    try{
        const user = await User.findOne({userId : req.userId});
        const ticket = await Ticket.findOne({_id : ticketId});
        if(!ticket){
            return res.status(400).send({
                message : "Ticket does not exist"
            });
        }

        //Checking if engineer is getting changed
        const isAssigneeChanged = false;

        if(req.body.assignee){
            const assigneeUser = await User.findOne({userId : req.body.assignee});
            if(!assigneeUser){
                return res.status(400).send({
                    message : "Assignee engineer does not exist in the system"
                });
            }
            if(req.body.assignee!=assigneeUser.userId){
                isAssigneeChanged = true;
            }
        }

        if(user.userType==constants.userTypes.Admin){            
            next();
        }
        else if((ticket.reporter==req.userId || ticket.assignee==req.userId) && !isAssigneeChanged){
            next();
        }
        else{
            return res.status(403).send({
                message : "You are not allowed to update the ticket"
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "PIntenral server error"
        });
    }
}

module.exports = { checkTicketValidity, isAdminOrCustomerOrEngineer }