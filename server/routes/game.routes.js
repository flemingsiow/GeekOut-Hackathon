/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const games = require('../controllers/game.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const uploadImage = require('../middleware/upload.middleware');
const pagination = require('../middleware/pagination.middleware'); // pagination
const { createGameSchema, updateGameSchema, deleteGameSchema } = require('../middleware/validators/gameSchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (M) [ GET /games ]
    app.get('/games', games.findAll, pagination);

    // [ GET /platforms ]
    app.get('/platforms', games.findPlatforms, pagination);

    // (M) [ GET /game/:id ]
    app.get('/game/id/:id', games.findOne);

    // (7) [ GET /games/:platform ]
    app.get('/games/:platform', games.findByPlatform, pagination);

    // (6) [ POST /game ]
    app.post('/game', isLoggedIn, isAdmin, uploadImage, games.create);    

    // (9) [ PUT /game/:id ]
    app.put('/game/:id', isLoggedIn, isAdmin, uploadImage, updateGameSchema, validateSchema, games.update);

    // (8) [ DELETE /game/:id ]
    app.delete('/game/:id', isLoggedIn, isAdmin, deleteGameSchema, validateSchema, games.delete); 

};