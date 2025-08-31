// services/api/ProductoService.ts
import { BaseService } from './Base';
import type { Producto } from '../../types/Producto';

export class ProductoService extends BaseService {
  private readonly endpoint = '/productos';

  async obtenerTodos(): Promise<Producto[]> {
    const response = await this.get<Producto[]>(this.endpoint);
    return response;
  }

  async obtenerPorId(id: number): Promise<Producto> {
    const response = await this.get<Producto>(`${this.endpoint}/${id}`);
    return response;
  }

  async crear(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const response = await this.post<Producto>(this.endpoint, producto);
    return response;
  }

  async actualizar(id: number, producto: Producto): Promise<void> {
    await this.put(`${this.endpoint}/${id}`, producto);
  }

  async actualizarParcialmente(id: number, datos: Partial<Producto>): Promise<void> {
    await this.patch(`${this.endpoint}/${id}`, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.delete(`${this.endpoint}/${id}`);
  }

  async restaurar(id: number): Promise<void> {
    await this.patch(`${this.endpoint}/${id}/restaurar`, {});
  }

  async buscar(termino: string): Promise<Producto[]> {
    if (!termino.trim()) {
      return this.obtenerTodos();
    }
    
    const response = await this.get<Producto[]>(`${this.endpoint}/buscar`, {
      termino: termino.trim()
    });
    return response;
  }
}

export const productoService = new ProductoService();