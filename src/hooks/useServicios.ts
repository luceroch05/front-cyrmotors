// hooks/useServicios.ts
import { useState, useEffect, useCallback } from 'react';
import { servicioService } from '../services/api/ServicioService';
import type { Servicio } from '../types/Servicio';
import type { ApiError } from '../services/api/Base';

interface UseServiciosReturn {
  servicios: Servicio[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createServicio: (servicio: Omit<Servicio, 'id'>) => Promise<boolean>;
  updateServicio: (id: number, servicio: Servicio) => Promise<boolean>;
  deleteServicio: (id: number) => Promise<boolean>;
  restoreServicio: (id: number) => Promise<boolean>;
  updatePartial: (id: number, datos: Partial<Servicio>) => Promise<boolean>;
  searchServicios: (termino: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  isSearching: boolean;
  searchTerm: string;
}

export const useServicios = (): UseServiciosReturn => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
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

  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicioService.obtenerTodos();
      setServicios(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error fetching servicios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchServicios = useCallback(async (termino: string) => {
    try {
      setIsSearching(true);
      setError(null);
      setSearchTerm(termino);
      
      const data = await servicioService.buscar(termino);
      setServicios(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error searching servicios:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setSearchTerm('');
    await fetchServicios();
  }, [fetchServicios]);

  const createServicio = useCallback(async (servicio: Omit<Servicio, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      await servicioService.crear(servicio);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchServicios(searchTerm);
      } else {
        await fetchServicios();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error creating servicio:', err);
      return false;
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  const updateServicio = useCallback(async (id: number, servicio: Servicio): Promise<boolean> => {
    try {
      setError(null);
      await servicioService.actualizar(id, servicio);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchServicios(searchTerm);
      } else {
        await fetchServicios();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error updating servicio:', err);
      return false;
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  const deleteServicio = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await servicioService.eliminar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchServicios(searchTerm);
      } else {
        await fetchServicios();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error deleting servicio:', err);
      return false;
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  const restoreServicio = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await servicioService.restaurar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchServicios(searchTerm);
      } else {
        await fetchServicios();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error restoring servicio:', err);
      return false;
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  const updatePartial = useCallback(async (id: number, datos: Partial<Servicio>): Promise<boolean> => {
    try {
      setError(null);
      await servicioService.actualizarParcialmente(id, datos);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchServicios(searchTerm);
      } else {
        await fetchServicios();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error updating servicio partially:', err);
      return false;
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  const refetch = useCallback(async () => {
    if (searchTerm) {
      await searchServicios(searchTerm);
    } else {
      await fetchServicios();
    }
  }, [fetchServicios, searchServicios, searchTerm]);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  return {
    servicios,
    loading,
    error,
    refetch,
    createServicio,
    updateServicio,
    deleteServicio,
    restoreServicio,
    updatePartial,
    searchServicios,
    clearSearch,
    isSearching,
    searchTerm
  };
};