/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { param, body, check, validationResult } = require('express-validator');


/*
    insertion of new game
*/
exports.createGameSchema = [
    check('gameid')
        .not().exists().withMessage('You are not allowed to specify gameid'),

    check('title')
        .exists().withMessage('Game title is required')
        .notEmpty().withMessage('Title must be filled'),

    check('description')
        .optional(),

    check('price')
        .exists().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number'),

    check('categoryids')
        .optional()
        .isArray().withMessage('categoryid(s) needs to be in an array')
        .custom(value => {
            return value.every(id => id.toString().match(/^[0-9]+$/) != null)
        }).withMessage('categoryid(s) are not all integers'),

    check('year')
        .optional()
        .isInt().withMessage('Year must be an interger'),

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
            const allowUpdates = ['title', 'description', 'price', 'platform', 'categoryids', 'year'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid insertion details')
];


/*
    updating a game's details
*/
exports.updateGameSchema = [
    check('gameid')
        .not().exists().withMessage('You are not allowed to specify gameid'),

    check('title')
        .optional()
        .notEmpty().withMessage('Title must be filled'),

    check('description')
        .optional(),

    check('price')
        .optional()
        .isNumeric().withMessage('Price must be a number'),

    check('year')
        .optional()
        .isInt().withMessage('Year must be an interger'),

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
            const allowUpdates = ['title', 'description', 'price', 'platform', 'categoryids', 'year'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid insertion details')
];


/*
    deleting a game 
*/
exports.deleteGameSchema = [
    param('id')
        .exists().withMessage('Gameid is required')
        .isNumeric().withMessage('Gameid must be an integer'),
];
