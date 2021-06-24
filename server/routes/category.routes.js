/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const category = require('../controllers/category.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination
const { createCategorySchema, updateCategorySchema } = require('../middleware/validators/categorySchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (M) [ GET /category ]
    app.get('/category', category.findAll, pagination);

    // (M) [ GET /category/:id ]
    app.get('/category/:id', category.findOne)

    // (M) [ GET /category/:name ]
    app.get('/category/name/:name', category.findByName);

    // (4) [ POST /category ]
    app.post('/category', isLoggedIn, isAdmin, createCategorySchema, validateSchema, category.create);    

    // (5) [ PUT /category/:id ]
    app.put('/category/:id', isLoggedIn, isAdmin, updateCategorySchema, validateSchema, category.update);

    // (M) [ DELETE /category/:id ]
    app.delete('/category/:id', isLoggedIn, isAdmin, category.delete);
    
};