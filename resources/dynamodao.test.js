const dao = require("./dynamodao");

let dynamo = dao.dynamo;

let params_1 = {
    TableName : 'together_post',
    Item: {
        username: "zhuzilin",
        create_time: "2018.11.17",
        content: "hello world!"
    }
};

let params_2 = {
    TableName : 'together_post',
    Item: {
        username: "zhuzilin",
        create_time: "2018.11.18",
        content: "hello world!"
    }
};

let query_params = {
    ExpressionAttributeValues: {
        ":v1": "zhuzilin"
    },
    KeyConditionExpression: "username = :v1",
    // for select the return attributes, can be ignored
    ProjectionExpression: "create_time, username",
    TableName: "together_post"
};

dynamo.put(params_1, function(err, data) {
    if (err) console.log("put1 error: ", err);
    else {
        console.log("put1 success: ", data);
        dynamo.put(params_2, function(err, data) {
            if (err) console.log("put2 error: ", err);
            else {
                console.log("put2 success: ", data);
                dynamo.query(query_params, function(err, data) {
                    if (err) console.log("query error", err);
                    else {
                        console.log("query success: ", data);
                        for(let item of data.Items) {
                            dynamo.delete({
                                Key: item,
                                TableName: "together_post"
                            }, function(err, data) {
                                if(err)
                                    console.log("delete err: ", err);
                                else
                                    console.log("delete success: ", data);
                            })
                        }
                    }
                });
            }
        });
    }
});