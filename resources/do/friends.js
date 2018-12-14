const DynamoDao = require('../dynamodao');
let logging = require('../../utils/logging');

const config = {
    tableName: "together_friends",
    partitionKey: "username",
    sortKey: "friend_name"
};

class FriendsDao {
    constructor() {
        this.theDao = new DynamoDao.DynamoDao(config);
        this.getByPartitionKey.bind(this);
        this.getById.bind(this);
        this.delete.bind(this);
        this.create.bind(this);
    }

    getByPartitionKey(template, fields) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.getByPartitionKey(template, fields).then((res) => {
                resolve(res.Items);
            }, reject)
        })
    };

    getById(id, fields) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.getById(id, fields).then((res) => {
                resolve(res);
            }, reject)
        })
    };

    // delete one item
    delete(id) {
        return this.theDao.delete(id);
    };

    // create one item
    create(data) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.create(data).then((res) => {
                console.log("postdo.create: ", res);
                resolve(res);
            }, (err) => {
                console.log(err);
                reject(err);
            })
        })
    };
}

exports.FriendsDao = FriendsDao;