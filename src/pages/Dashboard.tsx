import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Wrench, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Eye,
  Activity,
  Star,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Datos simulados
const monthlyData = [
  { name: 'Mar 8', value: 5538.65 },
  { name: 'Mar 15', value: 6200.30 },
  { name: 'Mar 22', value: 5800.45 },
  { name: 'Mar 29', value: 6500.20 },
  { name: 'Abr 5', value: 7200.80 },
  { name: 'Abr 8', value: 8150.25 }
];

const topServices = [
  { name: 'Cambio de Aceite', revenue: 3074, growth: 9.23, status: 'active' },
  { name: 'Frenos', revenue: 2931, growth: 7.59, status: 'active' },
  { name: 'Mantenimiento', revenue: 2456, growth: -2.14, status: 'inactive' },
  { name: 'Llantas', revenue: 1823, growth: 15.32, status: 'active' }
];

const recentCampaigns = [
  { 
    id: 1, 
    name: 'Cambio de Aceite Premium', 
    admin: 'Samuel García', 
    date: '02/14/2024', 
    type: 'Mantenimiento', 
    followers: '60+', 
    status: 'Público', 
    action: 'Join' 
  },
  { 
    id: 2, 
    name: 'Promoción Frenos', 
    admin: 'María López', 
    date: '09/23/2024', 
    type: 'Reparación', 
    followers: '90+', 
    status: 'Público', 
    action: 'Join' 
  },
  { 
    id: 3, 
    name: 'Revisión Técnica', 
    admin: 'Carlos Ruiz', 
    date: '04/05/2024', 
    type: 'Inspección', 
    followers: '40+', 
    status: 'Privado', 
    action: 'Request' 
  }
];

// Componente de balance principal
const BalanceCard: React.FC = () => (
  <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
      <div>
        <p className="text-sm text-gray-400 mb-1">Balance Total</p>
        <p className="text-gray-500 text-xs">La suma de todos los montos en mi billetera</p>
      </div>
      <div className="flex items-center space-x-2">
        <select className="bg-gray-700 text-white text-xs sm:text-sm border border-gray-600 rounded-lg px-2 sm:px-3 py-1">
          <option>US Dollar</option>
          <option>Soles</option>
        </select>
      </div>
    </div>
    
    <div className="mb-4 sm:mb-6">
      <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">S/ 23,094.57</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
        <span className="text-sm text-gray-400">Comparado al mes pasado</span>
        <span className="text-green-400 text-sm font-medium">+37.15%</span>
      </div>
    </div>

    <div className="mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
        <span className="text-sm text-gray-400">Promedio anual: S/ 34,502.19</span>
        <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 self-start sm:self-auto">
          <Eye className="w-4 h-4" />
          <span>¿Cómo funciona?</span>
        </button>
      </div>
    </div>

    {/* Gráfica integrada */}
    <div className="h-32 sm:h-48 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span className="text-xs text-gray-400">Última actualización: Hoy, 06:49 AM</span>
      </div>
      <div className="text-left sm:text-right">
        <div className="text-xl sm:text-2xl font-bold text-green-400">+19.23%</div>
        <div className="text-xs text-gray-400">S/ 5,538.65</div>
        <div className="text-xs text-green-400">+9.41%</div>
      </div>
    </div>
  </div>
);

// Componente de servicios principales
const TopServicesCard: React.FC = () => (
  <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white">Mis Principales Servicios</h3>
        <p className="text-sm text-gray-400">02 de 5 servicios activos</p>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors self-start sm:self-auto">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    <div className="space-y-3 sm:space-y-4">
      {topServices.map((service, index) => (
        <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-xl hover:bg-gray-650 transition-colors">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-white truncate">{service.name}</h4>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                <span className="text-xs text-gray-400">S/ {service.revenue.toLocaleString()}</span>
                <span className={`text-xs ${service.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {service.growth > 0 ? '+' : ''}{service.growth}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-green-400' : 'bg-gray-500'}`}></span>
            <button className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Componente de campañas populares
const PopularCampaignsCard: React.FC = () => (
  <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
      <h3 className="text-base sm:text-lg font-semibold text-white">Servicios Populares</h3>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">+32</span>
        <span className="text-xs text-gray-400">en Lista</span>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    {/* Vista de tabla para desktop */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Rank</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Nombre</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Admin</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Fecha</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Tipo</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Clientes</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Estado</th>
            <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {recentCampaigns.map((campaign, index) => (
            <tr key={campaign.id} className="hover:bg-gray-750 transition-colors">
              <td className="py-3 text-sm text-gray-300">#{index + 1}</td>
              <td className="py-3 text-sm font-medium text-white">{campaign.name}</td>
              <td className="py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {campaign.admin.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{campaign.admin}</span>
                </div>
              </td>
              <td className="py-3 text-sm text-gray-400">{campaign.date}</td>
              <td className="py-3 text-sm text-gray-300">{campaign.type}</td>
              <td className="py-3">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border border-gray-700"></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{campaign.followers}</span>
                </div>
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  campaign.status === 'Público' 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {campaign.status}
                </span>
              </td>
              <td className="py-3">
                <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  campaign.action === 'Join'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}>
                  {campaign.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Vista de tarjetas para móvil y tablet */}
    <div className="lg:hidden space-y-4">
      {recentCampaigns.map((campaign, index) => (
        <div key={campaign.id} className="bg-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">#{index + 1}</span>
              <h4 className="text-sm font-medium text-white truncate">{campaign.name}</h4>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              campaign.status === 'Público' 
                ? 'bg-green-900 text-green-300' 
                : 'bg-gray-700 text-gray-300'
            }`}>
              {campaign.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {campaign.admin.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm text-gray-300">{campaign.admin}</span>
            </div>
            <span className="text-xs text-gray-400">{campaign.date}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400">{campaign.type}</span>
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border border-gray-700"></div>
                  ))}
                </div>
                <span className="text-xs text-gray-400 ml-1">{campaign.followers}</span>
              </div>
            </div>
            <button className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              campaign.action === 'Join'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}>
              {campaign.action}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sección superior */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <BalanceCard />
        </div>
        <div>
          <TopServicesCard />
        </div>
      </div>

      {/* Sección de campañas/servicios populares */}
      <PopularCampaignsCard />

      {/* Panel de promoción premium */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 border border-blue-500">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-700" />
              </div>
              <span className="text-white font-semibold text-sm sm:text-base">¡Vamos Premium con 40% OFF!</span>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm mb-4 leading-relaxed">
              Esta es tu oportunidad increíble. Nuestra suscripción premium eleva tu experiencia y 
              desbloquea una gama de beneficios adaptados a tus preferencias.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm">
                Comenzar
              </button>
              <p className="text-blue-200 text-sm">¡Solo por hoy!</p>
            </div>
          </div>
          <div className="lg:block">
            <div className="text-left lg:text-right">
              <p className="text-blue-100 text-xs sm:text-sm mb-2">¿No mostrar de nuevo?</p>
              <button className="text-blue-200 hover:text-white text-xs sm:text-sm underline">
                Ocultar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;