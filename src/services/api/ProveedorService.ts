// services/api/ProveedorService.ts
import { BaseService } from './Base';
import type { Proveedor } from '../../types/Proveedor';

export class ProveedorService extends BaseService {
  private readonly endpoint = '/proveedor';

  async obtenerTodos(): Promise<Proveedor[]> {
    const response = await this.get<Proveedor[]>(this.endpoint);
    return response;
  }

  async obtenerPorId(id: number): Promise<Proveedor> {
    const response = await this.get<Proveedor>(`${this.endpoint}/${id}`);
    return response;
  }

  async crear(proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    const response = await this.post<Proveedor>(this.endpoint, proveedor);
    return response;
  }

  async actualizar(id: number, proveedor: Proveedor): Promise<void> {
    await this.put(`${this.endpoint}/${id}`, proveedor);
  }

  async actualizarParcialmente(id: number, datos: Partial<Proveedor>): Promise<void> {
    await this.patch(`${this.endpoint}/${id}`, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.delete(`${this.endpoint}/${id}`);
  }

  async restaurar(id: number): Promise<void> {
    await this.patch(`${this.endpoint}/${id}/restaurar`, {});
  }

  async buscar(termino: string): Promise<Proveedor[]> {
    if (!termino.trim()) {
      return this.obtenerTodos();
    }
    
    const response = await this.get<Proveedor[]>(`${this.endpoint}/buscar`, {
      termino: termino.trim()
    });
    return response;
  }
}

export const proveedorService = new ProveedorService();