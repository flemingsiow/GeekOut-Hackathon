/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';

const apiGm = require('../apis/game.api');
const apiPm = require('../apis/promotion.api');
const apiCt = require('../apis/category.api');
const apiUsr = require('../apis/user.api');


/* routes */
module.exports = router => {


    /* middleware for admin dashboard */
    router.use('/', async (req, res, next) => {

        console.log(`Admin Dashboard Logged: ${Date.now()}`);
        res.locals.page = req.url;

        // prevents users without tokens and admin rights to access this route
        if (!req.session.token || req.session.user.type !== 'Admin') {
            res.redirect('/')

        } else {
            next();
        }
    });

    // dashboard
    router.get('/', async (req, res, next) => {
        const dateNow = new Date();
        const signUpStats = await apiUsr.gtUsrSUStats(dateNow.getMonth() + 1, dateNow.getFullYear(), req.session.token);
        res.render('admin/dashboard', { stats: signUpStats });
    });


    // dashboard game listings
    router.get('/gamelist', async (req, res, next) => {

        // get page
        if (req.query.page) { 
            req.body.page = req.query.page; 
        } else {
            req.body.page = 1;
        };

        const games = await apiGm.searchGms(req.body, 5);
        res.render('admin/gameList',  { games: games.results, pagination: games });
    });

    // dashboard category listings
    router.get('/catlist', async (req, res, next) => {
        res.render('admin/catList');
    });

    // dashboard promotion listings
    router.get('/promlist', async (req, res, next) => {
        const promotions = await apiPm.findAll(null, null, 'yes');
        res.render('admin/promList', { promotions: promotions });
    });


    // dashboard post game
    router.get('/addgame', async (req, res, next) => {
        res.render('admin/addGame');
    });
    
    // dashboard post category
    router.get('/addcat', (req, res, next) => {
        res.render('admin/addCat')
    });

    // dashboard post promotion 
    router.get('/addprom', async (req, res, next) => {
        const games = await apiGm.findAll();
        res.render('admin/addProm', { games: games });
    });

    // dashboard update game by their id
    router.get('/updategame/:gid', async (req, res, next) => {
        res.render('admin/updateGame')
    });

    // dashboard update category by their id
    router.get('/updatecat/:cid', async (req, res, next) => {
        res.render('admin/updateCat')
    });

    // dashboard update promotion by their id
    router.get('/updateprom/:pid', async (req, res, next) => {

        const promotionid = req.originalUrl.split('/').slice(-1)[0].split('?')[0].split('#')[0];
        res.render('admin/updateProm', { pid: promotionid })
    });

};