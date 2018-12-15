let AWS = require('aws-sdk');
let doc = require('dynamodb-doc');

let environment_name = process.env.eb_environment;
if(!environment_name) {
    environment_name = 'local';
}
if(environment_name === 'local') {
    // Load the AWS API Key from my local, private configuration file.
    let credentials = new AWS.SharedIniFileCredentials();
    // Set the credential.
    AWS.config.credentials = credentials;
}

// Set region
AWS.config.update({region: 'us-east-1'});

const s3Img = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: "together-image"}
});

const uploadImage = (data) => {
    return new Promise(function (resolve, reject) {
        s3Img.putObject(data, function(err, data) {
            if(err)
                reject(err);
            else
                resolve(data);
        });
    })
};

const downloadImage = (params) => {
    return new Promise(function(resolve, reject) {
        s3Img.getObject(params, function(err, data) {
            if(err)
                reject(err);
            else
                resolve(data.Body.toString());
        })
    })
};

const deleteImage = (params) => {
    return new Promise(function(resolve, reject) {
        s3Img.getObject(params, function(err, data) {
            if(err)
                reject(err);
            else
                resolve(data);
        })
    })
};

exports.uploadImage = uploadImage;
exports.downloadImage = downloadImage;
exports.deleteImage = deleteImage;