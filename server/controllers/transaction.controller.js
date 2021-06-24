/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Transaction = require('../models/transaction.model');


/*
    get latest transaction made under userid
    (M) GET /transaction/user/:uid
*/
exports.getLtByUid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resFdTsByUid = await Transaction.fdLatestTsByUid(req.params.uid);

        // send response
        res.status(200).send(resFdTsByUid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    stores a transaction made under a userid
    (M) POST /user/:uid/transaction
*/
exports.create = async (req, res, next) => {
    try {
        // call transaction model (sql logic)
        const resNewTs = await Transaction.create(new Transaction(req.body, req.params.uid));

        // send response
        res.status(201).send({ 'transactionid': resNewTs.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};
