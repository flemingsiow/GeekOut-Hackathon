/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require('../utils/mysql.util');
const sortObj = require('../utils/sortObj.util');
const upSelect = require('../utils/sqlQueries/updateSelection');
const { NotFound, UnprocessableEntity } = require('../utils/httpException.util');
const queryRes = require('../utils/sqlQueries/limitResult');


/** @class Game representing a game */
class Game {
    /**
     * creates an instance of a game
     * 
     * @constructor
     * @param {object} game contains the properties of the game
     */
    constructor(game) {
        this.title = game.title;
        this.description = game.description;
        this.price = game.price;
        this.platform = game.platform;
        this.gamepic = game.gamepic;
        this.catids = game.categoryids;
        this.year = game.year;
    };
};




/**
 * get all games in the db
 */
Game.getAll = async (query) => {
    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        // to store query results
        let gameArr = [];

        // retrieve all the gameids in the database
        let qryFdGms = `SELECT game.gameid, category.catname, promotion.discount
                        FROM gamecategory
                        INNER JOIN game USING (gameid)
                        INNER JOIN category USING (categoryid)
                        LEFT JOIN promotion USING (gameid)`;

        // retrieve sql queries for query params
        const { conditions, values } = await queryRes.limitResult(query, 'game')
        if (query.search) { conditions.push(`game.title LIKE ?`); values.push(`%${query.search}%`); };
        if (query.maxPrice) { conditions.push(`game.price <= ?`); values.push(parseFloat(query.maxPrice)); };
        if (query.categories) { conditions.push(`category.categoryid IN (?)`); values.push(query.categories.split(',')); };
        if (query.platform) { conditions.push(`game.platform = ?`); values.push(query.platform); };
        if (query.syear) { conditions.push(`game.year >= ?`); values.push(query.syear); };
        if (query.eyear) { conditions.push(`game.year <= ?`); values.push(query.eyear); };
        qryFdGms += (conditions.length ? (` WHERE ${conditions.join(' AND ')}`) : '');

        qryFdGms += ` GROUP BY game.gameid ORDER BY game.created_at DESC;`;

        const resFdGms = await dbConn.query(qryFdGms, values);

        // retrieves all the catid and catname for every gameid in the database (gamecategory and category TABLE)
        const qryFdCat = `SELECT gamecategory.categoryid AS catid, category.catname
                          FROM gamecategory
                          INNER JOIN category USING (categoryid)
                          WHERE gamecategory.gameid = ?;`;

        // same for all the imageid, imgname (image TABLE)
        const qryFndImg = `SELECT imageid AS imgid, imgname
                           FROM image 
                           WHERE gameid = ?;`;

        // retrieves game's details for every gameid in the database (game TABLE)
        const qryGetGmsInfo = `SELECT game.gameid, game.title, game.description, game.price, game.platform, 
                                    game.year, DATE_FORMAT(game.created_at, "%Y-%m-%d %T") AS created_at, game.gamepic,
                                    ROUND(AVG(review.rating), 1) AS avg, COUNT(review.reviewid) AS cnt,
                                    CASE WHEN ROUND(AVG(review.rating), 1) >= 4.5 THEN 'Excellent'
                                         WHEN ROUND(AVG(review.rating), 1) >= 3.5 THEN 'Great'
                                         WHEN ROUND(AVG(review.rating), 1) >= 2.5 THEN 'Decent'
                                         WHEN ROUND(AVG(review.rating), 1) >= 1.5 THEN 'Poor'
                                         WHEN COUNT(review.reviewid) = 0 THEN 'N/A'
                                         ELSE 'Terrible'
	                                END AS rating_text
                               FROM game 
                               LEFT JOIN review USING (gameid)
                               WHERE game.gameid = ?;`;

        // loop the 3 queries for each gameid
        for (const i in resFdGms) {
            const resCat = await dbConn.query(qryFdCat, resFdGms[i].gameid);
            const resImg = await dbConn.query(qryFndImg, resFdGms[i].gameid);
            let resFdGmsInfo = await dbConn.query(qryGetGmsInfo, resFdGms[i].gameid);

            // append the category and images along with game
            resFdGmsInfo[0]['categories'] = resCat;
            resFdGmsInfo[0]['images'] = resImg;

            // reorder JSON
            const sortedGmInfo = await sortObj.preferredOrder(resFdGmsInfo[0],
                ['gameid', 'title', 'description', 'price', 'platform', 'gamepic', 'avg', 'cnt', 'rating_text',
                    'categories', 'images', 'year', 'created_at']);
            gameArr.push(sortedGmInfo);
        };
        return gameArr;

    } catch (err) {
        // unknown err (500 Error)
        throw err;

    } finally {
        dbConn.release(); // release connection when you get a connection
    };
};


/**
 * find all platforms listed in the db
 */
