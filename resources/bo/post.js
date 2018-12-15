const pdo = require("../do/post");
const logger = require('../../utils/logging');
const upload = require('../../utils/upload');
const postdo = new pdo.PostDao();

const moduleName = 'postbo';

exports.search = function(template, fields) {
    return postdo.getByTemplate(template, fields);
};

exports.getByUsername = function(username, field) {
    return postdo.getByPartitionKey({username}, field);
};

// delete one item
exports.del = function(post) {
    return postdo.del(post);
};

// create one item
exports.create = function(data) {
    const functionName = '.create';
    logger.debug_message(moduleName+functionName + ": ");
    if(data.post === "")
        delete data.post;
    if(data.image !== "") {
        let name = Math.floor(Math.random()*10000).toString();
        let img = {
            Key: name,
            Body: data.image,
            ContentEncoding: 'base64',
            ContentType: 'text/plain'
        };
        data.image = name;
        return upload.uploadImage(img).then((res) => {
            return postdo.create(data);
        }, (err) => {
            console.log("postbo.create: ", err);
        })
    }
    else {
        delete data.image;
        return postdo.create(data);
    }
};