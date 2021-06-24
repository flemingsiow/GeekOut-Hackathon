/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


//** const util = require('util'); // have to manually promisify

const mysql = require('mysql');
const dbConfig = require('../config/db.config');


/* create connection pool to db */
const pool = mysql.createPool(dbConfig);


/* promisifying connections and queries to use nodejs's async await */
const connection = () => {
    return new Promise((resolve, reject) => {

        // getConnection()
        pool.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                };
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                };
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                };
                reject(err);
            }
            console.log("MySQL Pool Connected: threadId " + connection.threadId);

            // .query()
            const query = (sql, params) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, params, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };

            // .beginTransaction()
            const beginTransaction = () => {
                return new Promise((resolve, reject) => {
                    if(err) reject(err);
                    console.log(`MYSQL Pool Transaction Started: threadId ${connection.threadId}`);
                    resolve(connection.beginTransaction());
                });
            };

            // .commit()
            const commit = () => {
                return new Promise((resolve, reject) => {
                    if(err) reject(err);
                    console.log(`MYSQL Pool Transaction Committed: threadId ${connection.threadId}`);
                    resolve(connection.commit());
                });
            };

            // .rollback()
            const rollback = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log(`MYSQL Pool Transaction Rollbacked: threadId ${connection.threadId}`);
                    resolve(connection.rollback());
                });
            };

            // .release()
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log(`MySQL Pool Released: threadId ${connection.threadId}`);
                    resolve(connection.release());
                });
            };

            resolve({ query, beginTransaction, commit, rollback, release });
        });
    });
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};


/* promisify for Node.js async/await */
/*pool.getConnection = util.promisify(pool.getConnection);
pool.query = util.promisify(pool.query);*/


module.exports = { pool, connection, query };