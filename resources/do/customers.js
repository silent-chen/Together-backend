let Dao = require("../dao");
let logging = require('../../utils/logging');
let sandh = require('../../utils/salthash');

const customersCollection = {
    name: "customers",
    attribute: {
        id: {type: 'string', allowNull: false, field: 'customers_id', primaryKey: true},
        username: {type: 'string', allowNull: false, field: "customers_username"},
        email: {type: 'string', allowNull: false, field: "customers_email"},
        status: {type: 'string', allowNull: false, field: 'customers_status'},
        pw: {type: 'string', allowNull: false, field: 'customers_password'},
        tenant_id: {type: 'string', allowNull: false, field: 'tenant_id'}
    }
};

let CustomersDAO = function() {
    const self = this;
    self.theDAO = new Dao.Dao(customersCollection);

    self.retrieveById = self.theDAO.retrieveById;

    self.retrieveByTemplate = function(template, fields) {
        logging.debug_message("template", template);
        let template_without_pw = Object.assign({}, template);
        delete template_without_pw.pw;
        return new Promise(function(resolve, reject) {
            self.theDAO.retrieveByTemplate(template_without_pw, fields).then(
                function (result) {
                    console.log(result);
                    if("pw" in template) {
                        resolve(result.filter((data) => (sandh.compare(template.pw, data.pw))));
                    }
                    resolve(result);
                }
            );
        })
    };

    self.create = function(data, context) {
        return new Promise(function(resolve, reject) {
            data.tenant_id = context.tenant;
            data.pw = sandh.saltAndHash(data.pw);
            let id = data.id;

            self.theDAO.create(data).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    result.id = id;
                    resolve(result);
                },
                function (error){
                    // rejection
                    console.error(error.message)
                }

            );
        });

    }

    self.update = function(template, update, fields) {
        return new Promise(function(resolve,reject){
            self.theDAO.update(template,update,fields).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    console.log(result);
                    resolve(result);
                }
            );
        });
    }

    self.delete = function(template,fields) {
        return new Promise(function(resolve,reject){
            self.theDAO.delete(template,fields).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    console.log(result);
                    resolve(result);
                }
            );
        });
    };
};

exports.CustomersDAO = CustomersDAO;
