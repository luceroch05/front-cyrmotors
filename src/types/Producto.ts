// types/Producto.ts
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  proveedorId: number;
  activo?: boolean;
  proveedor?: {
    id: number;
    razonSocial: string;
    ruc: string;
    telefono: string;
    activo: boolean;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}