/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const apiTs = require('../apis/transaction.api');
const { nodeMailer } = require('../utils/nodemailer.util');
const { emailTemplate } = require('../utils/emailTemplate.util');
const { host, portServer } = require('../../config/env.config');


/* routes */
module.exports = app => {

    // cart page
    app.get('/cart', async (req, res, next) => {
        if (!req.session.token) {
            res.redirect('/');
        } else {
            res.render('cartList');
        };
    }); 

    // payment page
    app.get('/payment', async (req, res, next) => {
        if (!req.session.token) {
            res.redirect('/');
        } else {
            res.render('payment');
        };
    });

    // payment success page
    app.get('/payment-success', async (req, res, next) => {

        try {
            if (!req.session.token) {
                res.redirect('/');
            } else {

                // get transaction details 
                const transaction = await apiTs.gtLtTsByUid(req.session.user.userid, req.session.token);

                // get purchase details
                const purchases = await apiTs.gtPcsByTid(req.session.user.userid, transaction.transactionid, req.session.token);

                // send confirmation email
                const template = await emailTemplate(req.session.user.username, 
                    { transaction: transaction, purchases: purchases, url: `${host}:${portServer}` })
                await nodeMailer(req.session.user.email, 
                    `Payment Acknowledgement for Transaction ID ${transaction.transactionid}`, template);

                res.render('payment-success');
            };

        } catch (err) {
            console.log(err);
        };
    });

};