let express = require('express');

let logging = require('../utils/logging');
let return_codes = require('../utils/return_codes');
let bo = require('../resources/bo/customers');

let moduleName="customers.";

let post = function(req, res, next) {

    let functionName="post:";  // ???

    let data = req.body;
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);

    bo.create(data, context).then(
        function(result) {
            if (result) {
                // !!!!!!!
                // Need to get ID to form URL.
                res.status(201).json(result);
            }
        },
        function(error) {
            logging.debug_message(moduleName+functionName + " error = " + error);
            if (error.code && error.code === return_codes.codes.invalid_query.code) {
                res.status(400).send("You are a teapot.")
            }
            else {
                res.status(500).send("Internal error.");
            }
        }
    );

};


let getById = function(req, res, next) {


    let functionName="get_by_id:";

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "params  = ", req.params);

    // Extract the tenant from the HTTP header.
    let context = {tenant: req.tenant};
    let fields = null;

    try {
        if (req.query && req.query.fields) {
            fields = req.query.fields.split(',');
            delete req.query.fields;
        }
        else {
            fields = ['*']
        }

        bo.retrieveById(req.params.id, fields, context).then(
            function(result) {
                //logging.debug_message("bo.retrieveById: result = ", result);
                if (result) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).send("Not found!")
                }
            },
            function(error) {
                logging.debug_message("customers.get: error = " + error);
                if (error.code && error.code === return_codes.codes.invalid_query.code) {
                    res.status(400).send("You are a teapot.")
                }
                else {
                    res.status(500).send("Internal error.");
                }
            }
        );
    }
    catch( e) {
        logging.error_message("e = " + e);
        res.status(500).send("Boom!");
    }

};

let getByQuery =  function(req, res, next) {

    logging.debug_message("tenant  = ", req.tenant);
    logging.debug_message("params  = ", req.params);
    logging.debug_message("query  = ", req.query);

    context = {tenant: req.tenant};

    let fields = [];
    try {
        if (req.query && req.query.fields) {
            fields = req.query.fields.split(',');
            delete req.query.fields;
        }
        else {
            fields = {}
        }

        logging.debug_message('customers.get: query = ', req.query);

        bo.retrieveByTemplate(req.query, fields, context).then(
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
        res.status(500).send("Boom!");
    }
};

exports.getById = getById;
exports.getByQuery = getByQuery;
exports.post = post;






