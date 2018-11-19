const pdo = require('./post');

const dao = new pdo.PostDao();

dao.create({
   username: "zhuzilin",
   create_time: "20:00",
   content: "finish dao",
}).then((res) => {
    console.log(res);
    return dao.create({
        username: "zhuzilin",
        create_time: "20:02",
        content: "finish pdo",
    })
}).then((res) => {
    console.log(res);
    return dao.getById({username: "zhuzilin", create_time: "20:00"});
}).then((res) => {
    console.log(res);
    return dao.getByPartitionKey({username: "zhuzilin"});
}).then((res) => {
    console.log(res);
    return dao.delete({username: "zhuzilin", create_time: "20:00"});
}).then((res) => {
    console.log(res);
    return dao.delete({username: "zhuzilin", create_time: "20:02"})
});