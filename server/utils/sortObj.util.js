/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/**
 * sorts/arranges the [key, value] pairs of an object or JSON
 * 
 * @param {object} obj contains the original object to be sorted
 * @param {object} order is an array of the keys in the order to be sorted
 */
exports.preferredOrder = async (obj, order) => {
    let newObject = {};
    for(let i = 0; i < order.length; i++) {
        if(obj.hasOwnProperty(order[i])) {
            newObject[order[i]] = obj[order[i]];
        };
    };
    return newObject;
};