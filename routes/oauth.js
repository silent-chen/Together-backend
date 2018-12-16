'use strict';
const logging = require('../utils/logging');
const moduleName = 'OAuth';
const axios = require('axios');
const { google } = require('googleapis');
const obo = require('../resources/bo/oauth');

let environment_name = process.env.eb_environment;
if(!environment_name) {
    environment_name = 'local';
}
logging.debug_message("environment_name = ", environment_name);

const env = require('../env').getEnv(environment_name);
let get = function(req, res) {
    logging.debug_message("query  = ", req.query);
    try {
        let url =  googleOath();
        res.status(200).send(url);
    }
    catch (e) {
        logging.error_message("e = " + e);
        res.status(401).send("Boom in get google url!", e);
    }
};

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
                    obo.checkCustomer(data,site,context).then((result) =>{
                            response.status(200).json(result);
                        },
                        (err) =>{
                            response.status(400).json(err)
                        }
                    );
                }
            )
        }, (err)=>{
            console.log("post err");
            response.send(JSON.stringify({ authorized: false }));
        });
    } else if (site === 'google') {
        let googlecode = "4/tQCFaFJumr0vALgurvj1P_7is02ccsuxC2G-0A6duGBH1J1bMfEbxKgRgd1YrK_C-Q1HloMHSWKtW9rZswtyb80&scope=openid%20email%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/plus.me";
        getGoogleAccountFromCode(googlecode);
    }
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
    });
    console.log("url ===== " + url);
    return url;
};

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
        });
        
        console.log("id=====================: ", userGoogleId, " email: ", userGoogleEmail, " token: ", token);

    });
    
};

let createConnection = function() {
    const redirect_url = "http://localhost:5000/oauth/google"
    return new google.auth.OAuth2(
      env.google.clientId,
      env.google.clientSecret,
      redirect_url
    );
};

exports.post = post;
exports.get = get;