/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { ExtendableError } = require('../utils/httpException.util');


/*
    error handling middleware for common errors
*/
const handleError = (err, req, res, next) => {

    // get error code(status) and condition
    let errCode = 500;
    let errCondition = 'Unknown error.'
    if (err instanceof ExtendableError) {
        errCode = err.getCode();
        errCondition = err.getCondition();

    } else if (err.code === 'LIMIT_FILE_SIZE') {
        errCode = 400;
        errCondition = 'Image not supported'
    }

    // console error
    console.error(err);

    // JSON to parse for Error
    let errJSON = {
        'Status': errCode,
        'Condition': errCondition,
        'Message': err.message,
        //'Stack': err.stack 
    };

    // send error response
    res.status(errCode).send(errJSON);
    return;

};


module.exports = handleError;