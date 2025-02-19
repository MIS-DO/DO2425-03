'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var path = require('path');
const logger = require('./logger');

// Connection URL
//const mongodbHost = process.env.MONGODB_HOST || "mongo";
//const mongodbHost = process.env.MONGODB_HOST || "mongodb";
const mongodbHost = process.env.MONGODB_HOST || "mongodb-service";
const url = 'mongodb://' + mongodbHost + ':27017';

// Database Name
const dbName = 'orders';

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
            setTimeout(function() {process.exit(1)}, 1000)
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
    var sampleOrders = [
        {
            "id": "order-001",
            "clienteId": "cli-001",
            "productos": [
                {
                    "id": "prod-001",
                    "nombre": "Producto A",
                    "cantidad": 2,
                    "precioUnitario": 10.0
                },
                {
                    "id": "prod-002",
                    "nombre": "Producto B",
                    "cantidad": 1,
                    "precioUnitario": 20.0
                }
            ],
            "total": 40.0,
            "entregado": false
        },
        {
            "id": "order-002",
            "clienteId": "cli-002",
            "productos": [
                {
                    "id": "prod-003",
                    "nombre": "Producto C",
                    "cantidad": 5,
                    "precioUnitario": 5.0
                }
            ],
            "total": 25.0,
            "entregado": true
        }
    ];
    return this.getConnection().insert(sampleOrders);
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