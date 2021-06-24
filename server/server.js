/*

                Name:  Fleming Siow Yi
       Serial Number:  4
               Class:  DAAA/FT/1B/03
    Admission Number:  p2011828
    
*/
'use strict';


/* express framework */
const express = require('express');
const app = express();

/* configs */
const { host, port } = require('./config/env.config');

/* enable CORS */
const cors = require("cors");
app.use(cors());

/* session authentication */
const session = require('express-session');
app.use(session({
    name: 'sid', 
    resave: false,
    saveUninitialized: false,
    secret: 'sshsecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1000 milliseconds = 1 second
        sameSite: true, // 'strict'
        secure: true
    }
}));


/* utils(helper) functions */
const { NotFound } = require('./utils/httpException.util');

/* middlewares */
app.use(express.json());                                                        // parse appilcation/json data
app.use(express.urlencoded({ extended: true }));                                // parse strings/arrays 
app.use(require('./middleware/logging.middleware'));                            // logging requests
app.use(require('./middleware/resetIncrement.middleware').resetAutoIncrement);  // reset auto increment

require("./routes/user.routes")(app);                                           // map routes
require("./routes/review.routes")(app);
require("./routes/category.routes")(app);
require("./routes/game.routes")(app);
require("./routes/image.routes")(app);
require("./routes/purchase.routes")(app);
require("./routes/cart.routes")(app);
require("./routes/transaction.routes")(app);
require("./routes/promotion.routes")(app);


// start server
app.listen(port, () => {
    console.log(`Server is Listening on http://${host}:%s`, port);
});

// test route
app.get("/", (req, res, next) => {
    // res.send({ "Message": "Welcome to Fleming's BED CA1 RestAPI Express Server!" });
    res.send(req.session);
});

app.all('*', (req, res, next) => {                                              // if requested route does not exist
    next(new NotFound(`Can't find ${req.originalUrl} on this server!`)); 
});


app.use(require('./middleware/error.middleware'));                              // error handling




