// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Se toman las URLs base a partir de variables de entorno o se asignan los valores por defecto.
const ordersUrl = process.env.ORDERS_URL || 'http://orders:8080';
const flightsUrl = process.env.FLIGHTS_URL || 'http://flights:8080';

app.get('/combined', async (req, res) => {
  try {
    // Llamadas paralelas a las rutas actualizadas
    const [ordersResponse, flightsResponse] = await Promise.all([
      axios.get(`${ordersUrl}/api/v1/orders`),
      axios.get(`${flightsUrl}/api/v1/flights`)
    ]);

    res.json({
      orders: ordersResponse.data,
      flights: flightsResponse.data
    });
  } catch (error) {
    console.error('Error al obtener datos de las APIs:', error.message);
    res.status(500).json({ error: 'Error al obtener datos de las APIs' });
  }
});

app.listen(PORT, () => console.log(`Gateway API corriendo en el puerto ${PORT}`));
