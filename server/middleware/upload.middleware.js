/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
    References:
        https://www.npmjs.com/package/multer

*/
'use strict';


const { BadRequest } = require('../utils/httpException.util');


const util = require("util");       // will be used to promisify methods       
const multer = require("multer");   // middleware to handle multipart/form-data


// set each file's max size limit
const maxSize = 1 * 1024 * 1024; // maxsize: 1MB = 1 BinaryByte * 1024 * 1024

// use disk storage engine for more customisation
const storage = multer.diskStorage({

    // set file destination
    destination: (req, file, callback) => {
        callback(null, `${__dirname}/../../client/src/public/img/uploads/`);
    },

    // set filename
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}_${new Date().getTime()}.jpg`);
    }

});


/*
    multer object middleware
*/
let uploadImage = multer({
    storage: storage,

    // restrict file size
    limits: { fileSize: maxSize },

    // custom filter
    fileFilter: (req, file, callback) => {

        // accepts only jpg(jpeg) images
        if (file.mimetype != 'image/jpg' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
            return callback(new BadRequest('Only jpg/jpeg images are allowed!'), false);
        };
        callback(null, true);
    }

}).array('img', 5); // accepts a max of 5 imges of the same fieldname

uploadImage = util.promisify(uploadImage); // allows async await


module.exports = uploadImage;
