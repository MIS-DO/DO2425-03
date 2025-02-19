const service = require('../services/apiv1flightsFlightNumberService.js');

module.exports.findByFlightNumber = function findByFlightNumber(req, res) {
    service.findByFlightNumber(req, res);
}

module.exports.updateFlight = function updateFlight(req, res) {
    service.updateFlight(req, res);
}

module.exports.deleteFlight = function deleteFlight(req, res) {
    service.deleteFlight(req, res);
}

