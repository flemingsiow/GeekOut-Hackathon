/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { param, check } = require('express-validator');


/*
    insertion of new category
*/
exports.createImageSchema = [
    check('imageid')
        .not().exists().withMessage('You are not allowed to specify reviewid'),

    check('created_at')
        .not().exists().withMessage('You are not allowed to specify creation date'),

    check('updated_at')
        .not().exists().withMessage('You are not allowed to specify modified date'),

    param('uid')
        .exists().withMessage('userid is required')
        .isNumeric().withMessage('userid must be an integer'),

    param('gid')
        .exists().withMessage('gameid is required')
        .isNumeric().withMessage('gameid must be an integer')
];