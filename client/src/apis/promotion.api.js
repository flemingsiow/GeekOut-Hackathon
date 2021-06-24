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
 * Retrieves all promotions in the db
 */
exports.findAll = async (page=null, limit=3, expire='no') => {
    try {

        let url = `${baseUrl}/promotions?`;

        if (page !== null) {
            url += `page=${page}&limit=${limit}&`;
        };
        if (expire === 'yes') {
            url += `expire=yes&`;
        };
        
        const resFdPms = await axios.get(url);
        
        return resFdPms.data;
    
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
 * Retrieves all active promotions in the db
 */
exports.findAllAc = async () => {
    try {

        // call api
        const resFdAcPms = await axios.get(`${baseUrl}/promotions/active`);
        
        return resFdAcPms.data;
    
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
 * 
 * @param {number} gid contains the id of the game for the promotion
 */
exports.fdPmByGid = async (gid) => {
    try {

        // call api
        const resFdPmByGid = await axios.get(`${baseUrl}/promotions/game/${gid}`);

        return resFdPmByGid.data;
    
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