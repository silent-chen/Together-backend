const cbo = require('./customers');
const sandh = require('../../utils/salthash');
const security = require('../../utils/security');
const return_codes = require('../../utils/return_codes');
let logging = require('../../utils/logging');

let login = function(data, context) {
    let username = data.username;
    let pw = data.pw;
    let method = data.method;
    return new Promise(function(resolve, reject) {
        cbo.retrieveByTemplate({ username, method }).then(
            function(c) {
                if(c.length === 0) {
                    reject(return_codes.codes.login_failure);
                    return;
                }
                // We found a customer. This was query, which returned an array. Get 1st element.
                c = c[0];

                context.adminOperation = false;

                // Compare the hashed/salted value of the submitted password with the stored version.
                // If it matches, return a new JSON Web Token. We are also going to return the user ID
                // to enable forming a URL or lookup.
                if (sandh.compare(pw, c.pw)) {
                    let claim = security.generate_customer_claims(c, context);
                    let result = return_codes.codes.login_success;
                    result.token = claim;
                    result.username = c.username;
                    resolve(result);
                }
                else {
                    reject(return_codes.codes.login_failure);
                }
            },
            function(error) {
                context.adminOperation = false;
                logging.error_message("logonbo.login: error = ");
                console.log(error);
                reject(return_codes.codes.internal_error);
            }
        )
    });
};

exports.login = login;