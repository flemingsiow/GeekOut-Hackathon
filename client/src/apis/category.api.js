/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const axios = require('axios');
const { portServer, host } = require('../../config/env.config');
const baseUrl =  `${host}:${portServer}`;


/**
 * Retrieves all the categories in the db
 */
exports.findAll = async () => {
    try {

        // call api
        const resFdCts = await axios.get(`${baseUrl}/category`);
        
        return resFdCts.data;
    
    } catch (err) {
        // check if it's an axios error
        if (err.response) {
            console.log(err.response.data.Message);

        } else {
            // log error
            console.log(err);
        };
    };
};

