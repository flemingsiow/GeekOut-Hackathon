/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { NotFound } = require('../utils/httpException.util');


/** @class Image representing an image */
class Image {
    /**
     * creates an instance of an image
     * 
     * @constructor
     * @param {object} img contains the properties of the image
     * @param {object} req contains the properties of the request
     * @param {string} desc is the user's description of the image
     */
    constructor(img, req, desc) {
        this.gameid = req.params.gid;
        this.userid = req.params.uid;
        this.imgname = img.filename;
        this.imgtype = img.mimetype;
        this.imgsize = img.size / (1024 ** 2);
        this.imgdesc = desc;
    };
};




/**
 * upload image and store its details into db
 * 
 * @param {object} imges contains the properties of the image to be uploaded
 */
Image.upload = async imges => {
    try {
        const qryInsertImg = `INSERT INTO image
                              SET ?;`;
        
        let idInsert = [];
        for (let img of imges) {
            const res = await sql.query(qryInsertImg, img);
            idInsert.push(res.insertId);
        };
        return idInsert;

    } catch (err) {
        throw err;
    };
};


/**
 * get all images' details in the db
 */
Image.getAll = async () => {
    try {
        const qryFdImges = `SELECT imageid, gameid, userid, imgname, imgdesc,
                                DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at
                            FROM image;`;
        const resFdImges = await sql.query(qryFdImges);
        return resFdImges;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * download stored image by their id(imageid)
 * 
 * @param {number} imgid contains the id of the image to be downloaded or viewed
 */
Image.downloadById = async (imgid) => {
    try {
        const qryFdImgById = `SELECT imgname
                              FROM image 
                              WHERE imageid = ?;`;
        const resFdImgById = await sql.query(qryFdImgById, imgid);

        // check if imageid exists in db (404 Error)
        if (resFdImgById.length === 0) {
            throw new NotFound(`No Image found with the id ${imgid}.`);
        };
        return resFdImgById[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * download stored image by their name(imgname)
 * 
 * @param {string} imgname contains the name of the image to be downloaded or viewed
 */
Image.downloadByName = async (imgname) => {
    try {
        const qryFdImgByName = `SELECT imgname 
                                FROM image
                                WHERE imgname = ?;`;
        const resFdImgByName = await sql.query(qryFdImgByName, imgname);

        // check if imgname exists in db (404 Error)
        if (resFdImgByName.length === 0) {
            throw new NotFound(`No Image found with the name ${imgname}.`);
        };
        return resFdImgByName[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * delete an image and its record by their id
 * 
 * @param {number} imgid contains the id of the image to be deleted
 */
Image.remove = async (imgid) => {
    try {
        const qryDelImgById = `DELETE
                               FROM image
                               WHERE imageid = ?;`;

        const resDelImgById = await sql.query(qryDelImgById, imgid);

        // check if imgname exists in db (404 Error)
        if (resDelImgById.affectedRows === 0) {
            throw new NotFound(`No Image found with the id ${imgid}.`);
        };
        return resDelImgById;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};



module.exports = Image;