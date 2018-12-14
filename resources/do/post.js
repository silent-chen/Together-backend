const DynamoDao = require('../dynamodao');

const config = {
    tableName: "together_post",
    partitionKey: "username",
    sortKey: "create_time"
};

class PostDao {
    constructor() {
        this.theDao = new DynamoDao.DynamoDao(config);
        this.getById.bind(this);
        this.getByPartitionKey.bind(this);
        this.getByTemplate.bind(this);
        this.delete.bind(this);
        this.create.bind(this);
    }

    getById(id, field) {
        return this.theDao.getById(id).then();
    };

    getByPartitionKey(template, fields) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.getByPartitionKey(template, fields).then((res) => {
                resolve(res.Items);
            }, reject)
        })
    };

    getByTemplate(template, fields) {
        return this.theDao.getByTemplate(template, fields);
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

exports.PostDao = PostDao;