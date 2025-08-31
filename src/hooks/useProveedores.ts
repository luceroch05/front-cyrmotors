// hooks/useProveedores.ts
import { useState, useEffect, useCallback } from 'react';
import { proveedorService } from '../services/api/ProveedorService';
import type { Proveedor } from '../types/Proveedor';
import type { ApiError } from '../services/api/Base';

interface UseProveedoresReturn {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProveedor: (proveedor: Omit<Proveedor, 'id'>) => Promise<boolean>;
  updateProveedor: (id: number, proveedor: Proveedor) => Promise<boolean>;
  deleteProveedor: (id: number) => Promise<boolean>;
  restoreProveedor: (id: number) => Promise<boolean>;
  searchProveedores: (termino: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  isSearching: boolean;
  searchTerm: string;
}

export const useProveedores = (): UseProveedoresReturn => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
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

  const fetchProveedores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proveedorService.obtenerTodos();
      setProveedores(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error fetching proveedores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProveedores = useCallback(async (termino: string) => {
    try {
      setIsSearching(true);
      setError(null);
      setSearchTerm(termino);
      
      const data = await proveedorService.buscar(termino);
      setProveedores(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error searching proveedores:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setSearchTerm('');
    await fetchProveedores();
  }, [fetchProveedores]);

  const createProveedor = useCallback(async (proveedor: Omit<Proveedor, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      await proveedorService.crear(proveedor);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProveedores(searchTerm);
      } else {
        await fetchProveedores();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error creating proveedor:', err);
      return false;
    }
  }, [fetchProveedores, searchProveedores, searchTerm]);

  const updateProveedor = useCallback(async (id: number, proveedor: Proveedor): Promise<boolean> => {
    try {
      setError(null);
      await proveedorService.actualizar(id, proveedor);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProveedores(searchTerm);
      } else {
        await fetchProveedores();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error updating proveedor:', err);
      return false;
    }
  }, [fetchProveedores, searchProveedores, searchTerm]);

  const deleteProveedor = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await proveedorService.eliminar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProveedores(searchTerm);
      } else {
        await fetchProveedores();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error deleting proveedor:', err);
      return false;
    }
  }, [fetchProveedores, searchProveedores, searchTerm]);

  const restoreProveedor = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await proveedorService.restaurar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProveedores(searchTerm);
      } else {
        await fetchProveedores();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error restoring proveedor:', err);
      return false;
    }
  }, [fetchProveedores, searchProveedores, searchTerm]);

  const refetch = useCallback(async () => {
    if (searchTerm) {
      await searchProveedores(searchTerm);
    } else {
      await fetchProveedores();
    }
  }, [fetchProveedores, searchProveedores, searchTerm]);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  return {
    proveedores,
    loading,
    error,
    refetch,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    restoreProveedor,
    searchProveedores,
    clearSearch,
    isSearching,
    searchTerm
  };
};