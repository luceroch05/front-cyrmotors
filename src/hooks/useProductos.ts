// hooks/useProductos.ts
import { useState, useEffect, useCallback } from 'react';
import { productoService } from '../services/api/ProductoService';
import type { Producto } from '../types/Producto';
import type { ApiError } from '../services/api/Base';

interface UseProductosReturn {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProducto: (producto: Omit<Producto, 'id'>) => Promise<boolean>;
  updateProducto: (id: number, producto: Producto) => Promise<boolean>;
  deleteProducto: (id: number) => Promise<boolean>;
  restoreProducto: (id: number) => Promise<boolean>;
  searchProductos: (termino: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  isSearching: boolean;
  searchTerm: string;
}

export const useProductos = (): UseProductosReturn => {
  const [productos, setProductos] = useState<Producto[]>([]);
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

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.obtenerTodos();
      setProductos(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProductos = useCallback(async (termino: string) => {
    try {
      setIsSearching(true);
      setError(null);
      setSearchTerm(termino);
      
      const data = await productoService.buscar(termino);
      setProductos(data);
    } catch (err) {
      setError(handleError(err));
      console.error('Error searching productos:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setSearchTerm('');
    await fetchProductos();
  }, [fetchProductos]);

  const createProducto = useCallback(async (producto: Omit<Producto, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      await productoService.crear(producto);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProductos(searchTerm);
      } else {
        await fetchProductos();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error creating producto:', err);
      return false;
    }
  }, [fetchProductos, searchProductos, searchTerm]);

  const updateProducto = useCallback(async (id: number, producto: Producto): Promise<boolean> => {
    try {
      setError(null);
      await productoService.actualizar(id, producto);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProductos(searchTerm);
      } else {
        await fetchProductos();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error updating producto:', err);
      return false;
    }
  }, [fetchProductos, searchProductos, searchTerm]);

  const deleteProducto = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await productoService.eliminar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProductos(searchTerm);
      } else {
        await fetchProductos();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error deleting producto:', err);
      return false;
    }
  }, [fetchProductos, searchProductos, searchTerm]);

  const restoreProducto = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await productoService.restaurar(id);
      
      // Refrescar la lista según el estado actual
      if (searchTerm) {
        await searchProductos(searchTerm);
      } else {
        await fetchProductos();
      }
      
      return true;
    } catch (err) {
      setError(handleError(err));
      console.error('Error restoring producto:', err);
      return false;
    }
  }, [fetchProductos, searchProductos, searchTerm]);

  const refetch = useCallback(async () => {
    if (searchTerm) {
      await searchProductos(searchTerm);
    } else {
      await fetchProductos();
    }
  }, [fetchProductos, searchProductos, searchTerm]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  return {
    productos,
    loading,
    error,
    refetch,
    createProducto,
    updateProducto,
    deleteProducto,
    restoreProducto,
    searchProductos,
    clearSearch,
    isSearching,
    searchTerm
  };
};