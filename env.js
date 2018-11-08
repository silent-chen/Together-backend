const env = {
    local: {
        database: "E6156",
        username: "root",
        password: "19960925yy",
        options: {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: false,
            insecureAuth: true,
            
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
