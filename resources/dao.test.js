const Dao = require("./dao");

const sequelize = Dao.sequelize;
const preprocess = Dao.preprocess;

const customersCollection = {
    id: {type: 'string', allowNull: false, field: 'customers_id'},
    username: {type: 'string', allowNull: false, field: "customers_user"},
    firstName: {type: 'string', allowNull: false, field: "customers_firstname"},
};

console.log(preprocess(customersCollection));

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

