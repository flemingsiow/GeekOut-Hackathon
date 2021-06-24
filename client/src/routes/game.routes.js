/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const apiGm = require('../apis/game.api');
const apiRv = require('../apis/review.api');
const apiPf = require('../apis/platform.api');
const apiPm = require('../apis/promotion.api');


/* routes */
module.exports = app => {

    // game listing page
    app.route('/games')

        .get(async (req, res, next) => {
            
            try {
                if (req.session.search && req.query.page) { req.body = req.session.search; };

                // get page
                if (req.query.page) { 
                    req.body.page = req.query.page; 
                } else {
                    req.body.page = 1;
                };
                if (req.query.categories) { req.body.categories = req.query.categories; };
                
                const games = await apiGm.searchGms(req.body);
                const platforms = await apiPf.findAll();
                res.render('gameGrid', { games: games.results, search: req.body, pagination: games });

            } catch (err) {
                console.log(err);
                res.render('404')
            }
        })

        .post(async (req, res, next) => {
            
            req.session.search = req.body;

            // get page
            if (req.query.page) { 
                req.body.page = req.query.page; 
            } else {
                req.body.page = 1;
            };
            const games = await apiGm.searchGms(req.body);

            res.render('gameGrid', { games: games.results, search: req.body, pagination: games });
        });


    // game detail page
    app.get('/gamedetails/:gid', async (req, res, next) => {

        let page;

        // get page
        if (req.query.page) { 
            page = req.query.page; 
        } else {
            page = 1;
        };

        const game = await apiGm.fdGmById(req.params.gid);
        const ratings = await apiRv.gtRatings(req.params.gid);
        const reviews = await apiRv.gtReviews(req.params.gid, page);
        const promotion = await apiPm.fdPmByGid(req.params.gid);

        res.render('gameDetails', { game: game, promotion: promotion, ratings: ratings, reviews: reviews.results, pagination: reviews });
    });

};