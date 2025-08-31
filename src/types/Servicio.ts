export interface Servicio {
    id: number;
    descripcion: string;
    precio: number;
    activo?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
