const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');
const constant = require('../utils/constants');

const sendEmailNotification = require('../utils/notification');

//After ticket is created, send an email to all stakeholders.
exports.createTicket = async(req,res) =>{

    try{
        /**
         * Read from request body and create ticket
         */
        let customer;
        const ticketObj = {
            title : req.body.title,
            ticketPriority : req.body.ticketPriority,
            description : req.body.description,
            status : req.body.status,
            reporter : req.userId,
        }

        /**
         * Find engg and assign ticket
         */
        //Try extending code by getting engineer with least tickets
        const engineer = await User.findOne({userType:constant.userTypes.Engineer, userStatus: constant.userStatus.Approved}).sort({ticketsAssignedCount:1});

        if(engineer){
            ticketObj.assignee = engineer.userId;
            engineer.ticketsAssignedCount+=1;
        }
        /**
         * insert ticket, insert ticket id in customer and engg docs
         */
        const ticketCreated = await Ticket.create(ticketObj);
        
        if(ticketCreated){
            //Update Customer doc
            customer = await User.findOne({userId : req.userId});
            
        }

        customer.ticketsCreated.push(ticketCreated._id);
        await customer.save();

        //Update Engineer doc
        engineer.ticketsAssigned.push(ticketCreated._id);
        await engineer.save();

        //Sending email notification
        const emailResp = sendEmailNotification(
            `Ticket created with id : ${ticketCreated._id}`, 
            `Ticket description : ${ticketCreated.description}`,
            `${customer.email}, ${engineer.email}, "dolbya14@gmail.com"`,
            "CRM APP");
        console.log(emailResp);
        res.status(201).send(ticketCreated);
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured"
        });
    }

}

exports.getAllTickets = async(req,res)=>{

    /**
     * Find userType and depending on it we need to frame our search query
     */
    try{
        console.log(req.userId);
        const user = await User.findOne({userId : req.userId});
        console.log(user);
        let queryObj = [];
        let tickets = {};
        ticketsCreated = user.ticketsCreated;
        ticketsAssigned = user.ticketsAssigned;

        if(user.userType==constant.userTypes.Customer){
            /**
             * Fetching all tickets created by user
             */
            queryObj = ticketCreated;
            if(!queryObj){
                return res.status(200).send({
                    message : "No tickets created by user yet"
                });
            }
        }
        else if(user.userType==constant.userTypes.Engineer){
            /**
             * Fetching all tickets assigned to engineer
             */
            
            queryObj = ticketsCreated.concat(ticketsAssigned);
 
            if(!queryObj){
                return res.status(200).send({
                    message : "No tickets for engineer"
                });
            }
        }

        if(queryObj){
            tickets = await Ticket.find({_id : {$in : queryObj}});
        }
        else if(user.userType==constant.userTypes.Admin){
            /**
             * Fetching all tickets
             */
            tickets = await Ticket.find({});
        }

        return res.status(200).send(tickets);

    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured while fetching tickets"
        });
    }
}

exports.updateTicket = async(req,res)=>{

    try{
        const ticket = await Ticket.findOne({_id:req.params.ticket_id});

        ticket.title = req.body.title ? req.body.title : ticket.title;
        ticket.ticketPriority = req.body.ticketPriority ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.description = req.body.description ? req.body.description : ticket.description;
        ticket.status = req.body.status ? req.body.status : ticket.status;
        ticket.assignee = req.body.assignee ? req.body.assignee : ticket.assignee;
        

        const updatedTicket = await ticket.save();

        return res.status(200).send(updatedTicket);
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Some internal server error occcured while updating ticket"
        });
    }

    


}