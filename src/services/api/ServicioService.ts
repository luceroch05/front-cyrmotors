// services/api/ServicioService.ts
import { BaseService } from './Base';
import type { Servicio } from '../../types/Servicio';

export class ServicioService extends BaseService {
  private readonly endpoint = '/servicio';

  async obtenerTodos(): Promise<Servicio[]> {
    const response = await this.get<Servicio[]>(this.endpoint);
    return response;
  }

  async obtenerPorId(id: number): Promise<Servicio> {
    const response = await this.get<Servicio>(`${this.endpoint}/${id}`);
    return response;
  }

  async crear(servicio: Omit<Servicio, 'id'>): Promise<Servicio> {
    const response = await this.post<Servicio>(this.endpoint, servicio);
    return response;
  }

  async actualizar(id: number, servicio: Servicio): Promise<void> {
    await this.put(`${this.endpoint}/${id}`, servicio);
  }

  async actualizarParcialmente(id: number, datos: Partial<Servicio>): Promise<void> {
    await this.patch(`${this.endpoint}/${id}`, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.delete(`${this.endpoint}/${id}`);
  }

  async restaurar(id: number): Promise<void> {
    await this.patch(`${this.endpoint}/${id}/restaurar`, {});
  }

  async buscar(termino: string): Promise<Servicio[]> {
      if (!termino.trim()) {
        return this.obtenerTodos();
      }
      
      const response = await this.get<Servicio[]>(`${this.endpoint}/buscar`, {
        termino: termino.trim()
      });
      return response;
  }
}

export const servicioService = new ServicioService();