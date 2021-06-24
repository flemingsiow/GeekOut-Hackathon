/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/**
 * formats query to only update the fields specified by user
 * 
 * @param {object} model contains the JSON request for a particular model (user, game etc.)
 */
exports.limitResult = async (query, tname = '') => {
    try {
        const conditions = [];
        const values = [];

        // if user passed in optional table name param
        if (tname) { tname = `${tname}.`; };

        if (query.sdate && query.edate) {
            conditions.push(`${tname}created_at BETWEEN ? AND ?`);
            values.push(query.sdate);
            values.push(query.edate);

        } else if (query.sdate) { conditions.push(`${tname}created_at >= ?`); values.push(query.sdate); 
        } else if (query.edate) { conditions.push(`${tname}created_at <= ?`); values.push(query.edate)};

        return { conditions, values };
    
    } catch (err) {
        // unknown err (500 Error)
        throw err;
    };
};