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
 * Retrieves all platforms listed in the db
 */
exports.findAll = async () => {
    try {

        // call api
        const resFdPfs = await axios.get(`${baseUrl}/platforms`);
        
        return resFdPfs.data;
    
    } catch (err) {

        if (err.response) {
            console.log(err.response.data.Message);
        };
        console.log(err);
    };
};


