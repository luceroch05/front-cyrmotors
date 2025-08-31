// components/servicios/ServiciosList.tsx
import React from 'react';
import { 
  Settings, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  DollarSign 
} from 'lucide-react';
import type { Servicio } from '../../types/Servicio';

interface ServiciosListProps {
  servicios: Servicio[];
  loading: boolean;
  error: string | null;
  onEdit: (servicio: Servicio) => void;
  onDelete: (servicio: Servicio) => void;
  onRestore: (id: number) => Promise<boolean>;
  onRetry: () => void;
}

export const ServiciosList: React.FC<ServiciosListProps> = ({
  servicios,
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

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando servicios...</p>
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

  if (servicios.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-8 text-center">
          <Settings className="w-8 h-8 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No se encontraron servicios</p>
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
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Descripción</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Precio</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Estado</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-gray-750 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium max-w-xs truncate" title={servicio.descripcion}>
                        {servicio.descripcion}
                      </p>
                      <p className="text-gray-400 text-sm">ID: {servicio.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white font-medium">{formatPrice(servicio.precio)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    servicio.activo 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {servicio.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(servicio)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {servicio.activo ? (
                      <button
                        onClick={() => onDelete(servicio)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onRestore(servicio.id)}
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
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{servicio.descripcion}</p>
                  <p className="text-gray-400 text-sm">ID: {servicio.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                servicio.activo 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {servicio.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400">Precio</p>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">{formatPrice(servicio.precio)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-600">
              <button
                onClick={() => onEdit(servicio)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              {servicio.activo ? (
                <button
                  onClick={() => onDelete(servicio)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onRestore(servicio.id)}
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