// pages/Proveedor.tsx
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useProveedores } from '../hooks/useProveedores';
import { ProveedoresSearch } from '../components/proveedores/ProveedoresSearch';
import { ProveedoresList } from '../components/proveedores/ProveedoresList';
import { ProveedorModal } from '../components/proveedores/ProveedorModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import type { Proveedor } from '../types/Proveedor';

export const ProveedoresPage: React.FC = () => {
  const {
    proveedores,
    loading,
    error,
    refetch,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    restoreProveedor,
    searchProveedores,
    clearSearch,
    isSearching,
    searchTerm
  } = useProveedores();

  const [modalOpen, setModalOpen] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState<Proveedor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (proveedorData: Omit<Proveedor, 'id'> | Proveedor) => {
    let success = false;
    
    if ('id' in proveedorData) {
      success = await updateProveedor(proveedorData.id, proveedorData);
    } else {
      success = await createProveedor(proveedorData);
    }
    
    if (success) {
      setModalOpen(false);
      setProveedorEditando(null);
    }
  };

  const handleDelete = async (proveedor: Proveedor) => {
    setProveedorAEliminar(proveedor);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!proveedorAEliminar) return;
    
    setIsDeleting(true);
    const success = await deleteProveedor(proveedorAEliminar.id);
    setIsDeleting(false);
    
    if (success) {
      setDeleteConfirmOpen(false);
      setProveedorAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setProveedorAEliminar(null);
  };

  const getResultsInfo = () => {
    if (searchTerm) {
      return `${proveedores.length} resultado${proveedores.length !== 1 ? 's' : ''} para "${searchTerm}"`;
    }
    return `${proveedores.length} proveedor${proveedores.length !== 1 ? 'es' : ''} activo${proveedores.length !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Proveedores</h1>
          <p className="text-gray-400">Gestiona la información de tus proveedores</p>
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
              setProveedorEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="space-y-4">
        <ProveedoresSearch
          onSearch={searchProveedores}
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
              Ver todos los proveedores
            </button>
          )}
        </div>
      </div>

      {/* Lista de proveedores */}
      <ProveedoresList
        proveedores={proveedores}
        loading={loading}
        error={error}
        onEdit={(proveedor) => {
          setProveedorEditando(proveedor);
          setModalOpen(true);
        }}
        onDelete={(proveedor) => handleDelete(proveedor)}
        onRestore={restoreProveedor}
        onRetry={refetch}
      />

      {/* Modal de eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Eliminar Proveedor"
        message={`¿Está seguro de que desea eliminar al proveedor "${proveedorAEliminar?.razonSocial}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      {/* Modal */}
      <ProveedorModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProveedorEditando(null);
        }}
        proveedor={proveedorEditando}
        onSave={handleSave}
      />
    </div>
  );
};