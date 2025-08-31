// pages/ServiciosPage.tsx
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useServicios } from '../hooks/useServicios';
import { ServiciosSearch } from '../components/servicios/ServiciosSearch';
import { ServiciosList } from '../components/servicios/ServiciosList';
import { ServicioModal } from '../components/servicios/ServicioModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import type { Servicio } from '../types/Servicio';

export const ServiciosPage: React.FC = () => {
  const {
    servicios,
    loading,
    error,
    refetch,
    createServicio,
    updateServicio,
    deleteServicio,
    restoreServicio,
    searchServicios,
    clearSearch,
    isSearching,
    searchTerm
  } = useServicios();

  const [modalOpen, setModalOpen] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState<Servicio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (servicioData: Omit<Servicio, 'id'> | Servicio) => {
    let success = false;
    
    if ('id' in servicioData) {
      success = await updateServicio(servicioData.id, servicioData);
    } else {
      success = await createServicio(servicioData);
    }
    
    if (success) {
      setModalOpen(false);
      setServicioEditando(null);
    }
  };

  const handleDelete = async (servicio: Servicio) => {
    setServicioAEliminar(servicio);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!servicioAEliminar) return;
    
    setIsDeleting(true);
    const success = await deleteServicio(servicioAEliminar.id);
    setIsDeleting(false);
    
    if (success) {
      setDeleteConfirmOpen(false);
      setServicioAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setServicioAEliminar(null);
  };

  const getResultsInfo = () => {
    if (searchTerm) {
      return `${servicios.length} resultado${servicios.length !== 1 ? 's' : ''} para "${searchTerm}"`;
    }
    return `${servicios.length} servicio${servicios.length !== 1 ? 's' : ''} activo${servicios.length !== 1 ? 's' : ''}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Servicios</h1>
          <p className="text-gray-400">Gestiona el catálogo de servicios disponibles</p>
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
              setServicioEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="space-y-4">
        <ServiciosSearch
          onSearch={searchServicios}
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
              Ver todos los servicios
            </button>
          )}
        </div>
      </div>

      {/* Lista de servicios */}
      <ServiciosList
        servicios={servicios}
        loading={loading}
        error={error}
        onEdit={(servicio) => {
          setServicioEditando(servicio);
          setModalOpen(true);
        }}
        onDelete={(servicio) => handleDelete(servicio)}
        onRestore={restoreServicio}
        onRetry={refetch}
      />

      {/* Modal de eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Eliminar Servicio"
        message={`¿Está seguro de que desea eliminar el servicio "${servicioAEliminar?.descripcion}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      {/* Modal de servicio */}
      <ServicioModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setServicioEditando(null);
        }}
        servicio={servicioEditando}
        onSave={handleSave}
      />
    </div>
  );
};