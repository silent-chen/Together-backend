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
        },
        // TODO
        // Facebook

        // Google
        google: {
            client_id: "462371211250-e76694n7mc2er63a7g46usttqsqffghf.apps.googleusercontent.com",
            client_secret: "e5Z1Do4CG2oB1vgPnDCyB2XG",
            redirect_url: "http://together-e6156.s3-website-us-east-1.amazonaws.com/oauth/google",
        }
        // Twitter

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
        },
        // TODO
        // Facebook

        // Google
        google: {
            client_id: "462371211250-e76694n7mc2er63a7g46usttqsqffghf.apps.googleusercontent.com",
            client_secret: "e5Z1Do4CG2oB1vgPnDCyB2XG",
            redirect_url: "http://localhost:5000/oauth/google",
        }

        // Twitter
    }
};

exports.getEnv = function(type) {
    return env[type];
};
