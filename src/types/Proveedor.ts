// types/Proveedor.ts
export interface Proveedor {
  id: number;
  razonSocial: string;
  ruc: string;
  telefono: string;
  activo?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}