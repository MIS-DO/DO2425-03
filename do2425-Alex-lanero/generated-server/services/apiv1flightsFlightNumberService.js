'use strict'

var db = require('../db');
const logger = require('../logger');

module.exports.findByFlightNumber = function findByFlightNumber(req, res) {
    var FlightNumber = req.params.FlightNumber;
    if (!FlightNumber) {
        logger.warn("New GET request to /flights/:FlightNumber without FlightNumber, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New GET request to /flights/" + FlightNumber);
        db.find({ "FlightNumber": FlightNumber }, function (err, filteredFlights) {
            if (err) {
                logger.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredFlights.length > 0) {
                    var flight = filteredFlights[0]; //since we expect to have exactly ONE flight with this FlightNumber
                    logger.debug("Sending flight: " + JSON.stringify(flight, 2, null));
                    res.send(flight);
                } else {
                    logger.warn("There are no flights with FlightNumber " + FlightNumber);
                    res.status(404).send(); // not found
                }
            }
        });
    }
};

module.exports.updateFlight = function updateFlight(req, res) {
    var updatedFlight = req.body;
    var FlightNumber = req.params.FlightNumber;
    if (!updatedFlight) {
        logger.warn("New PUT request to /flights/ without flights, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New PUT request to /flights/" + FlightNumber + " with data " + JSON.stringify(updatedFlights, 2, null));
        if (!updatedFlight.FlightNumber || !updatedFlight.phone || !updatedFlight.email) {
            logger.warn("The flight " + JSON.stringify(updatedFlight, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else { 
            db.find({ "FlightNumber": updatedFlight.FlightNumber }, function (err, flights) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (flights.length > 0) {
                        db.update({ FlightNumber: FlightNumber }, updatedFlight);
                        logger.debug("Modifying flights with FlightNumber " + FlightNumber + " with data " + JSON.stringify(updatedFlight, 2, null));
                        res.status(204).send(); // no content
                    } else {
                        logger.warn("There are not any flights with FlightNumber " + FlightNumber);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
};

module.exports.deleteFlight = function deleteFlight(req, res) {
    var FlightNumber = req.params.FlightNumber;
    if (!FlightNumber) {
        logger.warn("New DELETE request to /flights/:FlightNumber without FlightNumber, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New DELETE request to /flights/" + FlightNumber);
        db.remove({ "FlightNumber": FlightNumber }, function (err, numRemoved) {
            if (err) {
                logger.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                logger.info("Flights removed: " + numRemoved);
                if (numRemoved === 1) {
                    logger.debug("The flight with FlightNumber " + FlightNumber + " has been succesfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    logger.warn("There are no flights to delete");
                    res.status(404).send(); // not found
                }
            }
        });
    }
};

