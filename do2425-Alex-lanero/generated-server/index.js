const http = require('http');
const express = require("express");
const cors = require("cors");
const { initialize } = require('@oas-tools/core');
const logger = require('./logger');


const serverPort = 8080;
const app = express();
app.use(express.json({limit: '50mb'}));

// 🔹 Configurar CORS antes de inicializar oas-tools
const allowedOrigins = [
  "http://localhost:5173",
  "http://do2425-flights.es",
  "http://dev.do2425-flights.es"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

const config = {
    oasFile: "./api/oas-doc.yaml",
    middleware: {
        security: {
            auth: {
            }
        }
    }
}

// Initialize database before running the app
var db = require('./db');
db.connect(function (err, _db) {
  logger.info('Initializing DB...');
  if(err) {
    logger.error('Error connecting to DB!', err);
    return 1;
  } else {
    db.find({}, function (err, flights) {
      if(err) {
        logger.error('Error while getting initial data from DB!', err);
      } else {
        if (flights.length === 0) {
          logger.info('Empty DB, loading initial data...');
          db.init();
      } else {
          logger.info('DB already has ' + flights.length + ' flights.');
      }
      }
    });
  }
});


initialize(app, config).then(() => {
    http.createServer(app).listen(serverPort, () => {
    logger.info("\nApp running at http://localhost:" + serverPort);
    logger.info("________________________________________________________________");
    if (!config?.middleware?.swagger?.disable) {
        logger.info('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
        logger.info("________________________________________________________________");
    }
    });
});
