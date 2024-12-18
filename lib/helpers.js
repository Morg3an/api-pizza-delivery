/*
 * Helpers for various tasks
 *
*/

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');
var stripe = require('./stripe');
var mailgun = require('./mailgun');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};


// Create a SHA256 hash
helpers.hash = function (str) {
    if (typeof (str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Create a string of random alphanumeric characters of a given length 
helpers.createRandomString = function(strLength) { strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false; 
    if (strLength) { 
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'; 
        let str = ''; 
        for (let i = 0; i < strLength; i++) { 
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)); 
            str += randomCharacter; 
        } return str; 
    } else { 
        return false; 
    }
};

// Process Stripe payment
helpers.processStripePayment = function(amount, callback) { 
    console.log(`Processing payment for amount: ${amount}`); 
    stripe.processPayment(amount, function(err) { 
        if (err) { 
            console.error(`Stripe payment error: ${err}`); 
            callback(err); 
        } else { 
            callback(false); 
        } 
    }); 
};

// Send Mailgun receipt 
helpers.sendMailgunReceipt = function(email, orderObject, callback) { 
    console.log(`Sending email receipt to: ${email}`); 
    mailgun.sendReceipt(email, orderObject, function(err) { 
        if (err) { 
            console.error(`Mailgun email error: ${err}`); callback(err); 
        } else { 
            callback(false); 
        } 
    }); 
};


module.exports = helpers;