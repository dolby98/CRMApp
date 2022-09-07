const { findAll, findByUserId, updateUser } = require("../controllers/user.controller");
const { authJWT } = require("../middlewares");
// const middleware = require("../middlewares");

module.exports = (app) => {

    app.get("/crm/api/v1/allUsers",[authJWT.verifyToken, authJWT.isUserAdmin],findAll);
    app.get("/crm/api/v1/users/:userId", [authJWT.verifyToken, authJWT.isValidUserIdInReqParams, authJWT.isAdminOrOwner], findByUserId);
    app.put("/crm/api/v1/users/:userId",  [authJWT.verifyToken, authJWT.isValidUserIdInReqParams, authJWT.isAdminOrOwner], updateUser);

}