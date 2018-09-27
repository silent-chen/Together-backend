const cbo = require('./customers');

/*
cbo.create({
    username: "Sherlock",
    email: "SH@221B.backer.street",
    pw: "I'm Sherlocked",
}, {tenant: "Mr. Watson"});
*/

cbo.retrieveByTemplate({}, {}).then((result) => {
    console.log(result);
});