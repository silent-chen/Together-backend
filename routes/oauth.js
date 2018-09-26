'use strict';
const logging = require('../utils/logging');
const moduleName = 'OAuth';
const axios = require('axios');

let post = function(req, response, next) {

    let functionName = "post:";

    const data = req.body;
    const site = data.site;
    const code = data.code;

    logging.debug_message(moduleName + functionName + "body  = ", data);
    if(site === 'github') {
        const client_id = '15545471f76a112c2ae9';
        const client_secret = 'd7aa0f2fcfcb5d5efd7e937d485ee2f9760b6a8c';
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
                    response.send(JSON.stringify({ authorized: true, data: { email: res.data.email, name: res.data.name } }));
                }
            )
        }, (err)=>{
            console.log("post err");
            JSON.stringify({ authorized: false });
        });
    }
}

exports.post = post;