
let jwt = require('jsonwebtoken');

// DO NOT EVER PUT SECRETS IN CODE.
let secret = "secret";

// This kind of stuff would be configured in some kind of DB.
// We are going to handle security more systematically later in the course.
// set as admin for all users right now
let get_roles = function(id) {
    return 'admin';
};

let generate_jwt = function(data, context) {
    let result = {};
    result.tenant_id = context.tenant;
    result.claims = data;

    result = jwt.sign(result, secret);
    return result;
};

exports.generate_customer_claims = function(c, context) {
    let result = {
        paths: ['/customers/' + c.username],
        email: c.email,
        username: c.username
    };
    result.roles = get_roles(c.id);
    result = generate_jwt(result, context);
    return result;
};

exports.get_claims_from_token = function(t) {
    return jwt.verify(t, secret);
};

let whiteList = [
    "",
    "login",
    "register",
    "customers",
    "oauth",
];

exports.inWhitelist = function(url) {
    let resource = url.split("/");
    console.log("resource = " + JSON.stringify(resource[2], null, 2));
    // here 1 is "api"
    if (whiteList.includes(resource[2]) || (resource[2].indexOf('?') >-1 && whiteList.includes(resource[2].split("?")[0]))) {
        console.log("URL on white list");
        return true;
    }
    return false;

};

let path_ok = function(url, claims) {
    if (claims.roles === 'admin') {
        return true;
    }
    if (claims && claims.claims && claims.claims.paths) {
        let p = claims.claims.paths;
        if (p.includes(url)) {
            return true;
        }
    }
    else {
        return false;
    }
};