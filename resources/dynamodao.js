let AWS = require('aws-sdk');
let doc = require('dynamodb-doc');

// Load the AWS API Key from my local, private configuration file.
let credentials = new AWS.SharedIniFileCredentials();
// Set the credential.
AWS.config.credentials = credentials;

AWS.config.update({region: 'us-east-1'});
let dynamo = new AWS.DynamoDB.DocumentClient();

class DynamoDao{
    constructor(config) {
        // check is config has the form needed
        if(!("tableName" in config))
            throw "no table name in config";
        if(!("partitionKey" in config))
            throw "no partition key in the config!";
        if(!("sortKey" in config))
            throw "no sort key in the config!";
        this.config = config;
        this.getById.bind(this);
        this.getByPartitionKey.bind(this);
        this.getByTemplate.bind(this);
        this.delete.bind(this);
        this.create.bind(this);
    }

    getById(id, field) {
        const config = this.config;
        return new Promise(function(resolve, reject) {
            let params = {};
            params.Key = {[config.partitionKey]: id[config.partitionKey],
                [this.config.sortKey]: id[this.config.sortKey]};
            params.TableName = config.tableName;
            dynamo.get(params, function(err, result) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    getByPartitionKey(template, fields) {
        const config = this.config;
        return new Promise(function(resolve, reject) {
            let params = {
                ExpressionAttributeValues: {
                    ":v1": template[config.partitionKey]
                },
                KeyConditionExpression: `${config.partitionKey} = :v1`,
                TableName: config.tableName
            };
            dynamo.query(params, function(err, result) {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            })
        })

    };

    getByTemplate(template, fields) {
        return new Promise(function(resolve, reject) {
            let params = template;
            dynamo.scan(params, function(err, result) {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            })
        })
    };

    // delete one item
    delete(id) {
        return new Promise(function(resolve, reject) {
            let params = {};
            params.Key = {[this.config.partitionKey]: id[this.config.partitionKey],
                [this.config.sortKey]: id[this.config.sortKey]};
            params.TableName = config.tableName;
            dynamo.delete(params, function(err, result) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    // create one item
    create(data) {
        return new Promise(function(resolve, reject) {
            let params = {};
            params.Item = data;
            params.TableName =  config.tableName;
            dynamo.put(params, function(err, result) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(result);
                }
            });
        });

    };
}

exports.DynamoDao = DynamoDao;
// this is for testing
exports.dynamo = dynamo;