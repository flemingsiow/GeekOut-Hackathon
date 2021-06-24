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
 * 
 * @param {number} gid contains the id of the game to retrieve its overall review ratings from
 */
exports.gtRatings = async (gid) => {
    try {

        // call api
        const resGtRatings = await axios.get(`${baseUrl}/ratingstats?gid=${gid}`);

        return resGtRatings.data[0];
    
    } catch (err) {
        console.log(err);
    };
};


/**
 * 
 * @param {number} gid contains the id of the game to retrieve its reviews from
 */
exports.gtReviews = async (gid, page=null, limit=3) => {
    try {

        let resGtReviews;
        if (page !== null) {
            resGtReviews = await axios.get(`${baseUrl}/game/${gid}/review?page=${page}&limit=${limit}`);

        } else {
            resGtReviews = await axios.get(`${baseUrl}/game/${gid}/review`);
        };

        return resGtReviews.data;
    
    } catch (err) {
        console.log(err);
    };
};
