// hooks/useClientes.ts
import { useState, useEffect, useCallback } from 'react';
import { clienteService } from '../services/api/ClienteService';
import type { Cliente } from '../types/Cliente';
import type { ApiError } from '../services/api/Base';

interface UseClientesReturn {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCliente: (cliente: Omit<Cliente, 'id'>) => Promise<boolean>;
  updateCliente: (id: number, cliente: Cliente) => Promise<boolean>;
  deleteCliente: (id: number) => Promise<boolean>;
  restoreCliente: (id: number) => Promise<boolean>;
  searchClientes: (termino: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  isSearching: boolean;
  searchTerm: string;
}

export const useClientes = (): UseClientesReturn => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleError = (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as ApiError).message;
    }
    return 'Ha ocurrido un error inesperado';
  };

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.obtenerTodos();
      setClientes(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error fetching clientes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchClientes = useCallback(async (termino: string) => {
    try {
      setIsSearching(true);
      setError(null);
      setSearchTerm(termino);
      
      const data = await clienteService.buscar(termino);
      setClientes(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error searching clientes:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setSearchTerm('');
    await fetchClientes();
  }, [fetchClientes]);

  const createCliente = useCallback(async (cliente: Omit<Cliente, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      await clienteService.crear(cliente);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchClientes(searchTerm);
      } else {
        await fetchClientes();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error creating cliente:', err);
      return false;
    }
  }, [fetchClientes, searchClientes, searchTerm]);

  const updateCliente = useCallback(async (id: number, cliente: Cliente): Promise<boolean> => {
    try {
      setError(null);
      await clienteService.actualizar(id, cliente);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchClientes(searchTerm);
      } else {
        await fetchClientes();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error updating cliente:', err);
      return false;
    }
  }, [fetchClientes, searchClientes, searchTerm]);

  const deleteCliente = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await clienteService.eliminar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchClientes(searchTerm);
      } else {
        await fetchClientes();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error deleting cliente:', err);
      return false;
    }
  }, [fetchClientes, searchClientes, searchTerm]);

  const restoreCliente = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await clienteService.restaurar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchClientes(searchTerm);
      } else {
        await fetchClientes();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error restoring cliente:', err);
      return false;
    }
  }, [fetchClientes, searchClientes, searchTerm]);

  const refetch = useCallback(async () => {
    if (searchTerm) {
      await searchClientes(searchTerm);
    } else {
      await fetchClientes();
    }
  }, [fetchClientes, searchClientes, searchTerm]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return {
    clientes,
    loading,
    error,
    refetch,
    createCliente,
    updateCliente,
    deleteCliente,
    restoreCliente,
    searchClientes,
    clearSearch,
    isSearching,
    searchTerm
  };
};