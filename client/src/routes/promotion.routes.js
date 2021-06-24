/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const apiPm = require('../apis/promotion.api');


/* routes */
module.exports = app => {

    // game listing page
    app.get('/promotions', async (req, res, next) => {

        let page;

        // get page
        if (req.query.page) { 
            page = req.query.page; 
        } else {
            page = 1;
        };

        const promotions = await apiPm.findAll(page=page);
        res.render('promList', { promotions: promotions.results, pagination: promotions });
    });

};