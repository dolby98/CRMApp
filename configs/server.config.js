console.log(process.env.ENVIRONEMT);
if(process.env.ENVIRONEMT!='prod'){
    require('dotenv').config();
}
console.log(process.env.PORT);
module.exports = {
    PORT : process.env.PORT
}