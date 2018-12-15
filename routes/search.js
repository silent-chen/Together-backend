let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/customers');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


let searchUsers =  function(req, res, next) {

    logging.debug_message("tenant  = ", req.tenant);
    logging.debug_message("params  = ", req.params);
    logging.debug_message("query  = ", req.query);

    let context = {tenant: req.tenant};
    let fields = {};
    try {
        if (req.query && req.query.fields) {
            fields = req.query.fields.split(',');
            delete req.query.fields;
        }

        logging.debug_message('customers.get: query = ', req.query);

        let searchItem = req.query.search;
        searchItem = '%' + searchItem + '%';
        console.log(searchItem);
        let template = {
            username: {
                [Op.like]: searchItem
            }
        };
        console.log(template);
        bo.retrieveByTemplate(template, fields, context).then(
            function (result) {
                logging.debug_message("bo.retrieveById: result = ", result);
                if (result) {
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
    }
    catch (e) {
        logging.error_message("e = " + e);
        res.status(500).send("Boom in getByQuery!", e);
    }
};


exports.searchUsers = searchUsers;






