const fdo = require('./friends');

let dao = new fdo.FriendsDAO();

// for the first time of testing, uncomment following lines.

dao.create({
    id:"aaabbb",
    user_id:"aaa",
    friend_id:"bbb"
}, {tenant: "Mr. Watson"}).then(() => {
    return dao.update({user_id:"aaa"},{user_id:"ccc"},{tenant: "Mr. Watson"});
}).then(() => {
    dao.delete({user_id:"ccc"},{tenant: "Mr. Watson"});
});

// dao.retrieveByTemplate({user_id:'aaa'}).then((res) => {
//     console.log(res);
// })