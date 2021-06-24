/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");
const { NotFound, UnprocessableEntity } = require('../utils/httpException.util');


/** @class Review representing a review */
class Review {
    /**
     * creates an instance of a review
     * 
     * @constructor
     * @param {object} review contains the properties of the review
     * @param {number} userid contains the id of the user that posted the review
     * @param {number} gameid contains the id of the game the review is posted for
     */
    constructor(review, userid, gameid) {
        this.content = review.content;
        this.rating = review.rating;
        this.userid = userid;
        this.gameid = gameid;
    };
};




/**
 * find review in the db by their id(reviewid)
 * 
 * @param {number} reviewid contains the id of the review to search by
 */
Review.findById = async (reviewid) => {
    try {
        const qryFdRvById = `SELECT review.reviewid, review.gameid, review.userid, game.title AS 'game_title', 
                                    user.username, review.content, review.rating, game.title,
                                    DATE_FORMAT(review.created_at, "%Y-%m-%d %T") AS created_at
                             FROM ((review 
                             INNER JOIN game ON review.gameid = game.gameid)
                             INNER JOIN user ON review.userid = user.userid)
                             WHERE reviewid = ?;`;
        const resFdRvById = await sql.query(qryFdRvById, reviewid);

        // check if reviewid exists in db (404 Error)
        if (resFdRvById.length === 0) {
            throw new NotFound(`No Review found with the id ${reviewid}.`);
        };
        return resFdRvById[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find all reviews in the db by their gameid
 * 
 * @param {number} gameid contains the id of the game to search the reviews by
 */
Review.findReviewsByGameId = async gameid => {
    try {
        const qryFdRvsByGid = `SELECT review.gameid, review.content, review.rating, user.username,
                                    user.profile_pic_url, 
                                    DATE_FORMAT(review.created_at, "%Y-%m-%d %T") AS created_at
                               FROM review 
                               INNER JOIN user ON review.userid = user.userid
                               WHERE review.gameid = ?
                               ORDER BY review.created_at DESC;`; 
        const resFdRvsByGid = await sql.query(qryFdRvsByGid, gameid);

        // check if any reviews were posted under the gameid from db (404 Error)
        // if (resFdRvsByGid.length === 0) {
        //     throw new NotFound(`No Review found with the Game id ${gameid}.`);
        // };


        for (const i in resFdRvsByGid) {
            resFdRvsByGid[i].gameid = resFdRvsByGid[i].gameid.toString();
        }


        return resFdRvsByGid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * find all reviews in the db by their gameid
 * 
 * @param {number} gameid contains the id of the game to search the reviews by
 */
Review.findAvgRatingByGameId = async gameid => {
    try {

        const qryFdAvgRvsByGid = `SELECT ROUND(AVG(rating), 2) AS avg, COUNT(reviewid) AS cnt
                                  FROM review
                                  WHERE gameid = ?;`;

        const resFdAvgRvsByGid = await sql.query(qryFdAvgRvsByGid, gameid);

        // check if any reviews were posted under the gameid from db (404 Error)
        // if (resFdAvgRvsByGid.length === 0) {
        //     throw new NotFound(`No Review found with the Game id ${gameid}.`);
        // };

        return resFdAvgRvsByGid[0];

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * gets the average reviews over time, partitioned by game
 */
Review.getRatingStats = async (gid, yr) => {
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
        let qryRtByGm = 'SELECT game.title AS Game, ' +
            'ROUND(AVG(rating)) AS `Average Rating`, ' +
            'COUNT(*) AS `Total Reviews`, ' +
            'COUNT(CASE WHEN `rating` = 5 THEN 1 END) AS `5 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 5 THEN 1 END) / COUNT(*) * 100, 1) AS `5 Star (%)`, ' +
            'COUNT(CASE WHEN `rating` = 4 THEN 1 END) AS `4 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 4 THEN 1 END) / COUNT(*) * 100, 1) AS `4 Star (%)`, ' +
            'COUNT(CASE WHEN `rating` = 3 THEN 1 END) AS `3 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 3 THEN 1 END) / COUNT(*) * 100, 1) AS `3 Star (%)`, ' +
            'COUNT(CASE WHEN `rating` = 2 THEN 1 END) AS `2 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 2 THEN 1 END) / COUNT(*) * 100, 1) AS `2 Star (%)`, ' +
            'COUNT(CASE WHEN `rating` = 1 THEN 1 END) AS `1 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 1 THEN 1 END) / COUNT(*) * 100, 1) AS `1 Star (%)`, ' +
            'COUNT(CASE WHEN `rating` = 0 THEN 0 END) AS `0 Star`, ' +
            'ROUND(COUNT(CASE WHEN `rating` = 0 THEN 0 END) / COUNT(*) * 100, 1) AS `0 Star (%)` ' +
            'FROM review ' +
            'INNER JOIN game USING (gameid)';

        let resRtByGm;
        if (yr) {
            qryRtByGm = qryRtByGm + ' WHERE YEAR(review.created_at) = ?' +
                ' GROUP BY gameid;';
            resRtByGm = await sql.query(qryRtByGm, yr);

        } else if (gid) {
            qryRtByGm = qryRtByGm + ' WHERE gameid = ?';
            resRtByGm = await sql.query(qryRtByGm, gid);
            
        } else {
            qryRtByGm = qryRtByGm + ' GROUP BY gameid;';
            resRtByGm = await sql.query(qryRtByGm);
        };
        
        // format and conver to string
        for (const r of resRtByGm) {
            r['5 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['5 Star (%)'].toFixed(1)}`) : 0.0;
            r['4 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['4 Star (%)'].toFixed(1)}`) : 0.0;
            r['3 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['3 Star (%)'].toFixed(1)}`) : 0.0;
            r['2 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['2 Star (%)'].toFixed(1)}`) : 0.0;
            r['1 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['1 Star (%)'].toFixed(1)}`) : 0.0;
            r['0 Star (%)'] = (r['Total Reviews'] != 0) ? (`${r['0 Star (%)'].toFixed(1)}`) : 0.0;
        };

        return resRtByGm;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * insert a new review into db under a userid and gameid
 * 
 * @param {object} review contains the properties of the new review
 */
Review.create = async review => {
    try {
        const qryInsertRv = `INSERT INTO review
                             SET ?;`;
        const resNewRv = await sql.query(qryInsertRv, review);
        return resNewRv;

    } catch (err) {
        // check for duplicate err (422 Error)
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            let dupe = err.sqlMessage.match(/key '.*UNIQUE/gi).toString().replace(/^key '/gi, '').replace(/.UNIQUE$/gi, '');
            throw new UnprocessableEntity(`You already posted a review for this game!`);
        };
        // unknown err (500 Error)
        throw err;
    };
};


/**
 * Removes review by gameid and userid
 * 
 * @param {number} uid contains the id of the user of the review to be removed
 * @param {number} gid contains the id of the game of the review to be removed
 */
Review.rmByUidGid = async (uid, gid) => {
    try {
        const qryRmByUidGid = `DELETE FROM review WHERE userid = ? AND gameid = ?;`;
        const resRmByUidGid = await sql.query(qryRmByUidGid, [uid, gid]);
        return resRmByUidGid;

    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};



module.exports = Review;