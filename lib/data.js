/*
 * Library for storing and editing data
 *
*/

// Dependencies
const fs = require('fs');
const path = require('path');

// Instantiate the data object
const lib = {};

// Base Directory for data storage
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
    const filePath = lib.baseDir + dir + '/' + file + '.json';

    fs.open(filePath, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false); // Success
                        } else {
                            console.error('Error closing file:', err);
                            callback('Error closing new file');
                        }
                    });
                } else {
                    console.error('Error writing to file:', err);
                    callback('Error writing to new file');
                }
            });
        } else {
            console.error('Error opening file:', err);
            callback('Could not create file, it may already exist');
        }
    });
};



// Read data from a file
lib.read = (dir, file, callback) => {
    const filePath = path.join(lib.baseDir, dir, `${file}.json`);
    console.log('Reading file at path:', filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err && data) {
            const parsedData = JSON.parse(data);
            callback(false, parsedData);
        } else {
            console.error('File read error:', err);
            callback(err, null);
        }
    });
};


// Update data inside a file
lib.update = (dir, file, data, callback) => {
    const filePath = path.join(lib.baseDir, dir, `${file}.json`);
    console.log('Updating file at path:', filePath);

    fs.open(filePath, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    console.error('Error closing file:', err);
                                    callback('Error closing the file');
                                }
                            });
                        } else {
                            console.error('Error writing to file:', err);
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    console.error('Error truncating file:', err);
                    callback('Error truncating file');
                }
            });
        } else {
            console.error('Error opening file for updating:', err);
            callback('Could not open the file for updating, it may not exist yet');
        }
    });
};


// Delete a file 
lib.delete = function (dir, file, callback) {
    const filePath = path.join(lib.baseDir, dir, `${file}.json`);
    console.log('Attempting to delete file at path:', filePath);

    fs.unlink(filePath, function (err) {
        if (!err) {
            callback(false); // Successfully deleted
        } else {
            console.error('Error deleting file:', err);
            callback('Error deleting the file');
        }
    });
};




module.exports = lib;