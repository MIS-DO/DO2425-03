const service = require('../services/apiv1flightsService.js');

module.exports.getFlights = function getFlights(req, res) {
    service.getFlights(req, res);
}

module.exports.addFlight = function addFlight(req, res) {
    service.addFlight(req, res);
}

