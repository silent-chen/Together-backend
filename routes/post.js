let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/post');

let moduleName="post.";

let search = function(req, res, next) {
    let functionName="getByUsername";

    logging.debug_message(moduleName+functionName + " tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + " query  = ", req.query);

    let users = JSON.parse(req.query.users);
    logging.debug_message(moduleName+functionName + " users  = ", req.users);
    bo.search({users}).then((result) => {
        res.status(200).json(result.Items);
    }, (err) => {
        console.log(err);
        res.status(500).send("Internal error.");
    })
};

let getByUsername =  function(req, res, next) {
    let functionName="getByUsername";

    logging.debug_message(moduleName+functionName + " tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + " params  = ", req.params);

    bo.getByUsername(req.params.username).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        console.log(err);
        res.status(500).send("Internal error.");
    })
};

let post = function(req, res, next) {

    let functionName="post:";

    let data = req.body;

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);
    try {
        bo.create(data).then(
            function(result) {
                if (result) {
                    console.log(result);
                    res.status(201).json(result);
                }
            },
            function(error) {
                console.log(error);
                res.status(500).send("Internal error")
            }
        );
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal error");
    }


};

let del = function(req, res, next) {

};

exports.search = search;
exports.getByUsername = getByUsername;
exports.post = post;
exports.del = del;







