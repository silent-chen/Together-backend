let Dao = require("../dao");
let logging = require('../../utils/logging');
let sandh = require('../../utils/salthash');

const customersCollection = {
    name: "customers",
    attribute: {
        id: {type: 'string', allowNull: false, field: 'customers_id', primaryKey: true},
        lastName: {type: 'string', allowNull: false, field: "customers_lastname"},
        firstName: {type: 'string', allowNull: false, field: "customers_firstname"},
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

    self.retrieveByTemplate = self.theDAO.retrieveByTemplate;

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
                }
            )
        });
    };

    self.update = function(template, fields) {

    };

    self.delete = function(template) {

    };
};

exports.CustomersDAO = CustomersDAO;
