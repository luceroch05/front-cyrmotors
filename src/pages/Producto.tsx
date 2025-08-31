// pages/Producto.tsx
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { ProductosSearch } from '../components/productos/ProductosSearch';
import { ProductosList } from '../components/productos/ProductosList';
import { ProductoModal } from '../components/productos/ProductosModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import type { Producto } from '../types/Producto';

export const ProductosPage: React.FC = () => {
  const {
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
  } = useProductos();

  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (productoData: Omit<Producto, 'id'> | Producto) => {
    let success = false;
    
    if ('id' in productoData) {
      success = await updateProducto(productoData.id, productoData);
    } else {
      success = await createProducto(productoData);
    }
    
    if (success) {
      setModalOpen(false);
      setProductoEditando(null);
    }
  };

  const handleDelete = async (producto: Producto) => {
    setProductoAEliminar(producto);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productoAEliminar) return;
    
    setIsDeleting(true);
    const success = await deleteProducto(productoAEliminar.id);
    setIsDeleting(false);
    
    if (success) {
      setDeleteConfirmOpen(false);
      setProductoAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProductoAEliminar(null);
  };

  const getResultsInfo = () => {
    if (searchTerm) {
      return `${productos.length} resultado${productos.length !== 1 ? 's' : ''} para "${searchTerm}"`;
    }
    return `${productos.length} producto${productos.length !== 1 ? 's' : ''} activo${productos.length !== 1 ? 's' : ''}`;
  };

  // Calcular estadísticas básicas
  const totalValorInventario = productos
    .filter(p => p.activo)
    .reduce((total, producto) => total + (producto.precio * producto.stock), 0);

  const productosConStockBajo = productos
    .filter(p => p.activo && p.stock <= 5 && p.stock > 0)
    .length;

  const productosSinStock = productos
    .filter(p => p.activo && p.stock === 0)
    .length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-gray-400">Gestiona el inventario de tus productos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            disabled={loading || isSearching}
            title="Refrescar"
          >
            <RefreshCw className={`w-5 h-5 ${(loading || isSearching) ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setProductoEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Valor Total</p>
              <p className="text-xl font-semibold text-white">
                {new Intl.NumberFormat('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                }).format(totalValorInventario)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">S/</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Productos</p>
              <p className="text-xl font-semibold text-white">{productos.filter(p => p.activo).length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">#</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Stock Bajo</p>
              <p className="text-xl font-semibold text-yellow-400">{productosConStockBajo}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">!</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sin Stock</p>
              <p className="text-xl font-semibold text-red-400">{productosSinStock}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="space-y-4">
        <ProductosSearch
          onSearch={searchProductos}
          onClearSearch={clearSearch}
          isSearching={isSearching}
        />
        
        {/* Info de resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {getResultsInfo()}
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todos los productos
            </button>
          )}
        </div>
      </div>

      {/* Lista de productos */}
      <ProductosList
        productos={productos}
        loading={loading}
        error={error}
        onEdit={(producto) => {
          setProductoEditando(producto);
          setModalOpen(true);
        }}
        onDelete={(producto) => handleDelete(producto)}
        onRestore={restoreProducto}
        onRetry={refetch}
      />

      {/* Modal de eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Eliminar Producto"
        message={`¿Está seguro de que desea eliminar el producto "${productoAEliminar?.nombre}"? Esta acción también afectará el inventario.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      {/* Modal */}
      <ProductoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProductoEditando(null);
        }}
        producto={productoEditando}
        onSave={handleSave}
      />
    </div>
  );
};