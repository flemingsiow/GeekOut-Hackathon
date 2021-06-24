/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Image = require('../models/image.model');
const { BadRequest } = require('../utils/httpException.util');


/*
    upload image(s) to the server
    (A) POST /user/:uid/game/:gid/upload
*/
exports.upload = async (req, res, next) => {
    try {
        // check for empty req (400 Error)
        if (req.files.length === 0) {
            throw new BadRequest('Please upload an image!');
        };
        
        // construct class for each image uploaded
        let imges = [];
        for (const i in req.files) {
            const [key, value] = Object.entries(req.body)[i];
            imges.push(new Image(req.files[i], req, value));
        };

        // call image model (sql logic)
        const resNewImgesIds = await Image.upload(imges);

        // send response
        res.status(201).send({ 'imageid(s)': resNewImgesIds });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    get all images
    (A) GET /images
*/
exports.findAll = async (req, res, next) => {
    try {
        // call image model (sql logic) and store in req.data for pagination
        req.data = await Image.getAll();

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    view or download an image by their id(imageid)
    (A) GET /image/:id
*/
exports.downloadById = async (req, res, next) => {
    try {
        // call image model (sql logic)
        const resFdImgById = await Image.downloadById(req.params.id);

        // retreive img directory and download image 
        let dirPath = `${__dirname}/../../client/src/public/img/uploads/${resFdImgById.imgname}`;
        await res.download(dirPath, resFdImgById.imgname);

    } catch (err) {
        next(err, req, res, next);
        return;
    };
};


/*
    view or download an image by their name(imgname)
    (A) GET /image/:name
*/
exports.downloadByName = async (req, res, next) => {
    try {
        // call image model (sql logic)
        const resFdImgByNm = await Image.downloadByName(req.params.name);

        // retrieve img directory and download image
        let dirPath = `${__dirname}/../../client/src/public/img/uploads/${resFdImgByNm.imgname}`;
        await res.download(dirPath, resFdImgByNm.imgname);

    } catch (err) {
        next(err, req, res, next);
        return;
    }
}


/*
    retrieve user's profile picture
    GET /image/user/:name
*/
exports.retrievePFP = async (req, res, next) => {
    try {

        // retrieve img directory and download image
        let dirPath = `${__dirname}/../../client/src/public/img/user_profiles/${req.params.name}`;
        await res.download(dirPath, `${req.params.name}.jpg`);

    } catch (err) {
        next(err, req, res, next);
        return;
    }
}


/*
    delete an image and its record
    DELETE /image/:id
*/

exports.delete = async (req, res, next) => {
    try {
        // call image model (sql logic)
        const resDelImgById = await Image.remove(req.params.id);

        // send response
        res.status(201).send({ "Affected Rows": resDelImgById.affectedRows });

    } catch (err) {
        next(err, req, res, next);
        return;
    };
}