Game.findPlatforms = async () => {
    try {
        const qryFdPfs = `SELECT DISTINCT platform FROM spgames.game;`;

        const resFdPfs = await sql.query(qryFdPfs);

        return resFdPfs;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    }
};


/**
 * find game in the db by their id(gameid)
 * 
 * @param {number} gameid contains the id of the user to search by
 */
Game.findById = async (gameid) => {
    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        // retrieves all the categoryid and catname for the specified gameid (gamecategory and category TABLE)
        const qryFdCatByGid = `SELECT gamecategory.categoryid AS catid, category.catname
                               FROM gamecategory
                               INNER JOIN category ON gamecategory.categoryid = category.categoryid
                               WHERE gamecategory.gameid = ?;`;

        // same for all the imageid, imgname (image TABLE)
        const qryFndImgByGid = `SELECT imageid AS imgid, imgname, imgdesc
                                FROM image 
                                WHERE gameid = ?;`;

        // retrieves game's details (game TABLE)
        const qryGetGmInfoByGid = `SELECT game.gameid, game.title, game.description, game.price, game.platform, 
                                           game.year, DATE_FORMAT(game.created_at, "%Y-%m-%d %T") AS created_at, game.gamepic,
                                           DATE_FORMAT(game.updated_at, "%Y-%m-%d %T") AS updated_at,
                                           ROUND(AVG(review.rating), 1) AS avg, COUNT(review.reviewid) AS cnt,
                                           CASE WHEN ROUND(AVG(review.rating), 1) >= 4.5 THEN 'Excellent'
                                               WHEN ROUND(AVG(review.rating), 1) >= 3.5 THEN 'Great'
                                               WHEN ROUND(AVG(review.rating), 1) >= 2.5 THEN 'Decent'
                                               WHEN ROUND(AVG(review.rating), 1) >= 1.5 THEN 'Poor'
                                               WHEN COUNT(review.reviewid) = 0 THEN 'N/A'
                                               ELSE 'Terrible'
                                           END AS rating_text
                                   FROM game 
                                   LEFT JOIN review USING (gameid)
                                   WHERE game.gameid = ?;`;


        const resCatByGid = await dbConn.query(qryFdCatByGid, gameid);
        const resImgByGid = await dbConn.query(qryFndImgByGid, gameid);
        let resFdGmInfoByGid = await dbConn.query(qryGetGmInfoByGid, gameid);

        // check if gameid exists in db (404 Error)
        if (resFdGmInfoByGid.length === 0) {
            throw new NotFound(`No Game found with the id ${gameid}.`);
        };

        // append the category and images along with game
        resFdGmInfoByGid[0]['categories'] = resCatByGid;
        resFdGmInfoByGid[0]['images'] = resImgByGid;

        // reorder JSON
        const sortedGmInfo = await sortObj.preferredOrder(resFdGmInfoByGid[0],
            ['gameid', 'title', 'description', 'price', 'platform', 'gamepic', 'avg', 'cnt', 'rating_text',
                'categories', 'images', 'year', 'created_at', 'updated_at']);


        return sortedGmInfo;

    } catch (err) {
        // unknown err (500 Error)
        throw err;

    } finally {
        dbConn.release(); // release connection when you get a connection
    };
};


/**
 * find games in the db by their platform
 * 
 * @param {object} platform is the platform the user wants to search games by
 */
Game.findByPlatform = async (platform) => {
    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        // to store query results
        let gameArr = [];

        // retrieve all the gameids by their platform (game TABLE)
        const qryFdGmsByPf = `SELECT gameid 
                              FROM game 
                              WHERE platform = ?;`;
        const resFdGmsByPf = await dbConn.query(qryFdGmsByPf, platform);


        // retrieves all the catid and catname for each gameid retrieved above in the query (gamecategory and category TABLE)
        const qryFdCatByPf = `SELECT gamecategory.categoryid AS catid, category.catname
                              FROM gamecategory
                              INNER JOIN category ON gamecategory.categoryid = category.categoryid
                              WHERE gamecategory.gameid = ?;`;

        // same for all the imageid, imgname (image TABLE)
        const qryFndImgByPf = `SELECT imageid AS imgid, imgname
                               FROM image 
                               WHERE gameid = ?;`;

        // retrieves game's details for each gameid (game TABLE)
        const qryGetGmsInfoByPf = `SELECT game.gameid, game.title, game.description, game.price, game.platform, 
                                    game.year, DATE_FORMAT(game.created_at, "%Y-%m-%d %T") AS created_at
                                   FROM game 
                                   WHERE game.gameid = ?;`;

        // loop the 3 queries for each gameid
        for (const i in resFdGmsByPf) {
            const resCatByPf = await dbConn.query(qryFdCatByPf, resFdGmsByPf[i].gameid);
            const resImgByPf = await dbConn.query(qryFndImgByPf, resFdGmsByPf[i].gameid);
            let resFdGmsInfoByPf = await dbConn.query(qryGetGmsInfoByPf, resFdGmsByPf[i].gameid);

            // append the category and images along with game
            resFdGmsInfoByPf[0]['categories'] = resCatByPf;
            resFdGmsInfoByPf[0]['images'] = resImgByPf;

            // reorder JSON
            const sortedGmInfo = await sortObj.preferredOrder(resFdGmsInfoByPf[0],
                ['gameid', 'title', 'description', 'price', 'platform', 'categories', 'images', 'year', 'created_at']);
            gameArr.push(sortedGmInfo);
        };
        return gameArr;

    } catch (err) {
        // unknown err (500 Error)
        throw err;

    } finally {
        dbConn.release(); // release connection when you get a connection
    };
};


