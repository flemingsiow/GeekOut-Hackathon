/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { google } = require('googleapis');


const getOAuthClient = async function () {

    const googleConfig = {
        clientId: '961813494022-iaojloljc83itjfjpvv5csitooju6kqc.apps.googleusercontent.com',
        clientSecret: 'Tfh0ygOVtkDTpK4I-U8_FFdi',
        redirect: 'http://ec2-13-212-197-22.ap-southeast-1.compute.amazonaws.com:8000/oauthGoogle'
    };

    return new google.auth.OAuth2(googleConfig);
};


const getAuthUrl = async function () {
    const oauth2Client = getOAuthClient();

    // generate a url that asks permissions for Google+ and Google Calendar scopes
    const scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        // use this below to force approval (will generate refresh_token)
        // approval_prompt : 'force'
    });

    return url;
};


const getGooglePlusApi = async function (auth) {
    return google.plus({ version: 'v2', auth });
};

module.exports = { getOAuthClient, getAuthUrl, getGooglePlusApi };