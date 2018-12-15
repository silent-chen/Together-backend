// register
let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/register');

let moduleName="register.";

let post = function(req, res, next) {
    let functionName="post: ";

    console.log(req.body);
    let data = req.body;
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);

    bo.register(data, context).then((result) => {
        console.log(result);
        if(typeof result === "string")
            res.status(200).send(result);
        else
            res.status(201).send(result);
    }, (err) => {
        logging.error_message(moduleName+functionName + " error = ", err);
        res.status(400).json(err);
    })
};

exports.post = post;