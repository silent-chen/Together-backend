'use strict';
const logging = require('../utils/logging');
const moduleName = 'OAuth';
const axios = require('axios');
const bo = require('../resources/bo/customers');
const { google } = require('googleapis');
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
                    let context = {tenant: req.tenant};
                    googleOath();
                    let googlecode = "4/tQCFaFJumr0vALgurvj1P_7is02ccsuxC2G-0A6duGBH1J1bMfEbxKgRgd1YrK_C-Q1HloMHSWKtW9rZswtyb80&scope=openid%20email%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/plus.me";
                    getGoogleAccountFromCode(googlecode);
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
    } else if (site === 'google') {
        
    }
};

let checkCustomer = function(data,site,context){
    return new Promise((resolve,reject) => {
        console.log(data);
        let email = data.email;
        let method = site;
        let username = data.username;
        bo.retrieveByTemplate({email, method}).then(
            (result) => {
                console.log("ha", result);
                if (result.length === 0){
                    return bo.retrieveByTemplate({username});
                }
                else {
                    data.username = result[0].username;
                    let claim = security.generate_customer_claims(data, context);
                    let user = return_codes.codes.login_success;
                    user.token = claim;
                    user.username = result[0].username;
                    resolve(user);
                }
            }
        ).then( (result) => {
            console.log("ah", result);
            if(!Array.isArray(result))
                return;
            if(result.length === 0) {
                data.pw = '123';
                data.method = site;
                bo.create(data,context).then((result) => {
                        let claim = security.generate_customer_claims(result, context);
                        let user = return_codes.codes.login_success;
                        user.token = claim;
                        user.username = result.username;
                        resolve(user);
                    }, (err) => {
                        reject(err)
                } );
            }
            else {
                let user = {username, email, method};
                resolve(user);
            }
        }
        )
    })
};

let googleOath = function () {
    const client_id = env.google.client_id;
    const client_secret = env.google.client_secret;
    const redirect_url = "http://localhost:5000/oauth/google"
    let auth = new google.auth.OAuth2(client_id, client_secret, redirect_url);
    const defaultScope = [
        'https://www.googleapis.com/auth/userinfo.email',
      ];
    const url = auth.generateAuthUrl({
        scope: defaultScope
    })
    console.log("url ===== " + url);
    return url;
}

let getGoogleAccountFromCode = function (code) {
    const auth = createConnection();
    auth.getToken(code).then((data) => {
        console.log("data ++++++++++++ ", data)
        const token = data.token;
        auth.setCredentials(token);

        const plus = google.plus({ version: 'v1', auth });
        const me = plus.people.get({ userId: 'me' }).then((me) => {
            const userGoogleId = me.data.id;
            const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
        })
        
        console.log("id=====================: ", userGoogleId, " email: ", userGoogleEmail, " token: ", token);

    });
    
}

let createConnection = function() {
    const redirect_url = "http://localhost:5000/oauth/google"
    return new google.auth.OAuth2(
      env.google.clientId,
      env.google.clientSecret,
      redirect_url
    );
}

exports.post = post;