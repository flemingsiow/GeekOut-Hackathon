/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* controllers */
const users = require('../controllers/user.controller');
/* middlewares */
const { isLoggedIn, isAdmin } = require('../middleware/authorise.middleware'); // authorisation
const pagination = require('../middleware/pagination.middleware'); // pagination
const { getUserSchema, createUserSchema,
    updateUserSchema, loginUserSchema } = require('../middleware/validators/userSchema.middleware');
const { validateSchema } = require('../middleware/validators/validationCheck.middleware');


/* routes */
module.exports = app => {

    // (1) [ GET /users ] Get all users' details
    app.get('/users', isLoggedIn, isAdmin, getUserSchema, validateSchema, users.findAll, pagination);

    // (3) [ GET /users/:id ] Get user's details by their id
    app.get('/users/:id', users.findOne);

    // (N) [ GET /users/signup/stats ] Get user sign up stats for a particular month and year
    app.get('/users/signup/stats', isLoggedIn, isAdmin, users.signUpStats);

    // (2) [ POST /users ] Register a new user
    app.post('/users', createUserSchema, validateSchema, users.create);

    // (N) [ POST /user/login ] Login as a user
    app.post('/user/login', loginUserSchema, validateSchema, users.login);

    // (N) [ POST /user/login/social ] Login as a user woth social media
    app.post('/user/login/social', loginUserSchema, validateSchema, users.loginSocial);

    // [ PUT /user/:id ] Update a users' details
    app.put('/user/:id', isLoggedIn, updateUserSchema, validateSchema, users.update);

    // [ DELETE /user/:id ] Delete a user by their id
    app.delete('/user/:id', isLoggedIn, users.delete);

    // [ DELETE /users ] Delete all users
    app.delete('/users', isLoggedIn, isAdmin, users.deleteAll);

};