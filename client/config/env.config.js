/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const dotenv = require('dotenv');
dotenv.config(); // reads from .env file

/* env config */
module.exports = {
    port: process.env.PORT,
    portServer: process.env.PORT_SERVER,
    host: process.env.HOST,
    api: process.env.API_KEY,
    domain: process.env.DOMAIN,
    token: process.env.TOKEN_SECRET
};