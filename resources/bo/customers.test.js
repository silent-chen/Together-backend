const cbo = require('./customers');

/*
cbo.create({
    username: "Sherlock",
    email: "SH@221B.backer.street",
    pw: "I'm Sherlocked",
}, {tenant: "Mr. Watson"});
*/

cbo.retrieveByTemplate({username: "zhuzilin"}, {}).then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
});