// components/productos/ProveedorSelector.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { useProveedores } from '../../hooks/useProveedores';
import type { Proveedor } from '../../types/Proveedor';

interface ProveedorSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  disabled?: boolean;
  onCreateNew?: () => void;
  refreshTrigger?: number; // Para forzar actualización
}

export const ProveedorSelector: React.FC<ProveedorSelectorProps> = ({
  value,
  onChange,
  error,
  disabled,
  onCreateNew,
  refreshTrigger = 0
}) => {
  const { proveedores, loading, refetch } = useProveedores();
  const [isOpen, setIsOpen] = useState(false);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    refetch();
  }, []);

  // Refrescar cuando cambie refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Filtrar solo proveedores activos
  const proveedoresActivos = proveedores.filter(p => p.activo);
  const proveedorSeleccionado = proveedoresActivos.find(p => p.id === value);

  const handleSelect = (proveedorId: number) => {
    onChange(proveedorId);
    setIsOpen(false);
  };

  const handleCreateNew = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    
    if (onCreateNew) {
      onCreateNew();
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Proveedor *
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-left text-white focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 flex items-center justify-between ${
            error ? 'border-red-500' : 'border-gray-600'
          } ${!disabled ? 'hover:bg-gray-600' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <Building2 className="w-4 h-4 text-gray-400" />
            <div>
              {loading ? (
                <span className="text-gray-400">Cargando proveedores...</span>
              ) : proveedorSeleccionado ? (
                <div>
                  <span className="text-white font-medium">{proveedorSeleccionado.razonSocial}</span>
                  <span className="text-gray-400 text-sm ml-2">RUC: {proveedorSeleccionado.ruc}</span>
                </div>
              ) : (
                <span className="text-gray-400">Seleccionar proveedor...</span>
              )}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !loading && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {proveedoresActivos.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p>No hay proveedores activos</p>
                {onCreateNew && (
                  <button 
                    type="button"
                    onClick={handleCreateNew}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar proveedor</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {proveedoresActivos.map((proveedor) => (
                  <button
                    key={proveedor.id}
                    type="button"
                    onClick={() => handleSelect(proveedor.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-b-0 ${
                      value === proveedor.id ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{proveedor.razonSocial}</div>
                        <div className="text-sm text-gray-400">
                          RUC: {proveedor.ruc} • Tel: {proveedor.telefono}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {onCreateNew && (
                  <button 
                    type="button"
                    onClick={handleCreateNew}
                    className="w-full px-4 py-3 text-left text-blue-400 hover:bg-gray-600 hover:text-blue-300 transition-colors border-t border-gray-600 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar nuevo proveedor</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}

      {/* Cerrar dropdown al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};