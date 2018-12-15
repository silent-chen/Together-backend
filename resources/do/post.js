const DynamoDao = require('../dynamodao');
const upload = require('../../utils/upload');

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
        return this.theDao.getById(id);
    };

    getByPartitionKey(template, fields) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.getByPartitionKey(template, fields).then((res) => {
                return Promise.all(res.Items.map((item) => {
                    if(null !== item.image)
                        return upload.downloadImage({Key: item.image});
                    else
                        return null;
                })).then((data) => {
                    for(let i=0; i<data.length; i++)
                        if(null !== res.Items[i].image)
                            res.Items[i].image = data[i];
                    console.log("items:", res.Items);
                    resolve(res.Items);
                });
            }, reject)
        })
    };

    getByTemplate(template, fields) {
        const theDao = this.theDao;
        return new Promise(function(resolve, reject) {
            theDao.getByTemplate(template, fields).then((res) => {
                return Promise.all(res.Items.map((item) => {
                    if(null !== item.image)
                        return upload.downloadImage({Key: item.image});
                    else
                        return null;
                })).then((data) => {
                    for(let i=0; i<data.length; i++)
                        if(null !== res.Items[i].image)
                            res.Items[i].image = data[i];
                    console.log("items:", res.Items);
                    resolve(res.Items);
                });
            }, reject)
        });
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