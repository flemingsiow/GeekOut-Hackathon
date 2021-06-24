/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Promotion = require('../models/promotion.model');
const { BadRequest } = require('../utils/httpException.util');


/*
    get all promotions
    (M) GET /promotions
*/
exports.findAll = async (req, res, next) => {
    try {
        // call user model (sql logic) and store in req.data for pagination
        req.data = await Promotion.getAll(req.query.expire);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find a promotion by their id(promotionid)
    (M) GET /promotion/:id
*/
exports.findOne = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resFdPmById = await Promotion.findById(req.params.id);

        // send response
        res.status(200).send(resFdPmById);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    get all active promotions
    (M) GET /promotions/active
*/
exports.findAllAc = async (req, res, next) => {
    try {
        // call user model (sql logic) and store in req.data for pagination
        req.data = await Promotion.getActive(req.query);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};



/*
    get promotion(s) by its gameid
    (M) GET /promotions/game/:gid
*/
exports.fdByGid = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resFdPmByGid = await Promotion.findPromByGid(req.params.gid);

        // send response
        res.status(200).send(resFdPmByGid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    insert a new promotion
    (A) POST /promotions
*/
exports.create = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resNewPm = await Promotion.create(new Promotion(req.body, req.files[0]));

        // end response
        res.status(201).send({ 'promotionid': resNewPm.insertId });


    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    update a promotion by their id(promotionid)
    (5) PUT /promotion/:id
*/
exports.update = async (req, res, next) => {
    try {

        // call category model (sql logic)
        const resUpdById = await Promotion.updateById(req.params.id, new Promotion(req.body, req.files[0]));

        // end response
        res.status(201).send({ 'Affected Rows': resUpdById.affectedRows.toString() });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};



/* 
    delete a promotion by their id(promotionid)
    (M) DELETE /promotion/:id
*/
exports.delete = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelPmById = await Promotion.remove(req.params.id);

        // end response
        res.status(201).send({ 'Message': resDelPmById.affectedRows.toString() });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};