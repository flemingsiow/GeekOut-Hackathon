/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const upSelect = require('../utils/sqlQueries/updateSelection');
const { NotFound, UnprocessableEntity } = require('../utils/httpException.util');


/** @class Category representing a category */
class Category {
    /**
     * creates an instance of a category
     * 
     * @constructor
     * @param {object} category contains the properties of the category
     */
    constructor(category) {
        this.catname = category.catname;
        this.description = category.description;
    };
};




/**
 * get all categories in the db
 */
Category.getAll = async () => {
    try {
        const qryFdCats = `SELECT categoryid, catname, description,
                                DATE_FORMAT(created_at, "%d/%m/%Y %T") AS created_at,
                                DATE_FORMAT(updated_at, "%d/%m/%Y %T") AS updated_at
                           FROM category;`;
        const resFdCats = await sql.query(qryFdCats);
        return resFdCats;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find category in the db by their id(categoryid)
 * 
 * @param {number} catid contains the id of the category to search by
 */
Category.findById = async (catid) => {
    try {
        const qryFdCatById = `SELECT categoryid, catname, description,
                                    DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at,
                                    DATE_FORMAT(updated_at, "%Y-%m-%d %T") AS updated_at
                              FROM category WHERE categoryid = ?;`;
        const resFdCatById = await sql.query(qryFdCatById, catid);

        // check if categoryid exists in db (404 Error)
        if (resFdCatById.length === 0) {
            throw new NotFound(`No Category found with the id ${catid}.`);
        };
        return resFdCatById[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find category in the db by their id(categoryid)
 * 
 * @param {string} catname contains the name of the category to search by
 */
Category.findByName = async (catname) => {
    try {
        const qryFdCatByNm = `SELECT categoryid AS catid, catname, description,
                                    DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at,
                                    DATE_FORMAT(updated_at, "%Y-%m-%d %T") AS updated_at
                              FROM category WHERE catname = ?;`;
        const resFdCatByNm = await sql.query(qryFdCatByNm, catname);

        // check if categoryid exists in db (404 Error)
        if (resFdCatByNm.length === 0) {
            throw new NotFound(`No Category found with the name ${catname}.`);
        };
        return resFdCatByNm[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * inserts a new category into the db
 * 
 * @param {object} category contains the properties of the new category
 */
Category.create = async (category) => {
    try {
        const qryInsertCat = `INSERT INTO category 
                              SET ?;`;
        const resNewCat = await sql.query(qryInsertCat, category);
        return resNewCat;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            if(dupe === "catname") dupe = 'category name';
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * updates a category into the db by their id(catid)
 * 
 * @param {number} catid contains the id of the category to be updated
 * @param {object} category contains the new properties of the category to be updated
 */
Category.updateById = async (catid, category) => {
    try {
        // update selected fields
        const { qUpdate, qParams } = await upSelect.updateFields(category);
        
        const qryUpdCatById = `UPDATE category 
                               SET ${qUpdate} 
                               WHERE categoryid = ?;`;
        const resUpdById = await sql.query(qryUpdCatById, [...qParams, catid]);

        // check if categoryid exists in db (404 Error)
        if (resUpdById.affectedRows === 0) {
            throw new NotFound(`No Category found with the id ${catid}.`);
        };
        return resUpdById;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            if(dupe === "catname") dupe = 'category name';
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove category from the db by their id(categoryid)
 * 
 * @param {number} catid contains the id of the category to be deleted
 */
Category.remove = async (catid) => {
    try {
        const qryDelCatById = `DELETE FROM category 
                               WHERE categoryid = ?;`;
        const resDelCatById = await sql.query(qryDelCatById, catid);

        // check if userid exists in db (404 Error)
        if (resDelCatById.affectedRows === 0) {
            throw new NotFound(`No Category found with the id ${catid}`);
        };
        return resDelCatById;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = Category;