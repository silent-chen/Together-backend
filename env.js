const env = {
    elastic_beanstalk: {
        database: "ebdb",
        username: "together",
        password: "together",
        options: {
            host: "aa5o30emd02tmi.c1sient9tsgr.us-east-1.rds.amazonaws.com",
            dialect: 'mysql',
            operatorsAliases: false,

            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        },
        github: {
            client_id: "19921c3b8c557fb175dc",
            client_secret: "59150926138e67a27b7d5bd09846d79de57b0d26"
        }

    },
    local: {
        database: "E6156",
        username: "root",
        password: "zhuzilin",
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
        },
        github: {
            client_id: "15545471f76a112c2ae9",
            client_secret: "d7aa0f2fcfcb5d5efd7e937d485ee2f9760b6a8c"
        }
    }
};

exports.getEnv = function(type) {
    return env[type];
};
