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
    token: process.env.TOKEN_SECRET,
    port: process.env.PORT,
    host: process.env.HOST
};