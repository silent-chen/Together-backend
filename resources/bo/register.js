const cbo = require('./customers');
const security = require('../../utils/security');
const return_codes = require('../../utils/return_codes');
const logging = require('../../utils/logging');
const notification = require('../../utils/notification');

let register = function(data, context) {
    return new Promise(function(resolve, reject) {
        cbo.retrieveByTemplate({username: data.username}).then(
            (result) => {
            if (result.length === 0){
                return cbo.retrieveByTemplate({email: data.email, method: data.method})
            }
            else {
                resolve("username exists")
            }
        })
            .then((result)=>{
                if (result.length === 0) {
                    console.log(data, context);
                    return cbo.create(data, context);
                }
                else {
                    resolve("email exists")
                }
            })
            .then(
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
    }
)};
exports.register = register;