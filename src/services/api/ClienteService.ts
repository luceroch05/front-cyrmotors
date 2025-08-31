// services/api/ClienteService.ts
import { BaseService } from './Base';
import type { Cliente } from '../../types/Cliente';

export class ClienteService extends BaseService {
  private readonly endpoint = '/cliente';

  async obtenerTodos(): Promise<Cliente[]> {
    const response = await this.get<Cliente[]>(this.endpoint);
    return response;
  }

  async obtenerPorId(id: number): Promise<Cliente> {
    const response = await this.get<Cliente>(`${this.endpoint}/${id}`);
    return response;
  }

  async crear(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await this.post<Cliente>(this.endpoint, cliente);
    return response;
  }

  async actualizar(id: number, cliente: Cliente): Promise<void> {
    await this.put(`${this.endpoint}/${id}`, cliente);
  }

  async actualizarParcialmente(id: number, datos: Partial<Cliente>): Promise<void> {
    await this.patch(`${this.endpoint}/${id}`, datos);
  }

  async eliminar(id: number): Promise<void> {
    await this.delete(`${this.endpoint}/${id}`);
  }

  async restaurar(id: number): Promise<void> {
    await this.patch(`${this.endpoint}/${id}/restaurar`, {});
  }

  async buscar(termino: string): Promise<Cliente[]> {
    if (!termino.trim()) {
      return this.obtenerTodos();
    }
    
    const response = await this.get<Cliente[]>(`${this.endpoint}/buscar`, {
      termino: termino.trim()
    });
    return response;
  }
}

export const clienteService = new ClienteService();