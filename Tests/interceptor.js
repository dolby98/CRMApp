/**
 * Logic to mock request and response objects
 */

module.exports = {

    mockRequest : () =>{
        const req = {}
        req.body = jest.fn().mockReturnValue(req);
        req.param = jest.fn().mockReturnValue(req);
        req.query = jest.fn().mockReturnValue(req);
        return req;
    },
    mockResponse : () =>{
        const res = {}
        res.send = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        
        return res;
    }
}