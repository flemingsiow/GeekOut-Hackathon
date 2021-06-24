/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { validationResult } = require('express-validator');
const { BadRequest } = require('../../utils/httpException.util');


/*
    check if any errors occurred during validation
*/
exports.validateSchema = async (req, res, next) => {
    try {
        const err = validationResult(req);
        if (!err.isEmpty()) {
            throw new BadRequest(err.errors[0].msg);
        };

        next();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    }
};