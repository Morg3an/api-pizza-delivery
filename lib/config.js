/*
* Create and export configuration variables
*
*
*/

const { config } = require("process");

//Container for all the environments
var environmnets = {};

//Staging object
environmnets.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks': 5,
    'stripeSecretKey': 'sk_test_51QLxG0AlEPonyFJmx5CQ5CFzYOSVCdIzOSmlw03NDRQboQd10UJ139LF7Jm05q8T3R0KaeyhtmoU6kZ6RUhBsruF003kI0lZHl', 
    'mailgunApiKey': '09e0d3e20ee17d2364c627e12a25bb93-0920befd-0df1ed1e'
};

//Production environment
environmnets.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisIsAlsoASecret',
    'maxChecks': 5,
    'stripeSecretKey': 'sk_test_51QLxG0AlEPonyFJmx5CQ5CFzYOSVCdIzOSmlw03NDRQboQd10UJ139LF7Jm05q8T3R0KaeyhtmoU6kZ6RUhBsruF003kI0lZHl', 
    'mailgunApiKey': '09e0d3e20ee17d2364c627e12a25bb93-0920befd-0df1ed1e'
};

//Determine which environment was passed as a command-line argument
var currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : process.env.NODE_ENV;

//Check that the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof (environmnets[currentEnvironment]) == 'object' ? environmnets[currentEnvironment] : environmnets.staging;

//Export the module
module.exports = environmentToExport;