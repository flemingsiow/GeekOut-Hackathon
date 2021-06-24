/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Review = require('../models/review.model');


/*
    find a review by their id(reviewid)
    (M) GET /review/:id
*/
exports.findOne = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resFdRvById = await Review.findById(req.params.id);

        // send response
        res.status(200).send(resFdRvById);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find reviews by their gameid
    (11) GET /game/:id/review
*/
exports.findReviews = async (req, res, next) => {
    try {
        // call review model (sql logic) and store in req.data for pagination
        req.data = await Review.findReviewsByGameId(req.params.id);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find avg rating of reviews by their gameid
    GET /game/:id/avgRating
*/
exports.findAvgRating = async (req, res, next) => {
    try {
        // call review model (sql logic) and store in req.data for pagination
        const resFdAvgRvsByGid = await Review.findAvgRatingByGameId(req.params.id);

        // send response
        res.status(200).send(resFdAvgRvsByGid);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    retrieve average reviews over time, partitioned by game title
    (N) GET /game/title/avgReview
*/
exports.getStats = async (req, res, next) => {
    try {
        // call review model (sql logic) and store in req.data for pagination
        req.data = await Review.getRatingStats(req.query.gid, req.query.year);

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    insert a new review under a userid and gameid
    (10) POST /user/:uid/game/:gid/review
*/
exports.create = async (req, res, next) => {
    try {
        // call review model (sql logic)
        const resNewRv = await Review.create(new Review(req.body, req.params.uid, req.params.gid));

        // send response
        res.status(201).send({ 'reviewid': resNewRv.insertId });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    remove by userid and gameid
    (M) DELETE review/user/:uid/game/:gid
*/
exports.rmByUidGid = async (req, res, next) => {
    try {
        // call cart model (sql logic)
        const resRmByUidGid = await Review.rmByUidGid(req.params.uid, req.params.gid);

        // send response
        res.status(201).send({ 'Affected Rows': resRmByUidGid.affectedRows.toString() });

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};
