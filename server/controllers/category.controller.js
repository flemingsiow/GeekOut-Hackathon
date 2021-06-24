/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const Category = require('../models/category.model');


/*
    get all categories
    (M) GET /category
*/
exports.findAll = async (req, res, next) => {
    try {
        // call category model (sql logic) and store in req.data for pagination
        req.data = await Category.getAll();

        next(); // call pagination middleware

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    find a category by their id(categoryid)
    (M) GET /category/:id
*/
exports.findOne = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resFdCatById = await Category.findById(req.params.id);

        // send response
        res.status(200).send(resFdCatById);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/* 
    find a category by their name
    (M) GET /category/name/:name
*/
exports.findByName = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resFdCatByNm = await Category.findByName(req.params.name);

        // send response
        res.status(200).send(resFdCatByNm);

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    insert a new category
    (4) POST /category
*/
exports.create = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resNewCat = await Category.create(new Category(req.body));

        // end response
        res.status(201).send({ 'categoryid': resNewCat.insertId });
        //res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    update a category by their id(catid)
    (5) PUT /category/:id
*/
exports.update = async (req, res, next) => {
    try {
        // call category model (sql logic)
        const resUpdById = await Category.updateById(req.params.id, new Category(req.body));

        // end response
        //** res.status(201).send({ 'Affected Rows': resUpdById.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/* 
    delete a category by their id(categoryid)
    (M) DELETE /category/:id
*/
exports.delete = async (req, res, next) => {
    try {
        // call user model (sql logic)
        const resDelCatById = await Category.remove(req.params.id);

        // end response
        //** res.status(201).send({ 'Message': resDelCatById.affectedRows.toString() });
        res.status(204).end();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};