/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const review = require('../controllers/review.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination
const { createReviewSchema } = require('../middleware/validators/reviewSchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (M) [ GET /review/:id ]
    app.get('/review/:id', review.findOne);

    // (11) [ GET /game/:id/review ]
    app.get('/game/:id/review', review.findReviews, pagination);

    // [ GET /game/:id/avgRating ]
    app.get('/game/:id/avgRating', review.findAvgRating);

    // (N) [ GET /game/title/avgReview ]
    app.get('/ratingstats', review.getStats, pagination);
    
    // (10) [ POST /user/:uid/game/:gid/review ]
    app.post('/user/:uid/game/:gid/review/', isLoggedIn, createReviewSchema, validateSchema, review.create);  

    // (N) [ DELETE review/user/:uid/game/:gid ]
    app.delete('/review/user/:uid/game/:gid', isLoggedIn, review.rmByUidGid);

};