/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const promotions = require('../controllers/promotion.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const uploadImage = require('../middleware/upload.middleware');
const pagination = require('../middleware/pagination.middleware'); // pagination


/* routes */
module.exports = app => {

    // (B) [ GET /promotions ]
    app.get('/promotions', promotions.findAll, pagination);

    // (N) [ GET /category/:id ]
    app.get('/promotions/id/:id', promotions.findOne)

    // (N) [ GET /promotions/active ]
    app.get('/promotions/active', promotions.findAllAc, pagination);

    // (B) [ GET /promotions/game/:gid ]
    app.get('/promotions/game/:gid', promotions.fdByGid); 

    // (A) [ POST /promotions ]
    app.post('/promotions', isLoggedIn, isAdmin, uploadImage, promotions.create);

    // (N) [ PUT /promotions/:id ]
    app.put('/promotions/:id', isLoggedIn, isAdmin, uploadImage, promotions.update);

    // (M) [ DELETE /promotion/:id ]
    app.delete('/promotion/:id', isLoggedIn, isAdmin, promotions.delete);

};