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
exports.updateFields = async (model) => {
    let qUpdate = ``, qParams = [];

    // loop thru each key and check if its value is undefined
    Object.keys(model).forEach((key) => {
        // if it's not, add into query
        if (model[key] != undefined) {
            qUpdate += `${key} = ?, `;
            qParams.push(model[key]);
        };
    });
    qUpdate = qUpdate.slice(0, -2); // remove the comma and space for the last field

    return { qUpdate, qParams };
}