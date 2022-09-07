const { createTicket, getAllTickets, updateTicket } = require("../controllers/ticket.controller");
const { authJWT, ticktValidation } = require("../middlewares");


module.exports = (app) =>{

    app.get("/crm/api/v1/tickets",[authJWT.verifyToken], getAllTickets);
    app.post("/crm/api/v1/ticket",[authJWT.verifyToken, ticktValidation.checkTicketValidity], createTicket);
    app.put("/crm/api/v1/ticket/:ticket_id",[authJWT.verifyToken, ticktValidation.isAdminOrCustomerOrEngineer], updateTicket);
    
}