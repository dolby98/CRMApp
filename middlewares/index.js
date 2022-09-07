const verifySignUp = require('./verifySignUp');
const authJWT = require('./authJWT');
const ticktValidation= require('./ticketValidation');

console.log(verifySignUp, "verifuy");

module.exports = {verifySignUp, authJWT, ticktValidation};