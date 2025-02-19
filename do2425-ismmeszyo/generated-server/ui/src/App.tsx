import React, { useState, useEffect, useCallback } from "react"
import { getOrders, createOrder, updateOrder, deleteOrder } from "./api"
import type { Order, Product } from "./types"

const App = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const initialOrderState: Order = {
    id: "",
    clienteId: "",
    productos: [],
    total: 0,
    entregado: false,
  }

  const [newOrder, setNewOrder] = useState<Order>(initialOrderState)

  const initialProductState: Product = {
    id: "",
    nombre: "",
    cantidad: 0,
    precioUnitario: 0,
  }

  const [newProduct, setNewProduct] = useState<Product>(initialProductState)
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders()
      setOrders(data)
      setError("")
    } catch (err) {
      setError("Error al cargar los pedidos")
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const calculateTotal = (products: Product[]): number => {
    return products.reduce((sum, product) => {
      return sum + product.cantidad * product.precioUnitario
    }, 0)
  }

  const handleAddOrder = async () => {
    try {
      setError("")
      setSuccess("")

      if (!newOrder.id || !newOrder.clienteId || !newOrder.productos.length) {
        setError("Por favor, complete todos los campos requeridos")
        return
      }

      const orderToCreate: Order = {
        ...newOrder,
        total: calculateTotal(newOrder.productos),
      }

      await createOrder(orderToCreate)
      setSuccess("Pedido creado exitosamente")
      setNewOrder(initialOrderState)
      fetchOrders()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Ya existe un pedido con este ID")
      } else if (err.response?.status === 422) {
        setError("Datos del pedido inválidos")
      } else {
        setError("Error al crear el pedido")
      }
    }
  }

  const handleUpdateOrder = async () => {
    try {
      setError("")
      setSuccess("")

      if (!editingId || !newOrder.id || !newOrder.clienteId || !newOrder.productos.length) {
        setError("Por favor, complete todos los campos requeridos")
        return
      }

      const orderToUpdate: Order = {
        ...newOrder,
        total: calculateTotal(newOrder.productos),
      }

      await updateOrder(editingId, orderToUpdate)
      setSuccess("Pedido actualizado exitosamente")
      setEditingId(null)
      setNewOrder(initialOrderState)
      fetchOrders()
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Pedido no encontrado")
      } else if (err.response?.status === 422) {
        setError("Datos del pedido inválidos")
      } else {
        setError("Error al actualizar el pedido")
      }
    }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      setError("")
      setSuccess("")
      await deleteOrder(id)
      setSuccess("Pedido eliminado exitosamente")
      fetchOrders()
    } catch (err) {
      setError("Error al eliminar el pedido")
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.id || !newProduct.nombre || newProduct.cantidad <= 0 || newProduct.precioUnitario <= 0) {
      setError("Por favor, complete todos los campos del producto correctamente")
      return
    }

    setNewOrder((prevOrder) => ({
      ...prevOrder,
      productos: [...prevOrder.productos, newProduct],
    }))
    setNewProduct(initialProductState)
    setError("")
  }

  const startEditing = (order: Order) => {
    setEditingId(order.id)
    setNewOrder(order)
    setError("")
    setSuccess("")
  }

  return (
    <div className="App">
      <h1>Orders Management</h1>
      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}
      {success && <div style={{ color: "green", margin: "10px 0" }}>{success}</div>}
      <div>
        <h2>{editingId ? "Edit Order" : "New Order"}</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Order ID"
            value={newOrder.id}
            onChange={(e) => setNewOrder({ ...newOrder, id: e.target.value })}
            disabled={!!editingId}
          />
          <input
            type="text"
            placeholder="Client ID"
            value={newOrder.clienteId}
            onChange={(e) => setNewOrder({ ...newOrder, clienteId: e.target.value })}
          />
        </div>

        <h3>Products in Order</h3>
        <div style={{ marginBottom: "20px" }}>
          {newOrder.productos.map((product, index) => (
            <div key={index}>
              {product.nombre} (x{product.cantidad}) - ${product.precioUnitario} each = $
              {product.cantidad * product.precioUnitario}
            </div>
          ))}
          <div>Total: ${calculateTotal(newOrder.productos)}</div>
        </div>

        <h3>Add Product</h3>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Product ID"
            value={newProduct.id}
            onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.cantidad || ""}
            onChange={(e) => setNewProduct({ ...newProduct, cantidad: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Unit Price"
            value={newProduct.precioUnitario || ""}
            onChange={(e) => setNewProduct({ ...newProduct, precioUnitario: Number(e.target.value) })}
          />
          <button onClick={handleAddProduct}>Add Product</button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Delivered:
            <input
              type="checkbox"
              checked={newOrder.entregado}
              onChange={(e) => setNewOrder({ ...newOrder, entregado: e.target.checked })}
            />
          </label>
        </div>

        <button onClick={editingId ? handleUpdateOrder : handleAddOrder}>
          {editingId ? "Update Order" : "Add Order"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null)
              setNewOrder(initialOrderState)
              setError("")
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <h2>Orders List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client ID</th>
            <th>Products</th>
            <th>Total</th>
            <th>Delivered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.clienteId}</td>
              <td>
                {order.productos.map((p) => (
                  <div key={p.id}>
                    {p.nombre} (x{p.cantidad}): ${p.cantidad * p.precioUnitario}
                  </div>
                ))}
              </td>
              <td>${order.total}</td>
              <td>{order.entregado ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => startEditing(order)}>Edit</button>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App