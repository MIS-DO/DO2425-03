'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var path = require('path');

const logger = require('./logger');

// Connection URL
const mongodbHost = process.env.MONGODB_HOST || "mongo"
const url = 'mongodb://' + mongodbHost + ':27017';

// Database Name
const dbName = 'flights';

// Create a new MongoClient
const client = new MongoClient(url);

var _db;

//Creates the connection to the database
module.exports.connect = function connect(cb) {
    if (_db) {
        logger.warn("Trying to create the DB connection again!");
        return cb(null, _db);
    }
    client.connect(function (err) {
        if (err) {
            logger.error("Error connecting to DB!", err);
            setTimeout(function () {process.exit(1)}, 1000);
        }
        _db = client.db(dbName).collection(dbName);
        return cb(null, _db);
    });

};

//Return the connection to the database if it was previously created
module.exports.getConnection = function getConnection() {
    assert.ok(_db, "DB connection has not been created. Please call connect() first.");
    return _db;
};

//Helper method to initialize the database with sample data
module.exports.init = function init() {
    var sampleFlights = [
        {
            "Origin": "Barcelona",
            "FlightNumber": 123456,
            "OnTime": true
        },
        {
            "Origin": "Madrid",
            "FlightNumber": 234567,
            "OnTime": true
        },
        {
            "Origin": "Berlin",
            "FlightNumber": 345678,
            "OnTime": false
        },
        {
            "Origin": "Roma",
            "FlightNumber": 456789,
            "OnTime": true
        }
    ];
    return this.getConnection().insert(sampleFlights);
};

//Executes the query and return the result in the callback function
module.exports.find = function find(query, cb) {
    return this.getConnection().find(query).toArray(cb);
};

//Inserts a new document in the database
module.exports.insert = function insert(doc, cb) {
    return this.getConnection().insert(doc, cb);
};

//Updates a document that matches the query
module.exports.update = function update(query, newDoc, cb) {
    return this.getConnection().replaceOne(query, newDoc, cb);
};

//Removes a document from the database
module.exports.remove = function remove(query, cb) {
    return this.getConnection().remove(query, function (err, res) {
        cb(err, res.deletedCount);
    });
};