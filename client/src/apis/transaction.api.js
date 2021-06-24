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
 * Get latest transaction made under userid
 */
exports.gtLtTsByUid = async (uid, token) => {
    try {

        // config
        const config = {
            headers: { "Authorization": `Bearer ${token}` }
        };

        // call api
        const resFdTsByUid = await axios.get(`${baseUrl}/transaction/user/${uid}`, config);
        
        return resFdTsByUid.data;
    
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


/**
 * Retrieves all purchases under a transactionid
 */
exports.gtPcsByTid = async (uid, tid, token) => {
    try {

        // config
        const config = {
            headers: { "Authorization": `Bearer ${token}` }
        };

        // call api
        const resFdPcsByTid = await axios.get(`${baseUrl}/purchase/user/${uid}/transaction/${tid}`, config);
        
        return resFdPcsByTid.data;
    
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