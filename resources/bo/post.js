const pdo = require("../do/post");
const postdo = new pdo.PostDao();

exports.search = function(template, fields) {
    return postdo.getByTemplate(template, fields);
};

exports.getByUsername = function(username, field) {
    return postdo.getByPartitionKey({username}, field);
};

// delete one item
exports.delete = postdo.delete;

// create one item
exports.create = function(data) {
    return new Promise(function(resolve, reject) {
        postdo.create(data).then((res) => {
            resolve(res)
        }, (err) => {
            console.log("postbo.create: ", err);
            reject(err);
        });
    })
};