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
 * Retrieves all the games in the db
 */
exports.findAll = async () => {
    try {

        // call api
        const resFdGms = await axios.get(`${baseUrl}/games`);
        
        return resFdGms.data;
    
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
 * Retrieves top 5 games in terms of sales
 */
exports.gtTopGms = async () => {
    try {

        const resFdTopGms = await axios.get(`${baseUrl}/gameYrSales`);
        const top5Gms = resFdTopGms.data.slice(0, 5);

        let resTop5 = [];
        for (var g of top5Gms) {
            const resFdGmById = await axios.get(`${baseUrl}/game/id/${g.gameid}`);    
            await resTop5.push(resFdGmById.data);
        };
    
        return resTop5;

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
 * @param {object} q is an object that contains the search query specified by the client 
 */
exports.searchGms = async (q, limit = 6) => {
    try {
        let urlFdGms = `${baseUrl}/games`;
        const qParams = [];

        // req queries
        const reqFdGms = {
            search: (q.searchGame) ? q.searchGame : '',
            maxPrice: (q.price) ? q.price : '',
            syear: (q.dates) ? q.dates.split(' > ')[0] : '',
            eyear: (q.dates) ? q.dates.split(' > ')[1] : '',
            platform: (q.platform === 'All Platforms') ? '' : q.platform,
            categories: (q.categories) ? (Array.isArray(q.categories)) ? q.categories.join(',') : q.categories : '',
            page: (q.page) ? q.page : '',
            limit: (q.page) ? limit : ''
        };

        // conditional checking
        Object.keys(reqFdGms).forEach((key) => {
            if (reqFdGms[key]) {
                qParams.push(`${key.toString()}=${reqFdGms[key].toString()}`);
            };
        });
        urlFdGms += (qParams.length ? (`?${qParams.join('&')}`) : '');

        // call api
        const resFdGms = await axios.get(urlFdGms);
        
        return resFdGms.data;
    
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
 * @param {number} gid contains the id of the game to retrieve details from
 */
exports.fdGmById = async (gid) => {
    try {

        // call api
        const resFdGmById = await axios.get(`${baseUrl}/game/id/${gid}`);

        return resFdGmById.data;
    
    } catch (err) {
        console.log(err);
    };
};