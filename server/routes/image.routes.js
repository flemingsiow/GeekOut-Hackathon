/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const image = require('../controllers/image.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const uploadImage = require('../middleware/upload.middleware');
const pagination = require('../middleware/pagination.middleware'); // pagination
const { createImageSchema } = require('../middleware/validators/imageSchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (A) [ GET /images ]
    app.get('/images', image.findAll, pagination);

    // (A) [ GET /image/id/:id ]
    //** app.get('/image/id/:id', image.downloadById);

    // (A) [ GET /image/:name ]
    app.get('/image/:name', image.downloadByName);

    // [ GET /image/user/:name ]
    app.get('/image/user/:name', image.retrievePFP);
    
    // (A) [ POST /user/:uid/game/:gid/upload ]
    app.post('/user/:uid/game/:gid/upload', isLoggedIn, createImageSchema, validateSchema, uploadImage, image.upload);  

    // (M) [ DELETE /image/:id ]
    app.delete('/image/:id', isLoggedIn, isAdmin, image.delete);

};