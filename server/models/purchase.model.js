/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { UnprocessableEntity } = require('../utils/httpException.util');


/** @class Purchase representing a purchase transaction */
class Purchase {
    /**
     * creates an instance of a purchase transaction
     * 
     * @constructor
     * @param {number} userid contains the id of the user that made the purchase
     * @param {number} gameid contains the id of the game the purchase was for
     */
    constructor(userid, gameid, transactionid) {
        this.userid = userid;
        this.gameid = gameid;
        this.transactionid = transactionid;
    };
};




/**
 * 
 * @param {number} uid contains the id of the user of the purchase record to be search by
 * @param {number} gid contains the id of the game of the purchase record to be search by
 */
Purchase.findPcByUidGid = async (uid, gid) => {
    try {
        const qryFdPcByUidGid = `SELECT * FROM purchase WHERE userid = ? AND gameid = ?;`;
        const resFdPcByUidGid = await sql.query(qryFdPcByUidGid, [uid, gid]);
        return resFdPcByUidGid[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * 
 * @param {number} tid contains the id of the transaction of the purchase record to be search by
 */
Purchase.findPcsByTid = async (tid) => {
    try {
        const qryFdPcsByTid = `SELECT game.title, game.price, game.gamepic, promotion.discount,
                               CASE
                                   WHEN sdate >= purchase.created_at OR edate <= purchase.created_at THEN NULL 
                                   ELSE sdate
                               END AS active
                               FROM purchase 
                               INNER JOIN game USING (gameid)
                               LEFT JOIN promotion USING (gameid)
                               WHERE transactionid = ?;`;
        const resFdPcsByTid = await sql.query(qryFdPcsByTid, tid);

        

        // check if promotions are active
        for (const p of resFdPcsByTid) {
            if (!p.active) {
                p.discount = 0;
            };
        };

        return resFdPcsByTid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};



/**
 * store purchase transaction details into db under a userid and gameid
 * 
 * @param {object} purchase contains the properties of the new purchase transaction
 */
Purchase.create = async purchase => {
    try {
        const qryInsertPc = `INSERT INTO purchase
                             SET ?;`;
        const resNewPc = await sql.query(qryInsertPc, purchase);
        return resNewPc;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            throw new UnprocessableEntity(`Duplicate Error`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * gets yearly sales statistics (for each game)
 * 
 * @param {*} gid 
 */
Purchase.getGamesStats = async (qParams) => {
    try {
        /*
            OVER():
                constructs a window function
            PARTITION():
                partition window by particular column
            ORDER BY():
                how to sort each partition by
            ROWS BETWEEN 1 PRECEDING AND ROW:
                apply aggregation based on previous and current row
        */
        // find the total sales for each game per year
        let qrPcByYr = 'SELECT game.title AS game, game.gameid, ' +
                              'YEAR(purchase.created_at) AS year, ' +
                              'SUM(game.price) AS price ' +
                       'FROM purchase ' +
                       'INNER JOIN game USING(gameid) ' + 
                       'GROUP BY YEAR(purchase.created_at), game.title';

        // returns the delta (change) for each year, partitioned by game
        let qryFdDelta = 'SELECT pcByYear.game AS Game, pcByYear.gameid, ' +
                                'pcByYear.year, ' + 
                                'pcByYear.price, ' +
                                'pcByYear.price - LAG(pcByYear.price) OVER(' + 
                                    'PARTITION BY pcByYear.game ' + 
                                    'ORDER BY pcByYear.year' +
                                ') AS delta ' +
                         'FROM ' + `(${qrPcByYr}) AS pcByYear`;

        // calculate cumulative sales and with delta, calculate pct change
        let qryGameSales = 'SELECT pd.game AS Game, pd.gameid, ' +
                                  'pd.year AS `Year`, ' +
                                  'SUM(pd.price) AS `Sales`, ' +
                                  'pd.delta as `Price Delta`, ' + 
                                  '100 * pd.delta / LAG(pd.price) OVER(' +
                                        'PARTITION BY pd.game' + 
                                  ') AS `Delta Pct Change`, ' + 
                                  'SUM(pd.price) OVER(' +
                                        'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW' + 
                                  ') AS `Cumulative Sales` ' +
                           'FROM ' + `(${qryFdDelta}) AS pd ` +
                           `GROUP BY pd.game ORDER BY pd.price DESC;`     

        const resGameSales = await sql.query(qryGameSales);

        // format data
        for (const g of resGameSales) {
            g['Yearly Sales'] = `$${(g['Yearly Sales'] + Number.EPSILON).toFixed(2)}`;
            if (Math.sign(g['Price Delta']) === -1) {
                g['Price Delta'] = `-$${(Math.abs(g['Price Delta']) + Number.EPSILON).toFixed(2)}`;
            } else {
                g['Price Delta'] = `$${(g['Price Delta'] + Number.EPSILON).toFixed(2)}`;
            };
            g['Delta Pct Change'] = `${(g['Delta Pct Change'] + Number.EPSILON).toFixed(1)}%`
            g['Cumulative Sales'] = `$${(g['Cumulative Sales'] + Number.EPSILON).toFixed(2)}`
        };

        return resGameSales;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


module.exports = Purchase;