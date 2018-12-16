const bo = require("./customers");
const security = require("../../utils/security");
const return_codes = require("../../utils/return_codes");
exports.checkCustomer = function(data, site, context){
    return new Promise((resolve, reject) => {
        console.log(data);
        let email = data.email;
        let method = site;
        let username = data.username;
        bo.retrieveByTemplate({email, method}).then(
            (result) => {
                if (result.length === 0){
                    return bo.retrieveByTemplate({username});
                }
                else {
                    data.username = result[0].username;
                    let claim = security.generate_customer_claims(data, context);
                    let user = return_codes.codes.login_success;
                    user.token = claim;
                    user.username = result[0].username;
                    resolve(user);
                }
            }
        ).then( (result) => {
                if(!Array.isArray(result))
                    return;
                if(result.length === 0) {
                    data.pw = '123';
                    data.method = site;
                    bo.create(data,context).then((result) => {
                        let claim = security.generate_customer_claims(result, context);
                        let user = return_codes.codes.login_success;
                        user.token = claim;
                        user.username = result.username;
                        resolve(user);
                    }, (err) => {
                        reject(err)
                    } );
                }
                else {
                    let user = {username, email, method};
                    resolve(user);
                }
            }
        )
    })
};