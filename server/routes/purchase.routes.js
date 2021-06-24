/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const purchase = require('../controllers/purchase.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination
const { createPurchaseSchema } = require('../middleware/validators/purchaseSchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (M) [ GET /user/:uid/game/:gid/purchase ] Check if purchase was made for a gameid under a userid
    app.get('/user/:uid/game/:gid/purchase', isLoggedIn, purchase.getByUidGid);

    // (N) [ GET /gameYrSales ] Gets yearly sale statistics for each game
    app.get('/gameYrSales', purchase.getStats, pagination);

    // (N) [ GET /purchase/user/:uid/transaction/:tid ]
    app.get('/purchase/user/:uid/transaction/:tid', isLoggedIn, purchase.getByTid);

    // (N) [ POST /user/:uid/game/:gid/purchase ]
    app.post('/user/:uid/game/:gid/trans/:tid/purchase', isLoggedIn, createPurchaseSchema, validateSchema, purchase.create);    
    
};