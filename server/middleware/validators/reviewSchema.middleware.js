/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { param, body, check } = require('express-validator');


/*
    insertion of new category
*/
exports.createReviewSchema = [
    check('reviewid')
        .not().exists().withMessage('You are not allowed to specify reviewid'),

    check('content')
        .optional(),

    check('rating')
        .exists().withMessage('Rating is required')
        .isNumeric().withMessage('Rating must be a number'),

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
            const allowUpdates = ['content', 'rating'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid insertion details!'),

    param('uid')
        .exists().withMessage('userid is required')
        .isNumeric().withMessage('userid must be an integer'),

    param('gid')
        .exists().withMessage('gameid is required')
        .isNumeric().withMessage('gameid must be an integer')
];