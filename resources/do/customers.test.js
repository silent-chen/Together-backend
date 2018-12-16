const cdo = require('./customers');

let dao = new cdo.CustomersDAO();
dao.create({
    id: "123",
    username: "sherlock",
    email: "SH@221B.backer.street",
    status: "addicted",
    pw: "I'm Sherlocked",
}, {tenant: "Mr. Watson"}).then(() => {
    return dao.update({id:"123"},{id:"234"},{tenant: "Mr. Watson"});
}).then(() => {
    dao.delete({id:"234"},{tenant: "Mr. Watson"});
});
dao.retrieveByTemplate({username: 'sherlock'}).then((res) => {
    console.log(res);
});
