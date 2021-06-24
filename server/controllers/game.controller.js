/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Image = require('../models/image.model');
const Game = require('../models/game.model');
const { BadRequest } = require('../utils/httpException.util');


/*
    get all games
    (M) GET /games
*/
exports.findAll = async (req, res, next) => {
    try {
        // call user model (sql logic) and store in req.data for pagination
        req.data = await Game.getAll(req.query);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    get all platforms
    ( ) GET /platforms
*/
exports.findPlatforms = async (req, res, next) => {
    try {
        // call user model (sql logic) and store in req.data for pagination
        req.data = await Game.findPlatforms(req.query);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find a game by their id(gameid)
    (M) GET /game/:id
*/
exports.findOne = async (req, res, next) => {
    try {
        // call game model (sql logic)
        const resFdGmById = await Game.findById(req.params.id);

        // send response
        res.status(200).send(resFdGmById);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    insert a new game
    (6) POST /game
*/
exports.create = async (req, res, next) => {
    try {

        if (!Array.isArray(req.body.categoryids)) {
            if (req.body.categoryids.slice(-1) != ']') {
                req.body.categoryids = [...req.body.categoryids.toString().split(',')];
            } else {
                req.body.categoryids = JSON.parse(req.body.categoryids);
            }
        };

        // call game post model (sql logic)
        const resNewGm = await Game.create(new Game(req.body));

        // check for empty req (400 Error)
        if (req.files === undefined) {
            throw new BadRequest('Please upload an image for the game!');
        };

        // construct class for the image uploaded
        req.params.gid = resNewGm.insertId;
        req.params.uid = req.userData.userid;
        const imges = [new Image(req.files[0], req, req.body.imgdesc)];

        // call image upload model (sql logic)
        const resNewImgesIds = await Image.upload(imges);

        // call game update model (sql logic)
        req.body.gamepic = imges[0].imgname;
        const resUpdGmById = await Game.updateById(resNewGm.insertId, new Game(req.body));

        // send response
        res.status(201).send({ 'gameid': resNewGm.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find games by their platform
    (7) GET /games/:platform
*/
exports.findByPlatform = async (req, res, next) => {
    try {
        // call game model (sql logic) and store in req.data for pagination
        req.data = await Game.findByPlatform(req.params.platform);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    delete a game by their id(gameid)
    (8) DELETE /game/:id
*/
exports.delete = async (req, res, next) => {
    try {
        // call game model (sql logic)
        const resDelGmById = await Game.remove(req.params.id);

        // end response
        //** res.status(201).send({ 'Affected Rows': resDelGm.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    update a game by their id(gameid)
    (9) PUT /game/:id
*/
exports.update = async (req, res, next) => {

    try {
        if (!Array.isArray(req.body.categoryids)) {
            if (req.body.categoryids.slice(-1) != ']') {
                req.body.categoryids = [...req.body.categoryids.toString().split(',')];
            } else {
                req.body.categoryids = JSON.parse(req.body.categoryids);
            }
        };

        // check for empty req (400 Error)
        if (req.files != undefined && req.files.length != 0) {
            // construct class for the image uploaded
            req.params.gid = req.params.id;
            req.params.uid = req.userData.userid;
            const imges = [new Image(req.files[0], req, req.body.imgdesc)];

            // call image upload model (sql logic)
            const resNewImgesIds = await Image.upload(imges);

            req.body.gamepic = imges[0].imgname;
        };

        // call game model (sql logic)
        const resUpdGmById = await Game.updateById(req.params.id, new Game(req.body));

        // end response
        //** res.status(201).send({ 'Message': resUpdGmById.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};