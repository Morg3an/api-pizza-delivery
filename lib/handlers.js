/*
 * Request Handlers
 *
*/

// Dependencies
const crypto = require('crypto');
const _data = require('./data');
const helpers = require('./helpers');



// instantiate the object
const handlers = {};

// Users Handler
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users sub-methods
handlers._users = {};

// Ping
handlers.ping = function (data, callback) {
    setTimeout(function () {
        callback(200);
    }, 5000);

};



// Handlers - users - post
handlers._users.post = (data, callback) => {
    // Set the required payload
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var address = typeof (data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (name && email && address && password) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Read the user
        _data.read('users', email, (err, user) => {
            if (err) {
                // Create the user object
                var userObject = {
                    'name': name,
                    'email': email,
                    'address': address,
                    'hashedPassword': hashedPassword,
                };

                // Create the user
                _data.create('users', email, userObject, function (err) {
                    if (!err) {
                        callback(200, { Message: 'User created successfully' });
                    } else {
                        callback(500, { 'Error': 'Could not create the new user.' });
                    }
                });

            } else {
                // If the user already exists, return the error
                callback(400, { Error: 'User already exists' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Handlers - users - get
handlers._users.get = (data, callback) => {
    var email = typeof (data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim().toLowerCase() : false;

    const token = typeof data.headers.token === 'string' ? data.headers.token : false;

    if (email && token) {
        // Verify the token is valid for the email
        handlers._tokens.verifyToken(token, email, (isValid) => {
            if (isValid) {
                _data.read('users', email, (err, userData) => {
                    if (!err && userData) {
                        delete userData.hashedPassword;
                        callback(200, userData);
                    } else {
                        callback(404, { Error: 'User not found' });
                    }
                });
            } else {
                callback(403, { Error: 'Missing or invalid token' });
            }
        });
    } else {
        callback(400, { error: 'Missing required fields' });
    }
};


// Handlers - users - put
handlers._users.put = (data, callback) => {
    const email = typeof data.payload.email === 'string' &&
        data.payload.email.trim().length > 0
        ? data.payload.email.trim().toLowerCase()
        : false;

    const name = typeof data.payload.name === 'string' &&
        data.payload.name.trim().length > 0
        ? data.payload.name.trim()
        : false;

    const address = typeof data.payload.address === 'string' &&
        data.payload.address.trim().length > 0
        ? data.payload.address.trim()
        : false;

    const password = typeof data.payload.password === 'string' &&
        data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;

    if (email) {
        _data.read('users', email, (err, userData) => {
            if (!err && userData) {
                if (name) userData.name = name;
                if (address) userData.address = address;
                if (password) userData.hashedPassword = helpers.hash(password);

                _data.update('users', email, userData, (err) => {
                    if (!err) {
                        callback(200, { message: 'User updated successfully' });
                    } else {
                        callback(500, { error: 'Could not update user' });
                    }
                });
            } else {
                callback(400, { error: 'User not found' });
            }
        });
    } else {
        callback(400, { error: 'Missing email' });
    }
};



// Handler - users - delete
handlers._users.delete = function (data, callback) {
    const email = typeof data.payload.email === 'string' &&
        data.payload.email.trim().length > 0
        ? data.payload.email.trim().toLowerCase()
        : false;

    console.log('Attempting to delete user with email:', email);

    if (email) {
        _data.delete('users', email, function (err) {
            if (!err) {
                console.log('User deleted successfully:', email);
                callback(200, { Message: 'User deleted successfully' });
            } else {
                console.error('Error deleting user file:', err);
                callback(500, { Error: 'Could not delete the user.' });
            }
        });
    } else {
        console.error('Error: Missing email in payload');
        callback(400, { Error: 'Missing required field' });
    }
};

// Tokens
handlers.tokens = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Tokens object
handlers._tokens = {};

// Handler - tokens - post
// Required data: email, password
// Optional data: none
handlers._tokens.post = function (data, callback) {
    // Check if the email and password are valid
    const email = typeof data.payload.email === 'string' &&
        data.payload.email.trim().length > 0
        ? data.payload.email.trim().toLowerCase()
        : false;

    const password = typeof data.payload.password === 'string' &&
        data.payload.password.trim().length > 0
        ? data.payload.password.trim()
        : false;

    if (email && password) {
        // Read the user data
        _data.read('users', email, function (err, userData) {
            if (!err && userData) {
                // Hash the sent password and compare it to the stored hash
                const hashedPassword = helpers.hash(password);

                if (hashedPassword === userData.hashedPassword) {
                    // If valid, create a new token with a payload
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;

                    const tokenObject = {
                        id: tokenId,
                        email: email,
                        expires: expires,
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { Error: 'Could not create the token' });
                        }
                    });

                } else {
                    console.error('Error: Passwords did not match the stored password');
                }
            } else {
                console.error('Error reading user data:', err);
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }

};

// Handler - token -get
// Required data: N/A
// Optional data:  id
handlers._tokens.get = function (data, callback) {
    // Check if the id is valid
    const id = typeof data.queryStringObject.id === 'string' &&
        data.queryStringObject.id.trim().length === 20
        ? data.queryStringObject.id.trim()
        : false;

    if (id) {
        // Look up the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404, { Error: "Token not found." });
            }
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Handler - tokens - delete
// Required data: id
// Optional data: nones
handlers._tokens.delete = (data, callback) => {
    const id = typeof data.payload.id === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;

    if (id) {
        _data.delete('tokens', id, (err) => {
            if (!err) {
                callback(200, { Message: 'Token deleted successfully' });
            } else {
                callback(500, { Error: 'Could not delete the token' });
            }
        });
    } else {
        callback(400, { Error: 'Missing required field' });
    }
};

// Token verification helper
handlers._tokens.verifyToken = (id, email, callback) => {
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // Check token validity
            if (tokenData.email === email && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};


// Menu handler
handlers.menu = function (data, callback) {
    const acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menu[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for menu submethods
handlers._menu = {};

// Menu - get
// Required data: token
// Optional data: none
handlers._menu.get = function (data, callback) {
    // Verify if the token is valid
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
    _data.read('tokens', token, function (err, tokenData) {
        if (!err && tokenData) {
            const menuItems = [
                { id: '1', name: 'Margherita', price: 500 },
                { id: '2', name: 'Pepperoni', price: 700 },
                { id: '3', name: 'Hawaiian', price: 600 },
                { id: '4', name: 'Veggie', price: 650 }
            ];
            callback(200, menuItems);
        } else {
            callback(403, { 'Error': 'Missing or invalid token' });
        }
    });
};



// Cart handler
handlers.cart = function (data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all cart methods
handlers._cart = {};

// Cart - post (Create a new cart)
handlers._cart.post = function (data, callback) {
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
    const itemId = typeof (data.payload.itemId) === 'string' ? data.payload.itemId.trim() : false;
    const quantity = typeof (data.payload.quantity) === 'number' && data.payload.quantity > 0 ? data.payload.quantity : false;

    if (token && itemId && quantity) {
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                const email = tokenData.email;

                // Create cart object
                const cartId = helpers.createRandomString(20);
                const cartObject = {
                    id: cartId,
                    email,
                    items: [{ itemId, quantity }]
                };

                // Store the cart
                _data.create('cart', cartId, cartObject, function (err) {
                    if (!err) {
                        callback(200, cartObject);
                    } else {
                        callback(500, { 'Error': 'Could not create the new cart' });
                    }
                });
            } else {
                callback(403, { 'Error': 'Invalid token' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};


// Cart - get (Retrieve a cart)
handlers._cart.get = function (data, callback) {
    const cartId = typeof (data.queryStringObject.cartId) === 'string' && data.queryStringObject.cartId.trim().length === 20 ? data.queryStringObject.cartId.trim() : false;
    if (cartId) {
        _data.read('cart', cartId, function (err, cartData) {
            if (!err && cartData) {
                callback(200, cartData);
            } else {
                callback(404, { 'Error': 'Cart not found' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};


// Cart - put (Update a cart)
handlers._cart.put = function (data, callback) {
    const cartId = typeof (data.payload.cartId) === 'string' && data.payload.cartId.trim().length === 20 ? data.payload.cartId.trim() : false;
    const itemId = typeof (data.payload.itemId) === 'string' ? data.payload.itemId.trim() : false;
    const quantity = typeof (data.payload.quantity) === 'number' && data.payload.quantity > 0 ? data.payload.quantity : false;

    if (cartId && itemId && quantity) {
        _data.read('cart', cartId, function (err, cartData) {
            if (!err && cartData) {
                const items = cartData.items || [];

                // Find if the item already exists in the cart
                const existingItemIndex = items.findIndex(item => item.itemId === itemId);

                if (existingItemIndex > -1) {
                    // Update the quantity of the existing item
                    items[existingItemIndex].quantity = quantity;
                } else {
                    // Add new item to the cart
                    items.push({ itemId, quantity });
                }

                cartData.items = items;

                _data.update('cart', cartId, cartData, function (err) {
                    if (!err) {
                        callback(200, cartData);
                    } else {
                        callback(500, { 'Error': 'Could not update the cart' });
                    }
                });
            } else {
                callback(404, { 'Error': 'Cart not found' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};


// Cart - delete (Delete a cart)
handlers._cart.delete = function (data, callback) {
    const cartId = typeof (data.payload.cartId) === 'string' && data.payload.cartId.trim().length === 20 ? data.payload.cartId.trim() : false;

    if (cartId) {
        _data.read('cart', cartId, function (err, cartData) {
            if (!err && cartData) {
                _data.delete('cart', cartId, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the cart' });
                    }
                });
            } else {
                callback(404, { 'Error': 'Cart not found' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};




// Orders 
handlers.orders = function (data, callback) {
    const acceptableMethods = ['post', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the orders submethods 
handlers._orders = {};

// Orders - post
handlers._orders.post = function (data, callback) {
    const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
    const itemId = typeof (data.payload.itemId) === 'string' ? data.payload.itemId.trim() : false;
    const amount = typeof (data.payload.amount) === 'number' && data.payload.amount > 0 ? data.payload.amount : false;

    if (token && itemId && amount) {
        _data.read('tokens', token, function (err, tokenData) {
            if (!err && tokenData) {
                const userEmail = tokenData.email;  // Correct variable name

                _data.read('users', userEmail, function (err, userData) {  // Corrected here
                    if (!err && userData) {
                        const orderId = helpers.createRandomString(20);
                        const orderObject = {
                            id: orderId,
                            userEmail,
                            itemId,
                            amount,
                            status: 'pending'
                        };

                        _data.create('orders', orderId, orderObject, function (err) {
                            if (!err) {
                                helpers.processStripePayment(amount, function (err) {
                                    if (!err) {
                                        orderObject.status = 'paid';

                                        _data.update('orders', orderId, orderObject, function (err) {
                                            if (!err) {
                                                helpers.sendMailgunReceipt(userData.email, orderObject, function (err) {
                                                    if (!err) {
                                                        callback(200);
                                                    } else {
                                                        callback(500, { 'Error': 'Could not send email receipt' });
                                                    }
                                                });
                                            } else {
                                                callback(500, { 'Error': 'Could not update the order status to paid' });
                                            }
                                        });
                                    } else {
                                        callback(500, { 'Error': 'Could not process the payment' });
                                    }
                                });
                            } else {
                                callback(500, { 'Error': 'Could not create the new order' });
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};


// Orders - get
handlers._orders.get = function (data, callback) {
    // Check that id is valid
    const id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the order
        _data.read('orders', id, function (err, orderData) {
            if (!err && orderData) {
                callback(200, orderData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};








// Tokens Handler
handlers.tokens = (data, callback) => {
    callback(200, { message: 'Token endpoint hit' });
};

// Menu Handler
handlers.menu = (data, callback) => {
    callback(200, { message: 'Menu fetched successfully' });
};

/*
// Cart Handler
handlers.cart = (data, callback) => {
    callback(200, { message: 'Cart endpoint hit' });
}; */

// Order Handler
handlers.order = (data, callback) => {
    callback(200, { message: 'Order placed successfully' });
};

// Not Found Handler
handlers.notFound = (data, callback) => {
    callback(404, { error: 'Not Found' });
};

module.exports = handlers;