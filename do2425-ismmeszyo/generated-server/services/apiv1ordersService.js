'use strict';

const db = require('../db');
const logger = require('../logger');
// Obtiene todos los pedidos
module.exports.getOrders = function getOrders(req, res) {
    logger.info("New GET request to /orders");
    db.find({}, function (err, orders) {
        if (err) {
            logger.error("Error getting data from DB");
            res.status(500).send(); // internal server error
        } else {
            logger.debug("Sending orders: " + JSON.stringify(orders, null, 2));
            res.send(orders); // send all orders
        }
    });
};

// Agrega un nuevo pedido
module.exports.addOrder = function addOrder(req, res) {
    var newOrder = req.body;

    if (!newOrder) {
        logger.warn("New POST request to /orders/ without order, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New POST request to /orders with body: " + JSON.stringify(newOrder, null, 2));
        if (!newOrder.id || !newOrder.clienteId || !Array.isArray(newOrder.productos) || typeof newOrder.entregado !== 'boolean') {
            logger.warn("The order " + JSON.stringify(newOrder, null, 2) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "id": newOrder.id }, function (err, orders) {
                if (err) {
                    logger.error("Error getting data from DB");
                    res.status(500).send(); // internal server error
                } else {
                    if (orders.length > 0) {
                        logger.warn("The order " + JSON.stringify(newOrder, null, 2) + " already exists, sending 409...");
                        res.status(409).send(); // conflict
                    } else {
                        logger.debug("Adding order " + JSON.stringify(newOrder, null, 2));
                        db.insert(newOrder);
                        res.status(201).send(); // created
                    }
                }
            });
        }
    }
};

