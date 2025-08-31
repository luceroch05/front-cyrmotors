
// components/servicios/ServicioModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { Servicio } from '../../types/Servicio';

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio?: Servicio | null;
  onSave: (servicio: Omit<Servicio, 'id'> | Servicio) => Promise<void>;
}

export const ServicioModal: React.FC<ServicioModalProps> = ({
  isOpen,
  onClose,
  servicio,
  onSave
}) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    precio: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (servicio) {
      setFormData({
        descripcion: servicio.descripcion,
        precio: servicio.precio.toString()
      });
    } else {
      setFormData({
        descripcion: '',
        precio: ''
      });
    }
    setErrors({});
  }, [servicio, isOpen]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    } else {
      const precio = parseFloat(formData.precio);
      if (isNaN(precio) || precio <= 0) {
        newErrors.precio = 'El precio debe ser un número mayor a 0';
      }
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
      const servicioData = {
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio)
      };

      const finalData = servicio 
        ? { ...servicioData, id: servicio.id }
        : servicioData;
      
      await onSave(finalData);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPrice = (value: string) => {
    // Solo permitir números y punto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limitar decimales a 2 dígitos
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericValue;
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
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
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
              Descripción del servicio *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              disabled={saving}
              rows={3}
              className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 resize-none ${
                errors.descripcion ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Ej: Corte de cabello clásico con lavado"
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-400">{errors.descripcion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                S/.
              </span>
              <input
                type="text"
                value={formData.precio}
                onChange={(e) => handleInputChange('precio', formatPrice(e.target.value))}
                disabled={saving}
                className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 ${
                  errors.precio ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.precio && (
              <p className="mt-1 text-sm text-red-400">{errors.precio}</p>
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
                  <span>{servicio ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};