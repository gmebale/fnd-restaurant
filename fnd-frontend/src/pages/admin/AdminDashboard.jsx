import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Clock, ChefHat, DollarSign, Package, Truck, Users, Gift, Star, ArrowRight, Package as PackageIcon, Eye } from 'lucide-react'
import * as api from '../../lib/api'

// Custom Card component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// Custom Button component
const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  }
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Badge component
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        // Use mock data if API fails
        setStats({
          todayOrders: 12,
          pendingOrders: 4,
          preparingOrders: 3,
          todayRevenue: 2450,
          averagePrepTime: 25,
          cancellationRate: 5,
          peakHour: 13,
          totalRevenue: 15000,
          totalOrders: 150,
          recentOrders: [
            { id: 'ORD-001', items: 3, phone: '+212 6XX XXX XXX', status: 'pending', total: 120, createdAt: new Date() },
            { id: 'ORD-002', items: 2, phone: '+212 6XX XXX XXX', status: 'preparing', total: 85, createdAt: new Date() },
            { id: 'ORD-003', items: 1, phone: '+212 6XX XXX XXX', status: 'ready', total: 45, createdAt: new Date() },
            { id: 'ORD-004', items: 4, phone: '+212 6XX XXX XXX', status: 'delivered', total: 200, createdAt: new Date() },
            { id: 'ORD-005', items: 2, phone: '+212 6XX XXX XXX', status: 'cancelled', total: 90, createdAt: new Date() }
          ],
          orderStatuses: [
            { status: 'pending', count: 4, icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
            { status: 'preparing', count: 3, icon: ChefHat, color: 'bg-orange-100 text-orange-800' },
            { status: 'ready', count: 2, icon: PackageIcon, color: 'bg-blue-100 text-blue-800' },
            { status: 'delivered', count: 8, icon: Truck, color: 'bg-green-100 text-green-800' },
            { status: 'cancelled', count: 1, icon: PackageIcon, color: 'bg-red-100 text-red-800' }
          ]
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statsCards = [
    { label: 'Commandes Aujourd\'hui', value: stats?.todayOrders || 0, icon: ShoppingCart, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { label: 'En Attente', value: stats?.pendingOrders || 0, icon: Clock, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { label: 'En Préparation', value: stats?.preparingOrders || 0, icon: ChefHat, bgColor: 'bg-red-100', textColor: 'text-red-600' },
    { label: 'Revenu Aujourd\'hui', value: `${stats?.todayRevenue || 0} DH`, icon: DollarSign, bgColor: 'bg-green-100', textColor: 'text-green-600' }
  ]

  const quickActions = [
    { label: 'Commandes', icon: ShoppingCart, to: '/admin/orders', borderColor: 'border-red-400', fromColor: 'from-red-500', toColor: 'to-red-600', textColor: 'text-white', hoverBgColor: 'hover:bg-red-600', descColor: 'text-white/80' },
    { label: 'Produits', icon: Package, to: '/admin/products', borderColor: 'border-yellow-400', fromColor: 'from-yellow-500', toColor: 'to-yellow-600', textColor: 'text-gray-900', hoverBgColor: 'hover:bg-yellow-600', descColor: 'text-gray-900/80' },
    { label: 'Finances', icon: DollarSign, to: '/admin/finances', borderColor: 'border-green-400', fromColor: 'from-green-500', toColor: 'to-green-600', textColor: 'text-white', hoverBgColor: 'hover:bg-green-600', descColor: 'text-white/80' },
    { label: 'Cuisine', icon: ChefHat, to: '/admin/kitchen', borderColor: 'border-gray-400', fromColor: 'from-gray-800', toColor: 'to-gray-900', textColor: 'text-yellow-400', hoverBgColor: 'hover:bg-gray-900', descColor: 'text-yellow-400/80' },
    { label: 'Livraison', icon: Truck, to: '/admin/delivery', borderColor: 'border-blue-400', fromColor: 'from-blue-500', toColor: 'to-blue-600', textColor: 'text-white', hoverBgColor: 'hover:bg-blue-600', descColor: 'text-white/80' },
    { label: 'Personnel', icon: Users, to: '/admin/staff', borderColor: 'border-purple-400', fromColor: 'from-purple-500', toColor: 'to-purple-600', textColor: 'text-white', hoverBgColor: 'hover:bg-purple-600', descColor: 'text-white/80' },
    { label: 'Promotions', icon: Gift, to: '/admin/promotions', borderColor: 'border-pink-400', fromColor: 'from-pink-500', toColor: 'to-pink-600', textColor: 'text-white', hoverBgColor: 'hover:bg-pink-600', descColor: 'text-white/80' },
    { label: 'Avis', icon: Star, to: '/admin/reviews', borderColor: 'border-amber-400', fromColor: 'from-amber-500', toColor: 'to-amber-600', textColor: 'text-white', hoverBgColor: 'hover:bg-amber-600', descColor: 'text-white/80' }
  ]

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      preparing: { label: 'En préparation', color: 'bg-orange-100 text-orange-800' },
      ready: { label: 'Prêt', color: 'bg-blue-100 text-blue-800' },
      delivered: { label: 'Livré', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Dashboard Admin</h1>
          <p className="text-lg text-gray-600 font-semibold">Bienvenue, Admin 👋</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Badge className="bg-blue-100 text-blue-700">⏱ Temps moyen: {stats?.averagePrepTime || 0} min</Badge>
            <Badge className="bg-red-100 text-red-700">✗ Annulations: {stats?.cancellationRate || 0}%</Badge>
            <Badge className="bg-purple-100 text-purple-700">🔥 Heure de pointe: {stats?.peakHour || 0}h</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-2 border-gray-200 hover:border-red-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Actions Rapides */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Link to={action.to}>
                <Card className={`border-4 ${action.borderColor} bg-gradient-to-br ${action.fromColor} ${action.toColor} hover:shadow-lg transition-all hover:-translate-y-1`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={`text-lg font-bold ${action.textColor}`}>{action.label}</h3>
                        <p className={`${action.descColor} text-sm mt-1`}>Accès rapide</p>
                      </div>
                      <ArrowRight className={`w-5 h-5 ${action.textColor}`} />
                    </div>
                    <Button className={`w-full mt-3 ${action.fromColor.replace('from-', 'bg-')} ${action.textColor} hover:${action.hoverBgColor} font-bold`}>
                      Aller
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Dernières Commandes */}
        <Card className="border-2 border-gray-200 mb-8">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Dernières Commandes</h2>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                <Eye className="w-4 h-4 mr-2" />
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.recentOrders?.length > 0 ? (
              <div className="divide-y">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.items} articles • {order.phone}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadge(order.status).color}>
                          {getStatusBadge(order.status).label}
                        </Badge>
                        <p className="font-extrabold text-red-600 text-lg mt-1">{order.total} DH</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <PackageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune commande récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résumé des Revenus & Statut des Commandes */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Résumé des Revenus */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <h2 className="font-bold text-gray-900">Résumé des Revenus</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aujourd'hui</span>
                  <span className="font-bold text-red-600">{stats?.todayRevenue || 0} DH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-green-600">{stats?.totalRevenue || 0} DH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commandes totales</span>
                  <span className="font-bold text-gray-900">{stats?.totalOrders || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut des Commandes */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <h2 className="font-bold text-gray-900">Statut des Commandes</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.orderStatuses?.map((statusItem) => (
                  <div key={statusItem.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statusItem.color}`}>
                        <statusItem.icon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700 capitalize">{statusItem.status}</span>
                    </div>
                    <span className="font-bold text-gray-900">{statusItem.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
