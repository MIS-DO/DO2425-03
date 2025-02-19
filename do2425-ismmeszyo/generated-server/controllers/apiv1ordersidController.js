const service = require('../services/apiv1ordersidService.js');

module.exports.findByid = function findByid(req, res) {
    service.findByid(req, res);
}

module.exports.updateOrder = function updateOrder(req, res) {
    service.updateOrder(req, res);
}

module.exports.deleteOrder = function deleteOrder(req, res) {
    service.deleteOrder(req, res);
}

