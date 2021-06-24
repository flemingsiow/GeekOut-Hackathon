/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { query, body, check } = require('express-validator');


/*
    retrieve user
*/
exports.getUserSchema = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page query needs to be an integer above 1'),
    query('limit')
        .optional()
        .isInt({ min: 1 }).withMessage('Limit query needs to be an integer above 1'),
    query('sdate')
        .optional()
        .isDate().withMessage('Date query is in the wrong format'),
    query('edate')
        .optional()
        .isDate().withMessage('Date query is in the wrong format')
        .custom((value, { req }) => {
            const sdate = req.query.sdate || value;
            return value >= sdate
        }).withMessage('End date must be equal to or greater than start date'),
    query('search')
        .optional(),

    query()
        // check if user typed non existant query parms
        .custom(value => {
            const queries = Object.keys(value);
            const allowQuery = ['page', 'limit', 'sdate', 'edate', 'search'];
            return queries.every(query => allowQuery.includes(query));
        }).withMessage('Invalid query parameter')
];


/*
    insertion/registration of new user
*/
exports.createUserSchema = [
    check('userid')
        .not().exists().withMessage('You are not allowed to specify userid'),

    check('username')
        .exists().withMessage('Username is required')
        .isLength({ min: 5 }).withMessage('Username must contain at least 5 characters'),

    check('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .normalizeEmail(),

    check('password')
        .exists().withMessage('Password is required')
        .notEmpty().withMessage('Password must be filled')
        .isLength({ min: 7 }).withMessage('Password must contain at least 7 characters')
        .isLength({ max: 30 }).withMessage('Password must not exceed 30 characters'),

    check('type')
        .isIn(['Admin', 'Customer']).withMessage('Invalid role type'),

    check('profile_pic_url')
        .optional(),

    check('created_at')
        .not().exists().withMessage('You are not allowed to specify creation date'),

    check('updated_at')
        .not().exists().withMessage('You are not allowed to specify modified date'),

    body()
        // check if req.body is empty
        .custom(value => {
            return Object.keys(value).length;
        }).withMessage('Please provide required fields to insert')

        // check if user requested invalid/non existant fields
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'email', 'password', 'email', 'type', 'profile_pic_url'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid registration details!')
];


/*
    updating a user's details
*/
exports.updateUserSchema = [
    check('userid')
        .not().exists().withMessage('You are not allowed to specify userid'),

    check('username')
        .optional()
        .isLength({ min: 5 }).withMessage('Username must contain at least 5 characters long'),

    check('email')
        .optional()
        .isEmail().withMessage('Invalid email')
        .normalizeEmail(),

    check('password')
        .optional()
        .notEmpty()
        .isLength({ min: 7 }).withMessage('Password must contain at least 7 characters')
        .isLength({ max: 30 }).withMessage('Password must not exceed 30 characters'),

    check('type')
        .optional()
        .isIn(['Admin', 'Customer']).withMessage('Invalid role type'),

    check('profile_pic_url')
        .optional(),

    check('created_at')
        .not().exists().withMessage('You are not allowed to specify creation date'),

    check('updated_at')
        .not().exists().withMessage('You are not allowed to specify modified date'),

    body()
        // check if req.body is empty
        .custom(value => {
            return Object.keys(value).length;
        }).withMessage('Please provide required fields to update')

        // check if user requested invalid/non existant fields
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'email', 'password', 'email', 'type', 'profile_pic_url'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid update details')
];


/*
    logging in as a user
*/
exports.loginUserSchema = [
    check('username_or_email')
        .exists().withMessage('Username or email is requried'),
    check('password')
        .exists().withMessage('Password is required')
        .notEmpty().withMessage('Password must be filled'),

    body()
        // check if req.body is empty
        .custom(value => {
            return Object.keys(value).length;
        }).withMessage('Please provide required fields to login')

        // check if user requested invalid/non existant fields
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username_or_email', 'password'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid login details')
];


