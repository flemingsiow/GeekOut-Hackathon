/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';

const bcrypt = require('bcryptjs');     // encrypt password
const jwt = require('jsonwebtoken');    // secures information transfer (with JSON)

const User = require('../models/user.model');
const { BadRequest } = require('../utils/httpException.util');
const { token } = require('../config/env.config');
const { userValidation } = require('../middleware/validators/userSchema.middleware');


/*
    get all users
    (1) GET /users
*/
exports.findAll = async (req, res, next) => {
    try {
        // call user model (sql logic) and store in req.data for pagination
        req.data = await User.getAll(req.query);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find a user by their id(userid)
    (3) GET /users/:id
*/
exports.findOne = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resFdUsrById = await User.findById(req.params.id);

        // send response
        res.status(200).send(resFdUsrById);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    get user signup statistics for a particular month and year
    (N) GET /users/signup/stats
*/
exports.signUpStats = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resGtUsrSUStats = await User.gtSUStats(req.query.month, req.query.year);

        // send response
        res.status(200).send(resGtUsrSUStats);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    insert a new user
    (2) POST /users
*/
exports.create = async (req, res, next) => {
    try {
        // hash(encrypt) password
        const salt = await bcrypt.genSalt(10);
        const passwd = await bcrypt.hash(req.body.password, salt);

        // call user model (sql logic)
        const resNewUsr = await User.register(new User(req.body, passwd));

        // send response
        res.status(201).send({ 'userid': resNewUsr.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    user login
    (N) POST /user/login
*/
exports.login = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resUsrInfo = await User.login(req.body.username_or_email);

        // check if user exists
        if (resUsrInfo) { 
            // validate passwd with encrypted one
            const validPass = await bcrypt.compare(req.body.password, resUsrInfo.password);
            if (!validPass) {       
                throw new BadRequest('Username/Email or Password is incorrect!');
            };

            // create and assign token
            const accessToken = jwt.sign({ 
                userid: resUsrInfo.userid, type: resUsrInfo.type, email: resUsrInfo.email, username: resUsrInfo.username }, 
                token, 
                { expiresIn: '24h' }
            );
            
            // set session
            req.session.userInfo = JSON.stringify({
                userid: resUsrInfo.userid,
                username: resUsrInfo.username,
                email: resUsrInfo.email,
                type: resUsrInfo.type
            });
            req.session.token = accessToken;

            // send token as response
            res.header('auth-token', accessToken).send(req.session);
        };

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    user login with social media
    (N) POST /user/login/social
*/
exports.loginSocial = async (req, res, next) => {
    try {
        // hash(encrypt) password
        const salt = await bcrypt.genSalt(10);
        const passwd = await bcrypt.hash(req.body.password, salt);

        // call user model (sql logic)
        const resGtUsr = await User.socialLogin(new User(req.body, passwd));

        // create and assign token
        const accessToken = jwt.sign({ 
            userid: resGtUsr.userid, type: resGtUsr.type, email: resGtUsr.email, username: resGtUsr.username }, 
            token, 
            { expiresIn: '24h' }
        );

        // set session
        req.session.userInfo = JSON.stringify({
            userid: resUsrInfo.userid,
            username: resUsrInfo.username,
            email: resUsrInfo.email,
            type: resUsrInfo.type
        });
        req.session.token = accessToken;

        // send token as response
        res.header('auth-token', accessToken).send(req.session);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    update a user by their id(userid)
    (M) PUT /user/:id
*/
exports.update = async (req, res, next) => {
    try {
        // hash(encrypt) Password
        let passwd = undefined;
        if (req.body.password != undefined) {
            const salt = await bcrypt.genSalt(10);
            passwd = await bcrypt.hash(req.body.password, salt);
        };
        
        // call user model (sql logic)
        const resUpdUsrById = await User.updateById(req.params.id, new User(req.body, passwd));

        // end response
        //** res.status(201).send({ 'Message': resUpdUsrById.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/* 
    delete a user by their id(userid)
    (M) DELETE /user/:id
*/
exports.delete = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelUsrById = await User.remove(req.params.id);

        // end response
        //** res.status(201).send({ 'Message': resDelUsrById.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    delete all users
    (M) DELETE /users
*/
exports.deleteAll = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelUsrs = await User.removeAll();

        // end response
        //** res.status(201).send({ 'Message': resDelUsrs.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};