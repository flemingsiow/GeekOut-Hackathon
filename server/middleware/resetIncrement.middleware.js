/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const sql = require("../utils/mysql.util");


/*
    resets the AUTO_INCREMENT of the PRIMARY KEY for every table every time a non GET request is made
    NOTE: Preferably, I recommend NOT to do this outside the debugging stages since a PRIMARY KEY should not 
          be updatable in theory. It's meant to be a unique identifier for each record, so messing with it can cause
          the system to break. The only reason I used it here was to simplify the debugging and testing processes.
*/
const resetAutoIncrement = async (req, res, next) => {
    try {
        let tables = ['user', 'category', 'game', 'gamecategory', 'review', 'image', 'purchase', 'cart', 'transaction']
        let priKey = ['userid', 'categoryid', 'gameid', 'gamecategoryid', 'reviewid', 'imageid', 'purchaseid', 'cartid', 'transactionid']
        
        if (req.method != 'GET') {
            await sqlResetIncrement(tables, priKey);
        };
        
        // log successful message to console
        console.log(`AUTO_INCREMENT Resetted Successfully!`);

        next();

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    };
};


/*
    sql logic for resetting the AUTO_INCREMENT of the PRIMARY KEY
*/
const sqlResetIncrement = async (tables, priKey) => {
    // pool.getConnection() for stateful queries
    const dbConn = await sql.connection();

    try {
        for (const i in tables) {
            const maxKey = await dbConn.query(`SELECT MAX(${priKey[i]})+1 FROM spgames.${tables[i]};`);
            let maxKeyVal = await maxKey[0]['MAX(userid)+1']
            if (maxKeyVal === null || maxKeyVal === undefined) maxKeyVal = 1;

            await dbConn.query(`ALTER TABLE spgames.${tables[i]} AUTO_INCREMENT=${maxKeyVal};`);
        };

    } catch (err) {
        throw err;

    } finally {
        dbConn.release();
    };
};


module.exports = { resetAutoIncrement, sqlResetIncrement };

