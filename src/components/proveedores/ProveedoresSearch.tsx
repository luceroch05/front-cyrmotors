// components/proveedores/ProveedoresSearch.tsx
import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface ProveedoresSearchProps {
  onSearch: (termino: string) => void;
  onClearSearch: () => void;
  isSearching: boolean;
  placeholder?: string;
}

export const ProveedoresSearch: React.FC<ProveedoresSearchProps> = ({
  onSearch,
  onClearSearch,
  isSearching,
  placeholder = "Buscar por razón social, RUC o teléfono..."
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = useCallback(() => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    } else {
      onClearSearch();
    }
  }, [inputValue, onSearch, onClearSearch]);

  const handleClear = useCallback(() => {
    setInputValue('');
    onClearSearch();
  }, [onClearSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  }, [handleSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              disabled={isSearching}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={isSearching}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            onClick={handleSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-r-lg transition-colors flex items-center justify-center min-w-[60px]"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-2 text-xs text-gray-500">
        Presiona Enter o haz clic en buscar para realizar la búsqueda
      </div>
    </div>
  );
};