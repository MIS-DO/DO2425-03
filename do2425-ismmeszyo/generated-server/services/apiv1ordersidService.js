'use strict';

var db = require('../db');
const logger = require('../logger');

module.exports.findByid = function findById(req, res) {
    var id = req.params.id;
    if (!id) {
        logger.warn("New GET request to /orders/:id without id, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New GET request to /orders/" + id);
        db.find({ "id": id }, function (err, filteredOrders) {
            if (err) {
                logger.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredOrders.length > 0) {
                    var order = filteredOrders[0]; // since we expect to have exactly ONE order with this id
                    logger.debug("Sending order: " + JSON.stringify(order, null, 2));
                    res.send(order);
                } else {
                    logger.warn("There are no orders with id " + id);
                    res.status(404).send(); // not found
                }
            }
        });
    }
};

module.exports.updateOrder = function updateOrder(req, res) {
    var updatedOrder = req.body;
    var id = req.params.id;
    if (!updatedOrder) {
        logger.warn("New PUT request to /orders/ without order, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New PUT request to /orders/" + id + " with data " + JSON.stringify(updatedOrder, null, 2));
        if (!updatedOrder.id || !updatedOrder.clienteId || !Array.isArray(updatedOrder.productos) || typeof updatedOrder.entregado !== 'boolean') {
            logger.warn("The order " + JSON.stringify(updatedOrder, null, 2) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "id": id }, function (err, orders) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (orders.length > 0) {
                        db.update({ id: id }, updatedOrder);
                        logger.debug("Modifying order with id " + id + " with data " + JSON.stringify(updatedOrder, null, 2));
                        res.status(204).send(); // no content
                    } else {
                        logger.warn("There are not any orders with id " + id);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
};

module.exports.deleteOrder = function deleteOrder(req, res) {
    var id = req.params.id;
    if (!id) {
        logger.warn("New DELETE request to /orders/:id without id, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New DELETE request to /orders/" + id);
        db.remove({ "id": id }, function (err, numRemoved) {
            if (err) {
                logger.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                logger.info("Orders removed: " + numRemoved);
                if (numRemoved === 1) {
                    logger.debug("The order with id " + id + " has been successfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    logger.warn("There are no orders to delete with id " + id);
                    res.status(404).send(); // not found
                }
            }
        });
    }
};
