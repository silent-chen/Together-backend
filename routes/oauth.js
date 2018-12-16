'use strict';
const logging = require('../utils/logging');
const moduleName = 'OAuth';
const axios = require('axios');
const bo = require("../resources/bo/customers");
const return_codes = require('../utils/return_codes');
const security = require("../utils/security");

let environment_name = process.env.eb_environment;
if(!environment_name) {
    environment_name = 'local';
}
logging.debug_message("environment_name = ", environment_name);

const env = require('../env').getEnv(environment_name);

let post = function(req, response, next) {

    let context = {tenant: req.tenant};
    let functionName = "post:";

    const data = req.body;
    const site = data.site;
    const code = data.code;

    logging.debug_message(moduleName + functionName + "body  = ", data);
    if(site === 'github') {
        const client_id = env.github.client_id;
        const client_secret = env.github.client_secret;
        axios.post('https://github.com/login/oauth/access_token', {
            client_id,
            client_secret,
            code
        }).then((res)=>{
            console.log("access_code: ", res.data);
            if(res.data[0] === 'e') {
                response.send(JSON.stringify({ authorized: false }));
                return;
            }
            const access_code = res.data;
            axios.get(`https://api.github.com/user?${access_code}`).then(
                (res)=>{
                    console.log("User data: ", res.data);
                    response.setHeader('Content-Type', 'application/json');
                    let data = { email: res.data.email, username: res.data.login };
                    checkCustomer(data,site,context).then((result) =>{
                            response.status(200).json(result);
                        },
                        (err) =>{
                            response.status(400).json(err)
                        }
                    );
//                    response.send(JSON.stringify({ authorized: true, data: { email: res.data.email, username: res.data.login } }));
                }
            )
        }, (err)=>{
            console.log("post err");
            response.send(JSON.stringify({ authorized: false }));
        });
    }
};
let checkCustomer = function(data,site,context){
    return new Promise((resolve,reject) => {
        console.log(data);
        let email = data.email;
        let method = site;
        let username = data.username;
        bo.retrieveByTemplate({email,method}).then(
            (result) => {
                if (result.length === 0){
                    return bo.retrieveByTemplate({username});
                }
                else {
                    let claim = security.generate_customer_claims(data, context);
                    let user = return_codes.codes.login_success;
                    user.token = claim;
                    user.username = username;
                    resolve(user);
                }
            }
        ).then( (result) => {
            if(!Array.isArray(result))
                return;
            if(result.length === 0) {
                data.pw = '123';
                data.method = site;
                bo.create(data,context).then((result) => {
                    resolve(result)},
                    (err) => {reject(err)} );
                }
            else {
                let user = {username, email};
                reject(user);
            }
        }
        )
    })
};
exports.post = post;