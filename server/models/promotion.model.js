/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { NotFound, UnprocessableEntity } = require('../utils/httpException.util');
const upSelect = require('../utils/sqlQueries/updateSelection');
const queryRes = require('../utils/sqlQueries/limitResult');


/** @class Promotion representing a promotion for a game */
class Promotion {
    /**
     * creates an instance of a prpmotion
     * 
     * @constructor
     * @param {object} promotion contains the details of the promotion
     * @param {string} gameid contains the id of the game for the promotion
     */
    constructor(promotion, img) {
        this.gameid = promotion.gameid;
        this.promname = promotion.promname;
        this.discount = promotion.discount;
        this.sdate = promotion.sdate;
        this.edate = promotion.edate;
        this.prompic = img.filename;
    };
};




/**
 * get all promotions in the db
 */
Promotion.getAll = async (expire='no') => {
    try {
        /* sql query */
        let qryFdPros = `SELECT promotion.promotionid, promotion.promname, promotion.discount, promotion.prompic, game.title, game.gameid,
                            DATE_FORMAT(promotion.sdate, "%D %b") AS avalFrom, DATE_FORMAT(promotion.edate, "%D %b") AS avalTo,
                            DATE_FORMAT(promotion.sdate, "%Y/%m/%d") AS startDate, DATE_FORMAT(promotion.edate, "%Y/%m/%d") AS endDate,
                            DATE_FORMAT(promotion.created_at, "%D %b %Y") AS created_at,
                            DATE_FORMAT(promotion.created_at, "%Y-%m-%d %T") AS date_created,
                            CASE 
                                WHEN promotion.edate >= CURDATE() THEN "Unexpired"
                                ELSE "Expired"
                            END AS 'state'
                         FROM promotion
                         INNER JOIN game USING (gameid) `;

        if (expire === 'no') {
            qryFdPros += `WHERE promotion.edate >= CURDATE() `
        };
        qryFdPros += `ORDER BY promotion.created_at DESC;`;

        const resFdPros = await sql.query(qryFdPros);
        
        return resFdPros;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * get all active promotions in the db
 */
Promotion.getActive = async (query) => {
    try {
        /* sql query */
        let qryFdAcPros = `SELECT promotion.promotionid, promotion.promname, promotion.discount, promotion.prompic, game.title, game.gameid,
                              DATE_FORMAT(promotion.sdate, "%Y/%m/%d") AS startDate, DATE_FORMAT(promotion.edate, "%Y/%m/%d") AS endDate
                           FROM promotion
                           INNER JOIN game USING (gameid)
                           WHERE promotion.sdate <= CURDATE() AND promotion.edate >= CURDATE()`;

        const resFdAcPros = await sql.query(qryFdAcPros);
        
        return resFdAcPros;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find promotion in the db by their id(promotionid)
 * 
 * @param {number} pid contains the id of the promotion to search by
 */
Promotion.findById = async (pid) => {
    try {
        const qryFdPmById = `SELECT promotionid, gameid, promname, discount, prompic, sdate, edate,
                                    DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at,
                                    DATE_FORMAT(updated_at, "%Y-%m-%d %T") AS updated_at,
                                    CONCAT_WS(' > ', DATE_FORMAT(sdate, "%Y/%m/%d"), DATE_FORMAT(edate, "%Y/%m/%d")) AS 'range'
                             FROM promotion WHERE promotionid = ?;`;
        const resFdPmById = await sql.query(qryFdPmById, pid);

        // check if promotionid exists in db (404 Error)
        if (resFdPmById.length === 0) {
            throw new NotFound(`No Promotion found with the id ${pid}.`);
        };
        return resFdPmById[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * 
 * @param {number} gid contains the id of the game to search the promotions by
 */
Promotion.findPromByGid = async (gid) => {
    try {
        const qryFdPmByGid = `SELECT * FROM promotion 
                              WHERE gameid = ? AND sdate <= CURDATE() AND edate >= CURDATE();`;
        const resFdPmByGid = await sql.query(qryFdPmByGid, gid);
        return resFdPmByGid[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * inserts a new promotion into the db
 * 
 * @param {object} promotion contains the properties of the new promotion
 */
Promotion.create = async (promotion) => {
    try {

        // first check if there's already an active/upcoming promotion for the game 
        const qryFdPmByGid = `SELECT * FROM promotion 
                              WHERE gameid = ? AND edate >= CURDATE();`;
        const resFdPmByGid = await sql.query(qryFdPmByGid, promotion.gameid);
        if (resFdPmByGid.length) { throw new UnprocessableEntity(`There's already an active/upcoming promotion for this game!`) }


        // if there is not, insert new promotion
        const qryInsertPm = `INSERT INTO promotion 
                             SET ?;`;
        const resNewPm = await sql.query(qryInsertPm, promotion);
        return resNewPm;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * updates a promotion in the db by their id(promotionid)
 * 
 * @param {number} pid contains the id of the promotion to be updated
 * @param {object} promotion contains the new properties of the promotion to be updated
 */
Promotion.updateById = async (pid, promotion) => {
    try {
        // update selected fields
        const { qUpdate, qParams } = await upSelect.updateFields(promotion);
        
        const qryUpdPmById = `UPDATE promotion 
                              SET ${qUpdate} 
                              WHERE promotionid = ?;`;
        const resUpdPmById = await sql.query(qryUpdPmById, [...qParams, pid]);

        // check if promotionid exists in db (404 Error)
        if (resUpdPmById.affectedRows === 0) {
            throw new NotFound(`No Promotion found with the id ${pid}.`);
        };
        return resUpdPmById;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove promotion from the db by their id(promotionid)
 * 
 * @param {number} pid contains the id of the promotion to be deleted
 */
Promotion.remove = async (pid) => {
    try {
        const qryDelPmById = `DELETE FROM promotion 
                               WHERE promotionid = ?;`;
        const resDelPmById = await sql.query(qryDelPmById, pid);

        // check if userid exists in db (404 Error)
        if (resDelPmById.affectedRows === 0) {
            throw new NotFound(`No Promotion found with the id ${userid}`);
        };
        return resDelPmById;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = Promotion;