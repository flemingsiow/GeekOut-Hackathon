/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const transaction = require('../controllers/transaction.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination


/* routes */
module.exports = app => {

    // (N) [ GET /transaction/user/:uid ]
    app.get('/transaction/user/:uid', isLoggedIn, transaction.getLtByUid);

    // (N) [ POST /user/:uid/transaction ]
    app.post('/user/:uid/transaction', isLoggedIn, transaction.create);    
    
};