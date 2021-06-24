/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const cart = require('../controllers/cart.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination


/* routes */
module.exports = app => {

    // (N) [ GET /cart/user/:uid ]
    app.get('/cart/user/:uid', isLoggedIn, cart.getByUid);

    // (N) [ GET /user/:uid/game/:gid/cart ]
    app.get('/user/:uid/game/:gid/cart', isLoggedIn, cart.getByUidGid);

    // (N) [ POST /user/:uid/game/:gid/cart ]
    app.post('/user/:uid/game/:gid/cart', isLoggedIn, cart.create);    

    // (N) [ DELETE /cart/user/:id ]
    app.delete('/cart/user/:id', isLoggedIn, cart.deleteByUid);

    // (N) [ DELETE /user/:uid/game/:gid/cart ]
    app.delete('/user/:uid/game/:gid/cart', isLoggedIn, cart.deleteGmCt); 
    
};