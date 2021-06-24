/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Purchase = require('../models/purchase.model');


/*
    search purchase record by userid and gameid
    (M) GET /user/:uid/game/:gid/purchase
*/
exports.getByUidGid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resFdPcByUidGid = await Purchase.findPcByUidGid(req.params.uid, req.params.gid);

        // send response
        res.status(200).send(resFdPcByUidGid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    search purchase record by transactionid
    (M) GET /purchase/user/:uid/transaction/:tid
*/
exports.getByTid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resFdPcsByTid = await Purchase.findPcsByTid(req.params.tid);

        // send response
        res.status(200).send(resFdPcsByTid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


exports.getStats = async (req, res, next) => {
    try {
        // call purchase model (sql logic) and store in req.data for pagination
        req.data = await Purchase.getGamesStats();

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    store the details of the new purchase transaction under a userid and gameid
    (N) POST /user/:uid/game/:gid/purchase
*/
exports.create = async (req, res, next) => {
    try {
        // call purchase model (sql logic)
        const resNewPc = await Purchase.create(new Purchase(req.params.uid, req.params.gid, req.params.tid));

        // send response
        res.status(201).send({ 'purchaseid': resNewPc.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};