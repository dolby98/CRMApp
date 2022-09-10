if(process.env.ENVIRONEMT!='prod'){
    require('dotenv').config();
}

module.exports = {
    secretKey : process.env.SECRETKEY
}