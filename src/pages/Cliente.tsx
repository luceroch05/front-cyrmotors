// pages/Cliente.tsx
import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { ClientesSearch } from '../components/clientes/ClientesSearch';
import { ClientesList } from '../components/clientes/ClientesList';
import { ClienteModal } from '../components/clientes/ClienteModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import type { Cliente } from '../types/Cliente';

export const ClientesPage: React.FC = () => {
  const {
    clientes,
    loading,
    error,
    refetch,
    createCliente,
    updateCliente,
    deleteCliente,
    restoreCliente,
    searchClientes,
    clearSearch,
    isSearching,
    searchTerm
  } = useClientes();

  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (clienteData: Omit<Cliente, 'id'> | Cliente) => {
    let success = false;
    
    if ('id' in clienteData) {
      success = await updateCliente(clienteData.id, clienteData);
    } else {
      success = await createCliente(clienteData);
    }
    
    if (success) {
      setModalOpen(false);
      setClienteEditando(null);
    }
  };

  const handleDelete = async (cliente: Cliente) => {
    setClienteAEliminar(cliente);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!clienteAEliminar) return;
    
    setIsDeleting(true);
    const success = await deleteCliente(clienteAEliminar.id);
    setIsDeleting(false);
    
    if (success) {
      setDeleteConfirmOpen(false);
      setClienteAEliminar(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setClienteAEliminar(null);
  };

  const getResultsInfo = () => {
    if (searchTerm) {
      return `${clientes.length} resultado${clientes.length !== 1 ? 's' : ''} para "${searchTerm}"`;
    }
    return `${clientes.length} cliente${clientes.length !== 1 ? 's' : ''} activo${clientes.length !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-gray-400">Gestiona la información de tus clientes</p>
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
              setClienteEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="space-y-4">
        <ClientesSearch
          onSearch={searchClientes}
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
              Ver todos los clientes
            </button>
          )}
        </div>
      </div>

      {/* Lista de clientes */}
      <ClientesList
        clientes={clientes}
        loading={loading}
        error={error}
        onEdit={(cliente) => {
          setClienteEditando(cliente);
          setModalOpen(true);
        }}
        onDelete={(cliente) => handleDelete(cliente)}
        onRestore={restoreCliente}
        onRetry={refetch}
      />

      {/* Modal de eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Eliminar Cliente"
        message={`¿Está seguro de que desea eliminar al cliente "${clienteAEliminar?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />

      {/* Modal */}
      <ClienteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setClienteEditando(null);
        }}
        cliente={clienteEditando}
        onSave={handleSave}
      />
    </div>
  );
};