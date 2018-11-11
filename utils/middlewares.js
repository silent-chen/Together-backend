const security = require('../utils/security');

// middleware for authorization
let authorize = function(req, res, next) {
    console.log("In authorize: Going to next.");
    console.log("Original URL = " + req.originalUrl);
    let claims = null;
    let authorized = false;
    console.log("token: ", req.headers);
    if (req.headers['authorization']) {
        console.log(req.headers['authorization']);
        claims = security.get_claims_from_token(req.headers['authorization']);
        console.log(claims);
        if (claims) {
            console.log("claims = " + JSON.stringify(claims));
            authorized= true;
        }
    }
    console.log("authorized: ", authorized);
    if(authorized || security.inWhitelist(req.originalUrl)) {
        next();
    }
    else {
        res.status(401).send("authorization fail!");
    }
};

exports.authorize = authorize;

// middleware for cors
// for CORS request
// add header and return for OPTIONS request
let cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    }
    else {
        //move on
        next();
    }
};

exports.cors = cors;