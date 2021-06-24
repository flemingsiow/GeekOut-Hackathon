/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { UnprocessableEntity } = require('../utils/httpException.util');


/** @class Transaction representing a transaction (purchasing of games) made by a user */
class Transaction {
    /**
     * creates an instance of a transaction record
     * 
     * @constructor
     * @param {number} userid contains the id of the user that made the purchase
     * @param {object} transaction contains details on the transaction
     */
    constructor(transaction, userid) {
        this.userid = userid;
        this.subtotal = transaction.subtotal;
        this.gst_paid = transaction.gst_paid;
        this.discount_given = transaction.discount;
        this.total_amt_payable = transaction.total;
        this.cc_name = transaction.cc_name;
        this.cc_num = transaction.cc_num;
        this.ccv = transaction.ccv;
        this.exp_month = transaction.exp_month;
        this.exp_year = transaction.exp_year;
    };
};




/**
 * 
 * @param {number} uid contains the id of the user of their latest transaction to be retrieved
 */
Transaction.fdLatestTsByUid = async (uid) => {
    try {
        const qryFdTsByUid = `SELECT * FROM transaction WHERE userid = ? ORDER BY transactionid DESC LIMIT 1;`;
        const resFdTsByUid = await sql.query(qryFdTsByUid, uid);
        return resFdTsByUid[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * stores details of a transaction made by a user in the db
 * 
 * @param {object} transaction contains details of the transaction
 */
Transaction.create = async transaction => {
    try {
        const qryInsertTs = `INSERT INTO transaction
                             SET ?;`;
        const resNewTs = await sql.query(qryInsertTs, transaction);
        return resNewTs;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
            let dupe = err.sqlMessage.match(/key '.*UNIQUE/gi).toString().replace(/^key '/gi, '').replace(/.UNIQUE$/gi, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);

        } else if (err.code === 'ER_BAD_NULL_ERROR' || err.errno === 1048) {
            let colNull = err.sqlMessage.split(' ')[1].replace(/'/g, '')
            throw new UnprocessableEntity(`Please fill up all fields!`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = Transaction;