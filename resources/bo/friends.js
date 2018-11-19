const fdo = require('../do/friends');

let friendsdo = new fdo.FriendsDAO();

let logging = require('../../utils/logging');
let return_codes =  require('../../utils/return_codes');
let moduleName = "friendsbo.";  // ???

// Do something clever to generate IDs that people can remember.
// This does not count as clever.
let generateId = function(user_id,friend_id) {
    return user_id+friend_id;
};

let validQParams = ['user_id','friend_id'];
let validateQueryParameters = function(template) {
    let keys = Object.keys(template);
    for (let i = 0; i < keys.length; i++) {
        let pos = validQParams.indexOf(keys[i]);
        if (pos === -1) {
            return false;
        }
    }
    return true;
};

// Same ID for checking create information.
let validateCreateData = function(data) {
    // I feel lucky.
    return true
};

let validateUpdate = function(data) {
    // I feel lucky.
    return true;
};

// I did not do this as a JavaScript "class." No particular reason.
exports.retrieveById = function(id, fields, context) {
    let functionName = "retrieveById:";

    return new Promise(function (resolve, reject) {
        friendsdo.retrieveById(id, fields, context).then(
            function (result) {
                //logging.debug_message(moduleName + functionName + "Result = ", result);
                resolve(result);
            },
            function (error) {
                logging.error_message(moduleName + functionName + " error = ", error);
                reject(return_codes.codes.internal_error);
            }
        )
    });
};

exports.retrieveByTemplate = function(template, fields, context) {
    let functionName = "retrieveByTemplate";
    logging.debug_message(moduleName, functionName, ": ", template, fields, context);
    return new Promise(function (resolve, reject) {

        if (!validateQueryParameters(template)) {
            reject(return_codes.codes.invalid_query);
        }
        else {
            friendsdo.retrieveByTemplate(template, fields, context).then(
                function (result) {
                    //logging.debug_message(moduleName + functionName + "Result = ", result);
                    resolve(result);
                },
                function (error) {
                    logging.error_message(moduleName + functionName + " error = ", error);
                    reject(return_codes.codes.internal_error);
                }
            );
        }

    });
};

exports.create = function(data, context) {
    let functionName = "create";

    return new Promise(function (resolve, reject) {

        data.id = generateId(data.username);
        if (!validateCreateData(data)) {
            reject(return_codes.codes.invalid_create_data);
        }
        else {
            customersdo.create(data, context).then(
                function (result) {
                    //logging.debug_message(moduleName + functionName + "Result = ", result);
                    resolve(result);
                },
                function (error) {
                    logging.error_message(moduleName + functionName + "error = ", error);
                    reject(return_codes.codes.internal_error);
                }
            );
        }
    });
};


exports.delete = function(template, fields) {
    let functionName = "delete";

    return new Promise(function (resolve,reject) {

        customersdo.delete(template, fields).then(
            function(result){
                resolve(result)
            },
            function(error){
                console.error_message(moduleName + functionName + "error = ", error);
                reject(return_codes.codes.internal_error);
            }
        )
    });
};

exports.update = function(template, fields, context) {
    let functionName = "update";

    return new Promise(function (resolve,reject) {
        if (!validateUpdate){
            reject(return_codes.codes.invalid_create_data);
        }
        else{
            customersdo.update(template, fields, context).then(
                function(result){
                    resolve(result)
                },
                function(error){
                    console.error_message(moduleName + functionName + "error = ", error);
                    reject(return_codes.codes.internal_error);
                }
            )
        }
    })
};
