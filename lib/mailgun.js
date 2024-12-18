const https = require('https');
const querystring = require('querystring');
const config = require('./config');

const mailgun = {};

mailgun.sendReceipt = function (email, orderObject, callback) {
    email = typeof (email) === 'string' && email.includes('@') ? email : false;
    if (!email) {
        return callback('Invalid email');
    }

    const payload = {
        from: 'postmaster@sandbox123.mailgun.org',
        to: email,
        subject: 'Your order receipt',
        text: `Thank you for your order!\n\nOrder ID: ${orderObject.id}\nAmount: ${orderObject.amount}\nStatus: ${orderObject.status}`
    };

    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
        protocol: 'https:',
        hostname: 'api.mailgun.net',
        method: 'POST',
        path: '/v3/sandbox123.mailgun.org/messages',
        auth: `api:${config.mailgunApiKey}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    };

    const req = https.request(requestDetails, function (res) {
        const status = res.statusCode;
        if (status === 200 || 201) {
            callback(false);
        } else {
            callback(`Status code returned was ${status}`);
        }
    });

    req.on('error', function (e) {
        callback(e);
    });

    req.write(stringPayload);
    req.end();
};

module.exports = mailgun;
