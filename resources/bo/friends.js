const fdo = require("../do/friends");
const friendsdo = new fdo.FriendsDao();

exports.getByUsername = function(username, field) {
    return friendsdo.getByPartitionKey({username}, field);
};

exports.getById = function(username, friend_name, field) {
    return friendsdo.getById({username, friend_name}, field);
};

// delete one item
exports.delete = friendsdo.delete;

// create one item
exports.create = function(data) {
    return new Promise(function(resolve, reject) {
        friendsdo.create(data).then((res) => {
            resolve(res)
        }, (err) => {
            console.log("friends.create: ", err);
            reject(err);
        });
    })
};