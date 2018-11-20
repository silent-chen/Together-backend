let logging = require('../utils/logging');
let bo = require('../resources/bo/friends');

let moduleName="friends.";

let getByUsername =  function(req, res, next) {
    let functionName="getByUsername: ";

    logging.debug_message(moduleName+functionName + " tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + " params  = ", req.params);

    let username = req.params.username;

    bo.getByUsername(username).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        console.log(err);
        res.status(500).send("Internal error.");
    })

};

let get = function(req, res, next) {
    let functionName="get: ";

    let query = req.query;

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "query  = ", query);

    let username = query.username;
    let friend_name = query.friend_name;

    try {
        bo.getById(username, friend_name).then(
            function(result) {
                console.log(result);
                if(result.length === 0)
                    res.status(200).json("stranger");
                else
                    res.status(201).json(result[0].status);
            },
            function(error) {
                console.log(error);
                res.status(500).send("Internal error")
            }
        );
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal error");
    }
};

let post = function(req, res, next) {
    let functionName="post:";
    let data = req.body;
    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);

    let username = data.username;
    let friend_name = data.friend_name;
    let status = data.status;
    try {
        switch(status) {
            case "send":
                bo.create({username: friend_name,
                           friend_name: username,
                            status: "receive"}).then((res) => {
                                console.log(res);
                                return bo.create(data);
                        }).then(function(result) {
                            if (result) {
                                console.log(result);
                                res.status(201).json(result);
                            }
                        },
                            function(error) {
                                console.log(error);
                                res.status(500).send("Internal error")
                        });
                break;
            case "ok":
                bo.create({username: friend_name,
                        friend_name: username,
                        status: "ok"}).then(() => {
                        return bo.create(data)
                    }).then(function(result) {
                            if (result) {
                                console.log(result);
                                res.status(201).json(result);
                            }
                        },
                        function(error) {
                            console.log(error);
                            res.status(500).send("Internal error")
                        }
                    );
        }

    } catch (e) {
        console.log(e);
        res.status(500).send("Internal error");
    }


};

exports.getByUsername = getByUsername;
exports.get = get;
exports.post = post;







