const http = require('http');
const express = require("express");
const { initialize } = require('@oas-tools/core');
const bodyParser = require('body-parser');
const cors = require('cors');
const ordersRoutes = require('./routes/routes');


const serverPort = 8080;
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
const logger = require('./logger');

const config = {}
app.use(cors());

app.get("/orders", (req, res) => {
  // Aquí puedes obtener los pedidos de la base de datos o devolver un mensaje
  db.find({}, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching orders" });
    }
    res.json(orders);  // Responde con la lista de pedidos
  });
});

// Obtiene un pedido por ID
app.use('/api', ordersRoutes);

// Crea un nuevo pedido
app.post("/orders", (req, res) => {
  const newOrder = req.body;

  // Validar los datos del pedido
  if (!newOrder.id || !newOrder.clienteId || !newOrder.productos) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insertar el pedido en la base de datos
  db.insert(newOrder, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error inserting order" });
    }
    res.status(201).json(newOrder); // Devuelve el pedido creado
  });
});

// Initialize database before running the app
var db = require('./db');
db.connect(function (err, _db) {
  logger.info('Initializing DB ...');
  if(err) {
    logger.error('Error connecting to DB!', err);
    setTimeout(function() {process.exit(1)}, 1000)
  } else {
    db.find({}, function (err, contacts) {
      if(err) {
        logger.error('Error while getting initial data from DB!', err);
      } else {
        if (contacts.length === 0) {
          logger.info('Empty DB, loading initial data...');
          db.init();
      } else {
          logger.info('DB already has ' + contacts.length + ' contacts.');
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
