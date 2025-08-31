// components/proveedores/ProveedorModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { Proveedor } from '../../types/Proveedor';

interface ProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedor?: Proveedor | null;
  onSave: (proveedor: Omit<Proveedor, 'id'> | Proveedor) => Promise<void>;
}

export const ProveedorModal: React.FC<ProveedorModalProps> = ({
  isOpen,
  onClose,
  proveedor,
  onSave
}) => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    ruc: '',
    telefono: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [saving, setSaving] = useState(false);

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
    if (proveedor) {
      setFormData({
        razonSocial: proveedor.razonSocial,
        ruc: proveedor.ruc,
        telefono: proveedor.telefono
      });
    } else {
      setFormData({
        razonSocial: '',
        ruc: '',
        telefono: ''
      });
    }
    setErrors({});
  }, [proveedor, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = 'La razón social es requerida';
    }
    
    if (!formData.ruc.trim()) {
      newErrors.ruc = 'El RUC es requerido';
    } else if (formData.ruc.length !== 11) {
      newErrors.ruc = 'El RUC debe tener 11 dígitos';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
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
      const proveedorData = proveedor 
        ? { ...formData, id: proveedor.id }
        : formData;
      
      await onSave(proveedorData);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            {proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
              Razón Social *
            </label>
            <input
              type="text"
              value={formData.razonSocial}
              onChange={(e) => handleInputChange('razonSocial', e.target.value)}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.razonSocial ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ingrese la razón social"
            />
            {errors.razonSocial && (
              <p className="mt-1 text-sm text-red-400">{errors.razonSocial}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              RUC *
            </label>
            <input
              type="text"
              value={formData.ruc}
              onChange={(e) => {
                // Solo permitir números y máximo 11 caracteres
                const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                handleInputChange('ruc', value);
              }}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.ruc ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="12345678901"
              maxLength={11}
            />
            {errors.ruc && (
              <p className="mt-1 text-sm text-red-400">{errors.ruc}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Teléfono *
            </label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) => {
                // Solo permitir números y máximo 15 caracteres (formato internacional)
                const value = e.target.value.replace(/\D/g, '').slice(0, 15);
                handleInputChange('telefono', value);
              }}
              disabled={saving}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                errors.telefono ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="987654321"
              maxLength={15}
            />
            {errors.telefono && (
              <p className="mt-1 text-sm text-red-400">{errors.telefono}</p>
            )}
          </div>

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
                  <span>{proveedor ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Usar portal para montar el modal directamente en el body
  return createPortal(modalContent, document.body);
};