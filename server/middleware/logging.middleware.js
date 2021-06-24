/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/*
    logs each incoming request to the console
*/
const logToConsole = async (req, res, next) => {
    try {
        console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
        next(); // calls the next middleware

    } catch(err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


module.exports = logToConsole;