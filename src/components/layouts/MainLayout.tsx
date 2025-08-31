import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Wrench, 
  Truck, 
  FileText, 
  Settings, 
  Search,
  Bell,
  Menu,
  X,
  Car,
  ChevronDown,
  Box
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

const menuItems: MenuItem[] = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: Wrench, label: 'Servicios', href: '/servicios' },
  { icon: Box, label: 'Productos', href: '/productos' }, // Cambiado a Box
  { icon: Truck, label: 'Proveedores', href: '/proveedores' },
  { icon: FileText, label: 'Atenciones', href: '/atenciones' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
];

  const closeSidebar = () => setSidebarOpen(false);
  const openSidebar = () => setSidebarOpen(true);

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 sm:w-72 bg-gray-800 transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-r border-gray-700
        lg:relative lg:translate-x-0 lg:z-auto lg:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">CyrMotors</span>
          </div>
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
<nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto min-h-0">
  {menuItems.map((item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.href}
        to={item.href}
        className={({ isActive }) =>
          `flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`
        }
        onClick={closeSidebar}
      >
        <Icon className={`w-5 h-5 mr-2 sm:mr-3`} />
        <span className="truncate">{item.label}</span>
      </NavLink>
    );
  })}
</nav>


        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-700">
          <div className="bg-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">CM</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">CyrMotors</p>
                <p className="text-xs text-gray-400 truncate">Taller Automotriz</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={openSidebar}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  {title}
                </h1>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cliente, servicio..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              {/* Mobile Search Button */}
              <button className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* Today indicator */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-700 px-2 sm:px-3 py-2 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-300">Hoy, Abr 8</span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                  <span className="text-white text-xs sm:text-sm font-semibold">A</span>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;