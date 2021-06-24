/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { body, check } = require('express-validator');


/*
    insertion of new category
*/
exports.createCategorySchema = [
    check('categoryid')
        .not().exists().withMessage('You are not allowed to specify categoryid'),

    check('catname')
        .exists().withMessage('Category name is required')
        .notEmpty().withMessage('Category name must be filled'),

    check('description')
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
            const allowUpdates = ['catname', 'description'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid insertion details!')
];


/*
    updating a category's details
*/
exports.updateCategorySchema = [
    check('categoryid')
        .not().exists().withMessage('You are not allowed to specify categoryid'),

    check('catname')
        .optional()
        .notEmpty().withMessage('Title must be filled'),

    check('description')
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
            const allowUpdates = ['catname', 'description'];
            return updates.every(update => allowUpdates.includes(update));
        }).withMessage('Invalid update details')
];


