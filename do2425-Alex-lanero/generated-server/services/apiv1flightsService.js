'use strict'

var db = require('../db');
const logger = require('../logger');

module.exports.getFlights = function getFlights(req, res) {
    logger.info("New GET request to /flights");
    db.find({}, function (err, flights) {
        if (err) {
            logger.error('Error getting data from DB: ', err);
            res.status(500).send(); // internal server error
        } else {
            logger.debug("Sending flights: " + JSON.stringify(flights, 2, null));
            res.send(flights);
        }
    });
};

module.exports.addFlight = function addFlight(req, res) {
    //logger.warn(req)
    var newFlight = req.body;
    if (!newFlight) {
        logger.warn("New POST request to /flights/ without flight, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New POST request to /flights with body: " + JSON.stringify(newFlight, 2, null));
        if (!newFlight.Origin || !newFlight.FlightNumber || !newFlight.OnTime) {
            logger.warn("The flight " + JSON.stringify(newFlight, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "FlightNumber": newFlight.FlightNumber }, function (err, flights) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (flights.length > 0) {
                        logger.warn("The flight " + JSON.stringify(newFlight, 2, null) + " already extis, sending 409...");
                        res.status(409).send(); // conflict
                    } else {
                        logger.debug("Adding flight " + JSON.stringify(newFlight, 2, null));
                        db.insert(newFlight);
                        res.status(201).send(); // created
                    }
                }
            });
        }
    }
};

