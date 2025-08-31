export interface Cliente {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  activo?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}



