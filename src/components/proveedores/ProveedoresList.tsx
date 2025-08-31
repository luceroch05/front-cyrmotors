// components/proveedores/ProveedoresList.tsx
import React from 'react';
import { 
  Building2, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import type { Proveedor } from '../../types/Proveedor';

interface ProveedoresListProps {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  onEdit: (proveedor: Proveedor) => void;
  onDelete: (proveedor: Proveedor) => void;
  onRestore: (id: number) => Promise<boolean>;
  onRetry: () => void;
}

export const ProveedoresList: React.FC<ProveedoresListProps> = ({
  proveedores,
  loading,
  error,
  onEdit,
  onDelete,
  onRestore,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando proveedores...</p>
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

  if (proveedores.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <Building2 className="w-8 h-8 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No se encontraron proveedores</p>
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
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Proveedor</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">RUC</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Teléfono</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Estado</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id} className="hover:bg-gray-750 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{proveedor.razonSocial}</p>
                      <p className="text-gray-400 text-sm">ID: {proveedor.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-300">{proveedor.ruc}</td>
                <td className="py-4 px-6 text-gray-300">{proveedor.telefono}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    proveedor.activo 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(proveedor)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {proveedor.activo ? (
                      <button
                        onClick={() => onDelete(proveedor)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onRestore(proveedor.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Restaurar"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas para móvil y tablet */}
      <div className="lg:hidden p-4 space-y-4">
        {proveedores.map((proveedor) => (
          <div key={proveedor.id} className="bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{proveedor.razonSocial}</p>
                  <p className="text-gray-400 text-sm">ID: {proveedor.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                proveedor.activo 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {proveedor.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">RUC</p>
                <p className="text-white">{proveedor.ruc}</p>
              </div>
              <div>
                <p className="text-gray-400">Teléfono</p>
                <p className="text-white">{proveedor.telefono}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-600">
              <button
                onClick={() => onEdit(proveedor)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              {proveedor.activo ? (
                <button
                  onClick={() => onDelete(proveedor)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onRestore(proveedor.id)}
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Restaurar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};