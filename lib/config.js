/*
* Create and export configuration variables
*
*
*/

const dotenv = require('dotenv');
const { config } = require('process');

// Load environment variables from .env.local file
dotenv.config({ path: '/../.env.local' });

// Container for all the environments
var environments = {};

// Staging object
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'stripeSecretKey': process.env.STRIPE_SECRET_KEY,
    'mailgunApiKey': process.env.MAILGUN_API_KEY
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsAlsoASecret',
    'maxChecks': 5,
    'stripeSecretKey': process.env.STRIPE_SECRET_KEY,
    'mailgunApiKey': process.env.MAILGUN_API_KEY
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
