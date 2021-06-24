/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const jwt = require('jsonwebtoken');  
const apiUsr = require('../apis/user.api');
const { host, port, token } = require('../../config/env.config'); 
const { nodeMailer } = require('../utils/nodemailer.util');
const { usrRegistrationCfm } = require('../utils/emailTemplate.util');


/* routes */
module.exports = app => {

    // register page 
    app.route('/register')

        .get(async (req, res, next) => {
            res.render('register', { register: '' } );
        })

        .post(async (req, res, next) => {
            try {

                if (req.body.password !== req.body.cfmpassword) { throw new Error('Passwords do not match!') }
                
                // create unique token for confirmation link
                const emailToken = jwt.sign({ 
                    username: req.body.username, email: req.body.email, password: req.body.password }, 
                    token, 
                    { expiresIn: '24h' }
                );

                // send confirmation email
                const template = await usrRegistrationCfm(req.body.username, `${host}:${port}/confirm_registration/${emailToken}`);
                await nodeMailer(req.body.email, `SPGames | Registration Confirmation`, template);

                req.session.register = req.body;
                res.render('confirmEmail', { register: req.body });

            } catch (err) {
                res.locals.error = err.toString().slice(7);
                res.render('register', { register: req.body } )
            };
        });

    // registration accept confirmation
    app.get('/confirm_registration/:token', async (req, res, next) => {

        try {
            const registerUser = jwt.verify(req.params.token, token);
            const user = await apiUsr.usrRegister(registerUser);

            res.render('registrationSuccess');
        
        } catch (err) {
            console.log(err);
            res.redirect('/')
        };
    });

    
    // login page 
    app.route('/login')

        .get((req, res, next) => {

            // stores in session the previous page they were at
            req.session.returnTo = '/'
            if (req.headers['referer']) {
                req.session.returnTo = req.headers['referer'];
                const checkUrl = req.headers['referer'].toString().split('/').pop();
                if (checkUrl === 'register' || checkUrl === '404') { req.session.returnTo = '/'; };
                //{ googleurl: getAuthUrl(getOAuthClient())
            };
            res.render('login')
        })

        .post(async (req, res, next) => {
            try {
                const user = await apiUsr.usrLogin(req.body);
                const verifyUser = jwt.verify(user.token, token);

                // store in session
                req.session.user = verifyUser;
                req.session.token = user.token;

                // redirect to the last page they were on
                let returnTo = '/';
                if (req.session.returnTo) {
                    returnTo = req.session.returnTo;
                    delete req.session.returnTo;
                };
                res.redirect(returnTo)

            } catch (err) {
                res.locals.error = err.toString().slice(7);
                res.render('login')
            };
        });

    app.get('/oauthGoogle', async (req, res, next) => {
        try {
            const oauth2Client = getOAuthClient();
            const code = req.query.code;

            // get the auth tokens from the req
            const data = await oauth2Client.getToken(code);
            const tokens = data.tokens;

            // add tokens to the google api so we have access to the account
            oauth2Client.setCredentials(tokens);

            // connect to google plus in order to get the user's email and credentials
            const plus = getGooglePlusApi(oauth2Client);
            const userInfo = await plus.userinfo.get();
            const me = await plus.people.get({ userId: 'me' });
            userInfo.email = me.data.emails && me.data.emails.length && me.data.emails[0].value;

            // retrieve and register/login with details
            const user = await apiUsr.usrLoginSocial(userInfo);
            const verifyUser = jwt.verify(user.token, token);

            // store in session
            req.session.user = verifyUser;
            req.session.token = user.token;

            res.redirect('/');

        } catch (err) {
            console.log(err);
        };
    });


    // logout
    app.get('/logout', (req, res, next) => {

        // destroy session
        req.session.destroy();

        // redirect to the last page they were on
        let orgUrl;
        if (req.headers['referer']) {
            orgUrl = req.headers['referer']
            const checkUrl = req.headers['referer'].toString().split('/').pop();
            if (checkUrl === 'register' || checkUrl === '404') { orgUrl = '/'; };
        };
        res.redirect(orgUrl || '/')
    });

};