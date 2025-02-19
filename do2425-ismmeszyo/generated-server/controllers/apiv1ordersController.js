const service = require('../services/apiv1ordersService.js');

module.exports.getOrders = function getOrders(req, res) {
    service.getOrders(req, res);
}

module.exports.addOrder = function addOrder(req, res) {
    service.addOrder(req, res);
}

