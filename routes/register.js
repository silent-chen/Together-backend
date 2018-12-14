// register
let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/register');

let moduleName="register.";

let post = function(req, res, next) {
    let functionName="post: ";

    console.log("this is the body",req.body);
    let data = req.body;
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);

    bo.register(data, context).then((result) => {
        res.status(201).json(result);
    }, (err) => {
        logging.error_message(moduleName+functionName + " error = ", err);
        res.status(401).json(err);
    })
};

exports.post = post;