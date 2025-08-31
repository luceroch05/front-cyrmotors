// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import { ClientesPage } from './pages/Cliente'; // Asegúrate de importar correctamente
import { ServiciosPage } from './pages/Servicios';
import { ProductosPage } from './pages/Producto';
import { ProveedoresPage } from './pages/Proveedor';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout title="Dashboard">
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/clientes"
          element={
            <MainLayout title="Clientes">
              <ClientesPage />
            </MainLayout>
          }
        />
        <Route
          path="/servicios"
          element={
            <MainLayout title="servicios">
              <ServiciosPage />
            </MainLayout>
          }
        />
         <Route
          path="/productos"
          element={
            <MainLayout title="productos">
              <ProductosPage/>
            </MainLayout>
          }
        />
        <Route
          path="/proveedores"
          element={
            <MainLayout title="proveedores">
              <ProveedoresPage/>
            </MainLayout>
          }
        />
        {/* Agrega más rutas aquí como servicios, proveedores, etc */}
      </Routes>
    </Router>
  );
};

export default App;
