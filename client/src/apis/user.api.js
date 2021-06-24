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
 * @param {number} month contains the month of the statistics you wish to retrieve
 * @param {number} year contains the year of the statistics you wish to retrieve
 */
exports.gtUsrSUStats = async (month, year, token) => {
    try {

        // config
        const config = {
            headers: { "Authorization": `Bearer ${token}` }
        };

        // call api
        const resGtUsrSUStats = await axios.get(`${baseUrl}/users/signup/stats?month=${month}&year=${year}`, config);

        // logic to include all days in the month for the stats
        const daysInMonth = new Date(year, month, 0).getDate()
        const stats = resGtUsrSUStats.data;
        const statsData = [];

        for (let i = 1; i <= daysInMonth; i++) {

            let match = false;
            for (let s of stats) {
                if (i === s.day) {
                    statsData.push({ "day": i, "val": s.val })
                    match = true;
                    break;
                }
            };
            if (match === false) { statsData.push({ "day": i, "val": 0 }) };
        };
       
        return statsData;

    } catch (err) {
        console.log(err);
    };
};


/**
 * 
 * @param {object} user contains the login properties of the user
 */
exports.usrLogin = async (user) => {
    try {

        // login reqbody
        const reqLogin = {
            username_or_email: user.usernameoremail,
            password: user.password
        };

        // call login api
        const resLogin = await axios.post(`${baseUrl}/user/login`, reqLogin);
        return resLogin.data;        

    } catch (err) {
        // check if it's an axios error
        if (err.response) {
            throw new Error(err.response.data.Message);

        } else {
            throw new Error('An Error Occurred. Try again later.');
        };
    };
};


/**
 * 
 * @param {object} user contains the login properties of the user
 */
exports.usrLoginSocial = async (user) => {
    try {

        // login social reqbody
        const reqLoginSocial = {
            username: user.name,
            email: user.email,
            password: user.id,
            type: "Customer",
            profile_pic_url: picture
        };

        // call login api
        const resLoginSocial = await axios.post(`${baseUrl}/user/login/social`, reqLoginSocial);
        return resLoginSocial.data;        

    } catch (err) {
        // check if it's an axios error
        if (err.response) {
            throw new Error(err.response.data.Message);

        } else {
            throw new Error('An Error Occurred. Try again later.');
        };
    };
};


/**
 * 
 * @param {object} user contains the registration properties of the user
 */
exports.usrRegister = async (user) => {
    try {

        // register reqbody
        const reqRegister = {
            username: user.username,
            email: user.email,
            password: user.password,
            type: "Customer",
            profile_pic_url: `${baseUrl}/image/user/default_pfp.jpg`
        };

        // call register api
        const resRegister = await axios.post(`${baseUrl}/users`, reqRegister);
        return resRegister.data;        

    } catch (err) {
        // check if it's an axios error
        if (err.response) {
            throw new Error(err.response.data.Message);

        } else {
            throw new Error('An Error Occurred. Try again later.');
        };
    };
};