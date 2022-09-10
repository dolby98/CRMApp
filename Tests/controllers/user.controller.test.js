/**
 * File has tests for user controller methods
 */





const { findAll, updateUser } = require("../../controllers/user.controller");

const User = require('../../models/user.model');
const { mockRequest, mockResponse } = require('../interceptor');

const userTestPayload = {
    name: "Test",
    userId : "Test01",
    email : "test@gmail.com",
    userType : "CUSTOMER",
    userStatus : "APPROVED",
    ticketsCreated : [],
    ticketsAssigned : [],
    ticketsAssignedCount : 0
}


/**
 * findAll() method
 * 
 * -happy path
 * -test based on query param
 * -negative scenario
 * 
 */
describe("test findAll method", ()=>{

    it("Test scenario when no query param is passed", async()=>{
        
        //Mock user.find method
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]));

        //Mock req and res
        const req = mockRequest();
        const res = mockResponse();
  
        req.query = {}; //We need to provide mock implementation

        /**
         * Actual explaination
         */

        await findAll(req,res);

        /**
         * Assertions
         */

        //Verify userSpy was called in execution

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "Test"
                })
            ])
        );
    })

    it("Test scenario when user status is passed in query param", async()=>{
        //Mock user.find method
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]));

        //Mock req and res
        const req = mockRequest();
        const res = mockResponse();

        req.query = {userStatus : "APPROVED"};

        await findAll(req,res);

        /**
         * Assertions
         */

        //Verify userSpy was called in execution

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userStatus : "APPROVED"
                })
            ])
        );
    })

    it("Test scenario when user type is passed in query param", async()=>{
        //Mock user.find method
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]));

        //Mock req and res
        const req = mockRequest();
        const res = mockResponse();

        req.query = {userType : "CUSTOMER"};

        await findAll(req,res);

        /**
         * Assertions
         */

        //Verify userSpy was called in execution

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userType : "CUSTOMER"
                })
            ])
        );
    })

    /**
     * Testing a negative test case
     */

    it("Error while calling User.find method ", async()=>{

        //mock error scenario
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.reject(new Error("error")));

        const req = mockRequest();
        const res = mockResponse();

        req.query = {userStatus : "APPROVED"};

        await findAll(req,res);

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message : "Some internal server error occcured"
        });
    })
});


/**
 * updateUser() method
 * 
 * -happy path with query param
 * -negative scenario
 * 
 */

const userUpdateRes = {
    name: "Test",
    userStatus : "APPROVED",
    userType : "ENGINEER"
}

const userUpdateReq = {
    name: "Test",
    userStatus : "PENDING",
    userType : "ENGINEER",
    save : ()=>{
        return userUpdateReq;
    }
}


describe("Test cases for updateUser controller", ()=>{

    it("Scenario when userId is passed in params", async()=>{
        
        
        const userfindOne = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(userUpdateReq));
        
        const req = mockRequest();
        const res = mockResponse();

        req.params = {userId : "dolby"};

        req.body = {userStatus : "APPROVED"};

        await updateUser(req,res);

        expect(userfindOne).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userStatus : "APPROVED"
                })
            ])
        );
    })

    it("Negative Scenario for updateUser", async()=>{
        
        
        const userfindOne = jest.spyOn(User, 'findOne').mockReturnValue(Promise.reject(new Error("error")));
        
        const req = mockRequest();
        const res = mockResponse();

        req.params = {userId : "dolby"};

        req.body = {userStatus : "APPROVED"};

        await updateUser(req,res);

        expect(userfindOne).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message : "Some internal server error occcured while updating user details"
        });
    })
})