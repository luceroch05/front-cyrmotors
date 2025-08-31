// components/productos/ProductosList.tsx
import React from 'react';
import { 
  Package, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import type { Producto } from '../../types/Producto';

interface ProductosListProps {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onRestore: (id: number) => Promise<boolean>;
  onRetry: () => void;
}

export const ProductosList: React.FC<ProductosListProps> = ({
  productos,
  loading,
  error,
  onEdit,
  onDelete,
  onRestore,
  onRetry
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { color: 'bg-red-900 text-red-300', text: 'Sin stock' };
    } else if (stock <= 5) {
      return { color: 'bg-yellow-900 text-yellow-300', text: 'Stock bajo' };
    } else {
      return { color: 'bg-green-900 text-green-300', text: 'En stock' };
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <Package className="w-8 h-8 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No se encontraron productos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700">
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Producto</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Precio</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Stock</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Proveedor</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Estado</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {productos.map((producto) => {
              const stockStatus = getStockStatus(producto.stock);
              return (
                <tr key={producto.id} className="hover:bg-gray-750 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{producto.nombre}</p>
                        <p className="text-gray-400 text-sm">ID: {producto.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-300 font-semibold">
                    {formatPrice(producto.precio)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{producto.stock}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {producto.proveedor ? (
                      <div>
                        <p className="text-gray-300 text-sm">{producto.proveedor.razonSocial}</p>
                        <p className="text-gray-500 text-xs">RUC: {producto.proveedor.ruc}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No asignado</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      producto.activo 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(producto)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {producto.activo ? (
                        <button
                          onClick={() => onDelete(producto)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRestore(producto.id)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Restaurar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móvil y tablet */}
      <div className="lg:hidden p-4 space-y-4">
        {productos.map((producto) => {
          const stockStatus = getStockStatus(producto.stock);
          return (
            <div key={producto.id} className="bg-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{producto.nombre}</p>
                    <p className="text-gray-400 text-sm">ID: {producto.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  producto.activo 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-red-900 text-red-300'
                }`}>
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Precio</p>
                  <p className="text-white font-semibold">{formatPrice(producto.precio)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Stock</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{producto.stock}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Proveedor</p>
                {producto.proveedor ? (
                  <div>
                    <p className="text-white text-sm">{producto.proveedor.razonSocial}</p>
                    <p className="text-gray-500 text-xs">RUC: {producto.proveedor.ruc}</p>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No asignado</span>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-600">
                <button
                  onClick={() => onEdit(producto)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {producto.activo ? (
                  <button
                    onClick={() => onDelete(producto)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => onRestore(producto.id)}
                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Restaurar"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};