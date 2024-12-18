/*
 * Entry Point of the Application
*/

const server = require('./lib/server');

{/*
    // Declare the app
    var app = {};
*/}
// Start the server
server.init(() => {
    console.log(`Server is running on port ${config.port}`);
});
