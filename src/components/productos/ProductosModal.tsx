// components/productos/ProductoModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { createPortal } from 'react-dom';
import { ProveedorSelector } from './ProveedorSelector';
import { ProveedorModal } from '../proveedores/ProveedorModal';
import { useProveedores } from '../../hooks/useProveedores';
import type { Producto } from '../../types/Producto';
import type { Proveedor } from '../../types/Proveedor';

interface ProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto?: Producto | null;
  onSave: (producto: Omit<Producto, 'id'> | Producto) => Promise<void>;
}

export const ProductoModal: React.FC<ProductoModalProps> = ({
  isOpen,
  onClose,
  producto,
  onSave
}) => {
  const { createProveedor } = useProveedores();
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    proveedorId: null as number | null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [saving, setSaving] = useState(false);
  
  // Modal de proveedor
  const [proveedorModalOpen, setProveedorModalOpen] = useState(false);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        proveedorId: producto.proveedorId
      });
    } else {
      setFormData({
        nombre: '',
        precio: '',
        stock: '',
        proveedorId: null
      });
    }
    setErrors({});
  }, [producto, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.precio) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0';
    }
    
    if (!formData.stock) {
      newErrors.stock = 'El stock es requerido';
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }
    
    if (!formData.proveedorId) {
      newErrors.proveedor = 'Debe seleccionar un proveedor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const productoData = producto 
        ? { 
            ...formData, 
            id: producto.id, 
            nombre: formData.nombre.trim(),
            precio: Number(formData.precio),
            stock: Number(formData.stock),
            proveedorId: formData.proveedorId!
          }
        : {
            nombre: formData.nombre.trim(),
            precio: Number(formData.precio),
            stock: Number(formData.stock),
            proveedorId: formData.proveedorId!
          };
      
      await onSave(productoData);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar la creación de nuevo proveedor
  const handleCreateProveedor = () => {
    setProveedorModalOpen(true);
  };

  const handleSaveProveedor = async (proveedorData: Omit<Proveedor, 'id'> | Proveedor) => {
    const result = await createProveedor(proveedorData as Omit<Proveedor, 'id'>) as Proveedor | boolean;
    
    if (result && typeof result === 'object' && 'id' in result) {
      // Si createProveedor retorna el proveedor creado con su ID
      setProveedorModalOpen(false);
      // Seleccionar automáticamente el proveedor recién creado
      setFormData(prev => ({ ...prev, proveedorId: result.id }));
      // Limpiar error de proveedor si existía
      setErrors(prev => ({ ...prev, proveedor: '' }));
    } else if (result === true) {
      // Si solo retorna true, cerrar modal (el selector se actualizará automáticamente)
      setProveedorModalOpen(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
      style={{ margin: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 relative animate-in fade-in duration-200 shadow-2xl"
        style={{ maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.nombre ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: Aceite Motor 20W-50"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-400">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio (S/) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.precio ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="mt-1 text-sm text-red-400">{errors.precio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stock inicial *
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.stock ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-400">{errors.stock}</p>
            )}
          </div>

          <ProveedorSelector
            value={formData.proveedorId}
            onChange={(value) => handleInputChange('proveedorId', value)}
            error={errors.proveedor}
            disabled={saving}
            onCreateNew={handleCreateProveedor}
          />

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{producto ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de proveedor anidado */}
      <ProveedorModal
        isOpen={proveedorModalOpen}
        onClose={() => setProveedorModalOpen(false)}
        onSave={handleSaveProveedor}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};