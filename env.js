const env = {
    local: {
        database: "E6156",
        username: "root",
        password: "dh51dl725",
        options: {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: false,

            pool: {
                max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
            }
        }
    }
};

exports.getEnv = function(type) {
    return env[type];
};
