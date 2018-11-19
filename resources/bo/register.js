const cbo = require('./customers');
const security = require('../../utils/security');
const return_codes = require('../../utils/return_codes');
const logging = require('../../utils/logging');
const notification = require('../../utils/notification');

let register = function(data, context) {
    return new Promise(function(resolve, reject) {
        cbo.create(data, context).then(
            function(c) {
                let claim = security.generate_customer_claims(c, context);
                let result = return_codes.codes.login_success;
                result.token = claim;
                result.username = c.username;
                resolve(result);
                notification.registrationNotification(data);
            },
            function(error) {
                logging.error_message("register bo.register: error = ",  error);
                reject(error);
            }
        )
    });
};

exports.register = register;