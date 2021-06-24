/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const { NotFound } = require('../utils/httpException.util');


/*
    creates a pagination
*/
const paginate = async (req, res, next) => {
    try {
        // retrieve sql query results
        const data = req.data;

        // check if data is empty
        if (!data.length) { res.status(200).send( { "results": [] } ); }

        // check if user queried, otherwise send response as per normal
        if (req.query.page === undefined && req.query.limit === undefined) {
            res.status(200).send(data);
            return;
        };
        
        // get page number and limit
        const page = (typeof req.query.page === 'undefined') ? 1 : parseInt(req.query.page); // default 1
        const limit = (typeof req.query.limit === 'undefined') ? 5 : parseInt(req.query.limit); // default 5

        // index to slice JSON response
        const sIndex = (page - 1) * limit;
        const eIndex = page * limit;

        // JSON to store paginated data
        const results = {};

        /* pagination data */
        results.currentPage = page.toString();  // curent page
        results.totalPages = Math.ceil(data.length / limit).toString();  // total pages
        results.totalResults = data.length.toString();

        results.results = data.slice(sIndex, eIndex); // result data

        let queryParams = req.originalUrl.replace(/(limit=.+?&?)|(page=.+?&?)/g, '');
        results.url = queryParams
        
        if (!queryParams.endsWith('?') && !queryParams.endsWith('&')) { queryParams = queryParams + '&' };
        

        if (sIndex > 0) {
            if (page - 1 != 1 || page === 1) {
                results.firstPage = {               // first page
                    "page": "1",
                    "url": `${req.protocol}://${req.get('host')}${queryParams}page=${1}&limit=${limit}`
                };
            };
            results.previousPage = {                // previous page
                "page": (page - 1).toString(),
                "url": `${req.protocol}://${req.get('host')}${queryParams}page=${page - 1}&limit=${limit}`
            };
        };
        if (eIndex < data.length) {
            results.nextPage = {                    // next page
                "page": (page + 1).toString(),
                "url": `${req.protocol}://${req.get('host')}${queryParams}page=${page + 1}&limit=${limit}`
            };
            if (page + 1 != results.totalPages) {
                results.lastPage = {                // last page
                    "page": results.totalPages,
                    "url": `${req.protocol}://${req.get('host')}${queryParams}page=${results.totalPages}&limit=${limit}`
                };
            };
        };

        if (results.results.length) {
            res.status(200).send(results); // send response
        } else {
            throw new NotFound(`You've exceeded the maximum page! No more results found.`) // if page requested does not exist
        }

    } catch (err) {
        next(err, req, res, next); // if err, call error handling middleware
        return;
    }
}


module.exports = paginate;