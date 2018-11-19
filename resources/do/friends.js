let Dao = require("../dao");
let logging = require('../../utils/logging');
let sandh = require('../../utils/salthash');

const friendsCollection = {
    name: "friends",
    attribute: {
        id: {type: 'string', allowNull: false, field: 'friends_relationship_id', primaryKey: true},
        user_id: {type: 'string', allowNull: false, field: "user_id"},
        friend_id: {type: 'string', allowNull: false, field: "friend_id"},
        tenant_id: {type: 'string', allowNull: false, field: 'tenant_id'}
    }
};

let FriendsDAO = function() {
    const self = this;
    self.theDAO = new Dao.Dao(friendsCollection);
    self.retrieveById = self.theDAO.retrieveById;

    self.retrieveByTemplate = function(template, fields) {
        logging.debug_message("template", template);
        return new Promise(function(resolve, reject) {
            self.theDAO.retrieveByTemplate(template, fields).then(
                function (result) {
                    resolve(result);
                }, function (err) { reject(err) }
            );
        })
    };

    self.create = function(data, context) {
        console.log(data)
        console.log(context)
        return new Promise(function(resolve, reject) {
            data.tenant_id = context.tenant;
            // data.user_id=context.user_id;
            // data.friend_id=context.friend_id;
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
                    console.error(error.message);
                    reject(error);
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
                    resolve(result);
                }
            );
        });
    };
};

exports.FriendsDAO = FriendsDAO;