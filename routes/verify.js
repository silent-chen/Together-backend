let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/customers');
let jwt = require('../utils/security');
let changeStatus = function(req, res, next){

    logging.debug_message("tenant  = ", req.tenant);
    logging.debug_message("params  = ", req.params);
    logging.debug_message("body  = ", req.body);

    let token = req.body.token;
    let user  = jwt.get_claims_from_token(token);
    let username = user.username;
    bo.update({username},{status:"VERIFIED"}).then(
        function (result) {
            if (result[0]) {
                res.status(200).json(result);
            }
            else {
                res.status(404).send("Not found!")
            }
        },
        function (error) {
            if (error.code && error.code === return_codes.codes.invalid_query.code) {
                res.status(400).send("You are a teapot.")
            }
            else {
                res.status(500).send("Internal error.");
            }
        }
    );

};

exports.changeStatus = changeStatus;
