const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/apiv1ordersController'); // Ajusta el path según tu estructura de carpetas
const ordersController2 = require('../controllers/apiv1ordersidController'); // Ajusta el path según tu estructura de carpetas

// Ruta para obtener todos los pedidos
router.get('/orders', ordersController.getOrders);

// Ruta para obtener un pedido por ID
router.get('/orders/:id', ordersController2.findByid);

// Ruta para agregar un nuevo pedido
router.post('/orders', ordersController.addOrder);

// Ruta para actualizar un pedido por ID
router.put('/orders/:id', ordersController2.updateOrder);

// Ruta para eliminar un pedido por ID
router.delete('/orders/:id', ordersController2.deleteOrder);

module.exports = router;
