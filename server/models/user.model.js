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


/** @class User representing a user */
class User {
    /**
     * creates an instance of a user
     * 
     * @constructor
     * @param {object} user contains the properties of the user
     * @param {string} passwd is the encrypted password of the user
     */
    constructor(user, passwd) {
        this.username = user.username;
        this.email = user.email;
        this.type = user.type;
        this.profile_pic_url = user.profile_pic_url;
        this.password = passwd;
        //** this.active = user.active;
    };
};




/**
 * get all users in the db
 */
User.getAll = async (query) => {
    try {
        /* sql query */
        let qryFdUsrs = `SELECT userid, username, email, type, profile_pic_url,
                                DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at
                         FROM user `;
    
        // retrieve sql queries for query params
        const { conditions, values } = await queryRes.limitResult(query)
        if (query.search) { conditions.push(`username LIKE ?`); values.push(`%${query.search}%`); };
        qryFdUsrs += (conditions.length ? (`WHERE ${conditions.join(' AND ')}`) : '');

        const resFdUsrs = await sql.query(qryFdUsrs, values);
        
        // check if query return any result
        if (resFdUsrs.length === 0) {
            if (query.length > 1) { throw new NotFound(`Your search did not have any matches`);
            } else if (query.search) { throw new NotFound(`Your search for ${query.search} did not have matches`); 
            } else if (query.sdate || query.edate) { throw new NotFound(`No users found within date range`);
            } else { throw new NotFound(`Database does not contain any users`); }; 
        };

        // if user used the search query 
        if (query.search && !(query.page || query.limit)) {
            return { 'totalFound': resFdUsrs.length.toString(), 'results': resFdUsrs };
        };
        
        return resFdUsrs;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find user in the db by their id(userid)
 * 
 * @param {number} userid contains the id of the user to search by
 */
User.findById = async (userid) => {
    try {
        const qryFdUsrById = `SELECT userid, username, email, profile_pic_url, type, 
                                    DATE_FORMAT(created_at, "%Y-%m-%d %T") AS created_at
                              FROM user WHERE userid = ?;`;
        const resFdUsrById = await sql.query(qryFdUsrById, userid);

        // check if userid exists in db (404 Error)
        if (resFdUsrById.length === 0) {
            throw new NotFound(`No user found with the id ${userid}.`);
        };
        return resFdUsrById[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * returns user signup statistics
 * 
 * @param {number} month contains the month of the statistics you wish to retrieve
 * @param {number} year contains the year of the statistics you wish to retrieve
 */
User.gtSUStats = async (month, year) => {
    try {
        const qryGtUsrSUStats = `SELECT DAY(created_at) AS day, COUNT(userid) AS val
                                 FROM spgames.user
                                 WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?
                                 GROUP BY DAY(created_at), MONTH(created_at);`;
        const resGtUsrSUStats = await sql.query(qryGtUsrSUStats, [month, year]);

        return resGtUsrSUStats;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * register user into db
 * 
 * @param {object} user contains the properties of the user to be registered
 */
User.register = async (user) => {
    try {
        const qryInsertUsr = `INSERT INTO user 
                              SET ?;`;
        const resNewUsr = await sql.query(qryInsertUsr, user);
        return resNewUsr;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            throw new UnprocessableEntity(`The username/email provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * user login
 * 
 * @param {string} username_or_email is either the username or email of the user
 */
User.login = async (username_or_email) => {
    try {
        const qryFdUsrByNameOrEmail = `SELECT userid, username, type, password, email
                                       FROM user 
                                       WHERE username = ? OR email = ?;`;
        const resUserInfo = await sql.query(qryFdUsrByNameOrEmail, [username_or_email, username_or_email]);

        // check if username or email exists in db (404 Error)
        if (resUserInfo.length === 0) {
            throw new NotFound(`No User found with the username/email ${username_or_email}.`);
        };
        return resUserInfo[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * register/login user with social
 * 
 * @param {object} user contains the properties of the user to be registered/login
 */
User.socialLogin = async (user) => {
    try {

        // first check if a user email already exists for that account
        const qryFdUsr = `SELECT userid, username, type, password, email FROM user WHERE email = ?;`;
        const resFdUsr = await sql.query(qryFdUsr, user.email);

        if (resFdUsr.length) { // if user exists, login the user directly
            return resFdUsr[0];
        
        } else { // if they don't, register the user and automatically login
            const qryInsertUsr = `INSERT INTO user SET ?;`;
            const resNewUsr = await sql.query(qryInsertUsr, user);

            const qrygtUsr = `SELECT userid, username, type, password, email FROM user WHERE userid = ?;`;
            const resGtUsr = await sql.query(qrygtUsr, resNewUsr.insertId);

            return resGtUsr[0];
        };

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/\..*(_UNIQUE)?'/g).toString().replace(/\./g, '').replace(/(_UNIQUE)?'/g, '');
            throw new UnprocessableEntity(`The username/email provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * update user in the db by their id(userid)
 * 
 * @param {number} userid contains the id of the user to be updated
 * @param {object} user contains the properties of the user to be updated
 */
User.updateById = async (userid, user) => {
    try {
        // update selected fields
        const { qUpdate, qParams } = await upSelect.updateFields(user);
        
        /* sql query */
        const qryUpdUsrById = `UPDATE user 
                               SET ${qUpdate} 
                               WHERE userid = ?;`;
        const resUpdUsrById = await sql.query(qryUpdUsrById, [...qParams, userid]);

        // check if userid exists in db (404 Error)
        if (resUpdUsrById.affectedRows === 0) {
            throw new NotFound(`No User found with the id ${userid}`);
        };
        return resUpdUsrById;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/key '.*_UNIQUE'$/g).toString().replace(/^key '/g, '').replace(/_UNIQUE'$/g, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove user from the db by their id(userid)
 * 
 * @param {number} userid contains the id of the user to be deleted
 */
User.remove = async (userid) => {
    try {
        const qryDelUsrById = `DELETE FROM user 
                               WHERE userid = ?;`;
        const resDelUsrById = await sql.query(qryDelUsrById, userid);

        // check if userid exists in db (404 Error)
        if (resDelUsrById.affectedRows === 0) {
            throw new NotFound(`No User found with the id ${userid}`);
        };
        return resDelUsrById;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * remove all users from the db
 */
User.removeAll = async () => {
    try {
        const qryDelUsrs = `DELETE FROM user;`;
        const resDelUsrs = await sql.query(qryDelUsrs);
        return resDelUsrs;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = User;