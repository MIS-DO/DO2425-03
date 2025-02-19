export type Product = {
    id: string
    nombre: string
    cantidad: number
    precioUnitario: number
  }
  
  export type Order = {
    id: string
    clienteId: string
    productos: Product[]
    total: number
    entregado: boolean
  }
  
  