/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { UnprocessableEntity } = require('../utils/httpException.util');


/** @class Cart representing a shopping cart functionality to purchase a game */
class Cart {
    /**
     * creates an instance of a shopping cart functionality
     * 
     * @constructor
     * @param {number} userid contains the id of the user that made the purchase
     * @param {number} gameid contains the id of the game the purchase was for
     */
    constructor(userid, gameid) {
        this.userid = userid;
        this.gameid = gameid;
    };
};




/**
 * 
 * @param {number} uid contains the id of the user of the cart record to be search by
 */
Cart.findCartByUid = async (uid) => {
    try {
        const qryFdCtByUid = `SELECT * FROM cart WHERE userid = ? ORDER BY gameid;`;
        const resFdCtByUid = await sql.query(qryFdCtByUid, uid);
        return resFdCtByUid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};



/**
 * 
 * @param {number} uid contains the id of the user of the cart record to be search by
 * @param {number} gid contains the id of the game of the cart record to be search by
 */
Cart.findCartByUidGid = async (uid, gid) => {
    try {
        const qryFdCtByUidGid = `SELECT * FROM cart WHERE userid = ? AND gameid = ?;`;
        const resFdCtByUidGid = await sql.query(qryFdCtByUidGid, [uid, gid]);
        return resFdCtByUidGid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * saves a game choice for a user in a shopping cart (db) under a userid and gameid
 * 
 * @param {object} cart contains the properties of the record
 */
Cart.create = async cart => {
    try {
        const qryInsertCt = `INSERT INTO cart
                             SET ?;`;
        const resNewCt = await sql.query(qryInsertCt, cart);
        return resNewCt;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/key '.*UNIQUE/gi).toString().replace(/^key '/gi, '').replace(/.UNIQUE$/gi, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove carts from the db under userid
 * 
 * @param {number} userid contains the id of the user whose cart records are getting deleted
 */
Cart.removeByUid = async (userid) => {
    try {
        const qryDelCtByUid = `DELETE FROM cart 
                               WHERE userid = ?;`;
        const resDelCtByUid = await sql.query(qryDelCtByUid, userid);

        // check if userid has any cart records in db (404 Error)
        if (resDelCtByUid.affectedRows === 0) {
            throw new NotFound(`No Cart records were found under the userid ${userid}`);
        };
        return resDelCtByUid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove cart record from the db under userid and gameid
 * 
 * @param {number} userid contains the id of the user of the cart record to be deleted
 * @param {number} gameid contains the id of the game of the cart record to be deleted
 */
Cart.removeGmCt = async (userid, gameid) => {
    try {
        const qryDelGmCt = `DELETE FROM cart 
                            WHERE userid = ? AND gameid = ?;`;
        const resDelGmCt = await sql.query(qryDelGmCt, [userid, gameid]);

        // check if cart record exists in db (404 Error)
        if (resDelGmCt.affectedRows === 0) {
            throw new NotFound(`No Cart record was found under the userid ${userid} for ${gameid}`);
        };
        return resDelGmCt;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = Cart;