/**
 * inserts a new game into the db
 * 
 * @param {object} game contains the properties of the new game
 */
Game.create = async (game) => {
    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        // split catids into separate var
        let catids = game.catids;
        delete game.catids;

        // transactions prevents db from containing results of partial operations
        await dbConn.beginTransaction();


        /* SQL QUERY */
        // insert game (game TABLE)
        const qryInsertGm = `INSERT INTO game 
                             SET ?;`;
        const resNewGm = await dbConn.query(qryInsertGm, game);

        // links gameid to categoryids (gamecategory TABLE)
        const qryInsertGC = `INSERT INTO gamecategory (gameid, categoryid) 
                             VALUES (?, ?);`;
        for (const i in catids) {
            await dbConn.query(qryInsertGC, [resNewGm.insertId, parseInt(catids[i])]);
        };

        // if no err, execute all queries
        await dbConn.commit();

        return resNewGm;

    } catch (err) {
        // if err, rollback all queries
        await dbConn.rollback();

        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/key '.*'$/g).toString().replace(/^key /g, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;

    } finally {
        dbConn.release(); // release connection when you get a connection
    };
};


/**
 * remove game by their id(gameid)
 * 
 * @param {object} gameid contains the id of the game to be deleted
 */
Game.remove = async (gameid) => {
    try {
        const qryDelGmById = `DELETE FROM game 
                              WHERE gameid = ?;`;
        const resDelGmById = await sql.query(qryDelGmById, gameid);

        // check if gameid exists in db (404 Error)
        if (resDelGmById.affectedRows === 0) {
            throw new NotFound(`No Game found with the id ${gameid}`);
        }
        return resDelGmById;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * update game by their id(gameid)
 * 
 * @param {number} gameid contains the id of the game to be updated
 * @param {object} game contains the new properties of the game
 */
Game.updateById = async (gameid, game) => {

    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        // split catids into separate var
        let catids = game.catids;
        delete game.catids;

        // update selected fields
        const { qUpdate, qParams } = await upSelect.updateFields(game);

        // transactions prevents db from containing results of partial operations
        await dbConn.beginTransaction();

        if (qParams.length != 0) {
            /* SQL QUERY */
            // update game (game TABLE)
            const qryUpdGmById = `UPDATE game 
                                  SET ${qUpdate}
                                  WHERE gameid = ?;`;
            const resUpdGmById = await dbConn.query(qryUpdGmById, [...qParams, gameid]);

            // check if gameid exists in db (404 Error)
            if (resUpdGmById.affectedRows === 0) {
                throw new NotFound(`No Game found with the id ${gameid}`);
            };

        };

        // insert changed categoryids (gamecategory TABLE)
        const qryInsertGC = `INSERT INTO gamecategory (gameid, categoryid)
                             SELECT * FROM (SELECT ? as gameid, ? as categoryid) AS tmpValues
                             WHERE NOT EXISTS (
                                SELECT gameid FROM gamecategory WHERE gameid = ? AND categoryid = ?
                             );`; // NOTE: Composite Keys is much simpler, but I rather keep it to a single Primary Key

        for (const i in catids) { // loop through the query for each catid
            await dbConn.query(qryInsertGC, [gameid, parseInt(catids[i]), gameid, parseInt(catids[i])]);
        };

        // delete records that no longer reflect the updated game (gamecategory TABLE)
        const qryDelGC = `DELETE FROM gamecategory 
                          WHERE categoryid NOT IN (${catids.join(', ')}) AND gameid = ?;`;
        await dbConn.query(qryDelGC, gameid);


        // if no err, execute all queries
        await dbConn.commit();

        return;

    } catch (err) {
        // if err, rollback all queries
        await dbConn.rollback();

        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/key '.*'$/g).toString().replace(/^key /g, '');
            throw new UnprocessableEntity(`The ${dupe} provided already exists.`);
        };
        // unknown err (500 Error)
        throw err;

    } finally {
        dbConn.release(); // release connection when you get a connection
    };
};


module.exports = Game;
