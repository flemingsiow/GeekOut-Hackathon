/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const jwt = require('jsonwebtoken');    // secures information transfer (with JSON)

const { Unauthorised } = require('../utils/httpException.util');
const { token } = require('../config/env.config');


/*
    ensures that the user is logged in and has rights to edit ONLY their information
*/
exports.isLoggedIn = (req, res, next) => {
    try {
        // check for empty authorisation access token (401 Error)
        const isToken = req.headers['authorization'];
        if (!isToken) {
            throw new Unauthorised('Please key in your Access Token!');
        };

        // retrieve keyed in token
        const userToken = isToken.split(' ')[1]; // Bearer: aHhfd7idh8dhjGDpIW8...

        // verify user
        const verifyUser = jwt.verify(userToken, token);

        if (req.params.id && req.params.uid) {
            if (parseInt(req.params.id) === verifyUser.userid || parseInt(req.params.uid) === verifyUser.userid) {
                if (req.body.type === undefined || verifyUser.type === 'Admin') {
                    req.userData = verifyUser;

                } else {
                    throw new Unauthorised("Customers are not allowed to edit their own type!");
                };

            } else {
                throw new Unauthorised("You are not authorised to insert/edit on other's behalf!");
            };
        };
        req.userData = verifyUser;

        next(); // directs user to intended route if authorised

    } catch (err) {
        next(err, req, res); // if unauthroised or err, call error handling middleware
        return;
    };
};


/*
    only allows those with admin privilleges to access
*/
exports.isAdmin = (req, res, next) => {
    try {
        // verify if admin
        if (req.userData.type === 'Customer') {
            throw new Unauthorised('You need administrator privilleges to access this!');
        };

        next(); // directs admin to intended route

    } catch (err) {
        next(err, req, res); // if not admin or err, call error handling middleware
        return;
    };
};