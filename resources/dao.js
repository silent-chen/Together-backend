const Sequelize = require('sequelize');

const logging =require('../utils/logging');

let environment_name = process.env.eb2_environment;
if(!environment_name) {
    environment_name = 'local';
}
logging.debug_message("environment_name = ", environment_name);

const env = require('../env').getEnv(environment_name);

const sequelize = new Sequelize(
    env.database,
    env.username,
    env.password,
    env.options
);

// a pure function to convert collection config to what sequelize model need
let preprocess = function(c) {
    let new_c = {};
    for(let a in c) {
        let new_type;
        if(c.hasOwnProperty(a) && 'type' in c[a] && typeof c[a].type === 'string' ) {
            if(c[a].type.toLowerCase() === 'string') {
                new_type = Sequelize.STRING;
            }
            else if(c[a].type.toLowerCase() === 'int') {
                new_type = Sequelize.INTEGER;
            }
            else if(c[a].type.toLowerCase() === 'float' || c[a].type === 'number') {
                new_type = Sequelize.FLOAT;
            }
            else if(c[a].type.toLowerCase() === 'date') {
                new_type = Sequelize.DATE;
            }
        }
        new_c[a] = {...c[a], type: new_type};
    }
    return new_c;
};

let registerCollection = function(c) {
    const model = sequelize.define(
        c.name,
        c.attribute,
        c.options
    );
    // sync need to be called after define
    sequelize.sync().then(() => {
        console.log(`Database & tables synced!`)
    });
    return model;
};

let Dao = function(collection) {

    self = this;

    self.collection = {...collection, attribute: preprocess(collection.attribute)};

    self.model = registerCollection(self.collection);
    // with sequelize, the find by id will directly find by primary key
    self.retrieveById = function(id) {
        return new Promise(function(resolve, reject) {
            self.model.findById(id).then((result) => {
                resolve(result);
            }, (error) => {
                logging.debug_message("Boom in retrieveById = " + error);
                reject(error);
            })
        })
    };

    // retrieveByTemplate would use
    self.retrieveByTemplate = function(template, fields) {
        return new Promise(function(resolve, reject) {
            self.model.findAll({
                where: template,
                ...fields
            }).then((result) => {
                resolve(result);
            }, (error) => {
                logging.debug_message("Boom in retrieveByTemplate = " + error);
                reject(error);
            })
        })
    };

    self.update = function(template, updates, fields) {
        return new Promise(function(resolve, reject) {
            self.model.update(updates, {
                where: template,
                ...fields
            }).then((result) => {
                resolve(result);
            }, (error) => {
                logging.debug_message("Boom in update = " + error);
                reject(error);
            })
        })
    };

    self.delete = function(template, fields) {
        return new Promise(function(resolve, reject) {
            self.model.destroy({
                where: template,
                ...fields
            }).then((result) => {
                resolve(result);
            }, (error) => {
                logging.debug_message("Boom in delete = " + error);
                reject(error);
            })
        })
    };

    self.create = function(data, fields) {
        return new Promise(function(resolve, reject) {
            self.model.create(data, fields).then((result) => {
                resolve(result);
            }, (error) => {
                logging.debug_message("Boom in create = " + error);
                reject(error);
            })
        })
    };
};

exports.Dao = Dao;
exports.sequelize = sequelize;
exports.preprocess = preprocess;