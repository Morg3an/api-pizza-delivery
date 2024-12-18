const https = require('https');
const querystring = require('querystring');
const config = require('./config');

const stripe = {};

stripe.processPayment = function (amount, callback) {
    amount = typeof (amount) === 'number' && amount > 0 ? amount : false;
    if (!amount) {
        return callback('Invalid amount');
    }

    const payload = {
        amount: amount * 100, // Stripe expects the amount in cents
        currency: 'usd',
        source: 'tok_visa', // A test token from Stripe
        description: 'Pizza delivery payment'
    };

    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
        protocol: 'https:',
        hostname: 'api.stripe.com',
        method: 'POST',
        path: '/v1/charges',
        auth: config.stripeSecretKey,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayload)
        }
    };

    const req = https.request(requestDetails, function (res) {
        const status = res.statusCode;
        if (status === 200 || status === 201) {
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

module.exports = stripe;
