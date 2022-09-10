/**
 * Logic for integration testing of user routes test
 */


/**
 * Integration testing for all users endpoint
 */

const db = require("../db");
const jwt = require("jsonwebtoken");
const config = require('../../configs/auth.config');
const request = require("supertest");
const app = require("../../index");
const User = require("../../models/user.model");


//This will be used to do initial setup for test db
let token;
beforeAll( async()=>{

    // Inser data inside test DB
    await db.clearDatabase();

    await User.create({
        name : "Dolby",
        userId : "dolby14",
        email : "dolby14agarwal@gmail.com",
        userType : "ADMIN",
        password : "Welcome",
        userStatus : "APPROVED"
    });

    //Generating token to send Auth request
    token = jwt.sign(
        {id : "dolby14"},
        config.secretKey,
        {expiresIn : 6000});
})

//Cleanup of test db after all done

afterAll( async()=>{
    await db.closeDatabase();
})

describe("Find all users", ()=>{

    it("Find all the users", async()=>{

        /**
         * 1. Need to have some data in test DB. Done in beforeall
         * 2. Generate token using same logic and use for tests
         */

        //need to invoke API - we will use supertest
        const res = await request(app).get("/crm/api/v1/allUsers").set("authorization", token);

        //Code for validation

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "name" : "Dolby",
                    "userId" : "dolby14",
                    "email" : "dolby14agarwal@gmail.com",
                    "userType" : "ADMIN",
                    "userStatus" : "APPROVED"
                })
            ])
        );
    })
})

describe("Find users by userid", ()=>{

    it("Find user by user id : endpoint->/crm/api/v1/users/:userId ", async()=>{

        /**
         * 1. Need to have some data in test DB. Done in beforeall
         * 2. Generate token using same logic and use for tests
         */

        //need to invoke API - we will use supertest
        const res = await request(app).get("/crm/api/v1/users/dolby14").set("authorization", token);

        //Code for validation
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "name" : "Dolby",
                    "userId" : "dolby14",
                    "email" : "dolby14agarwal@gmail.com",
                    "userType" : "ADMIN",
                    "userStatus" : "APPROVED"
                })
            ])
        );
    })
})