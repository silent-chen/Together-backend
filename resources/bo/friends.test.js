const fbo = require('./friends');


fbo.create({
    user_id:"aaa",
    friend_id:"bbb"
}, {tenant: "Mr. Watson"});


fbo.retrieveByTemplate({user_id: "aaa"}, {tenant: "Mr. Watson"}).then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
});