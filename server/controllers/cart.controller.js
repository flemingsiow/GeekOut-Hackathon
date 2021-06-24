/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Cart = require('../models/cart.model');


/*
    search cart by userid 
    (M) GET /cart/user/:uid
*/
exports.getByUid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resFdCtByUid = await Cart.findCartByUid(req.params.uid);

        // send response
        res.status(200).send(resFdCtByUid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    search cart by userid and gameid
    (M) GET /user/:uid/game/:gid/cart
*/
exports.getByUidGid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resFdCtByUidGid = await Cart.findCartByUidGid(req.params.uid, req.params.gid);

        // send response
        res.status(200).send(resFdCtByUidGid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    add to cart for a userid under gameid
    (M) POST /user/:uid/game/:gid/cart
*/
exports.create = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resNewCt = await Cart.create(new Cart(req.params.uid, req.params.gid));

        // send response
        res.status(201).send({ 'cartid': resNewCt.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/* 
    delete carts under userid
    (M) DELETE /cart/user/:id
*/
exports.deleteByUid = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelCtByUid = await Cart.removeByUid(req.params.id);

        // end response
        //** res.status(201).send({ 'Message': resDelCtByUid.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/* 
    delete carts under userid and gameid
    (M) DELETE /user/:uid/game/:gid/cart
*/
exports.deleteGmCt = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelGmCt = await Cart.removeGmCt(req.params.uid, req.params.gid);

        // end response
        //** res.status(201).send({ 'Message': resDelCtByUid.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};

