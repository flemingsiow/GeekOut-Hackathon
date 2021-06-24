/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


const express = require('express');
const session = require('express-session');
const router = express.Router();
const app = express();


/* apis */
const apiGm = require('./apis/game.api');
const apiPf = require('./apis/platform.api');
const apiPm = require('./apis/promotion.api');
const apiCt = require('./apis/category.api');


/* configs */
const { port, portServer, host } = require('../config/env.config');


/* view engine */
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);


/* middlewares */
const cors = require('cors');
app.use(cors());


app.use(session({
    secret: 'supersecretbedclientkey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(async (req, res, next) => {

    // baseurl
    res.locals.baseUrl = `${host}:${portServer}`;

    // common storage
    res.locals.games = await apiGm.findAll();
    res.locals.categories = await apiCt.findAll();
    res.locals.platforms = await apiPf.findAll();
    res.locals.promotions = await apiPm.findAll();
    res.locals.acproms = await apiPm.findAllAc();
    res.locals.previous = req.headers['referer'];

    // req session
    if (req.session.token && req.session.user) {
        res.locals.user = req.session.user;
        res.locals.token = req.session.token;

    } else {
        res.locals.user = {};
        res.locals.token = null;
    };

    // err
    if (!res.locals.error) {
        res.locals.error = null;
    };
    next();
});

app.use(express.json());                                                        // parse appilcation/json data
app.use(express.urlencoded({ extended: true }));                                // parse strings/arrays 

app.use('/assets', express.static(`${__dirname}/public/`));
app.use('/assetsAdmin', express.static(`${__dirname}/public/admin_section/`))


/* start server */
app.listen(port, () => {
    console.log(`Client Server is Listening on ${host}:%s`, port);
});


/* pages */
app.get('/', async (req, res, next) => {        // home page
    const games = await apiGm.findAll();
    const topGms = await apiGm.gtTopGms();
    const promotions = await apiPm.findAll();
    res.render('index', { games: games.slice(0, 5), topGms: topGms, promotions: promotions.slice(0, 4) });
});

app.get('/404', async (req, res, next) => {     // 404 page
    res.render('404');
});


require('./routes/user.routes')(app);
require('./routes/game.routes')(app);
require('./routes/admin.routes')(router); app.use('/dashboard', router);
require('./routes/transaction.routes')(app);
require('./routes/promotion.routes')(app);


app.all('*', (req, res, next) => {                                              // if requested route does not exist
    res.redirect('/404');
});





