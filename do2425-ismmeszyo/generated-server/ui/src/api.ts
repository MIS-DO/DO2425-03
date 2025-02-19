import axios from "axios"
import type { Order } from "./types"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://dev.do2425-orders.es/api/orders"

// Obtiene todos los pedidos
export const getOrders = async (): Promise<Order[]> => {
  const response = await axios.get(`${API_BASE_URL}`)
  return response.data
}

// Obtiene un pedido por ID
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`)
  return response.data
}

// Crea un nuevo pedido
export const createOrder = async (order: Order): Promise<Order> => {
  const response = await axios.post(`${API_BASE_URL}`, order)
  return response.data
}

// Actualiza un pedido existente
export const updateOrder = async (id: string, order: Order): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${id}`, order)
}

// Elimina un pedido por ID
export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`)
}

