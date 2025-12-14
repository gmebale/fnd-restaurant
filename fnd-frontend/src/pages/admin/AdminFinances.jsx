import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, DollarSign, ShoppingCart, XCircle, TrendingUp, BarChart3, PieChart, Users, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'
import { getFinanceStats } from '../../lib/api'

// Custom Card component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
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
    default: 'bg-[#fc0000] text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
  }
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Custom Select component
const Select = ({ children, className = '', ...props }) => (
  <select className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props}>
    {children}
  </select>
)

export default function AdminFinances() {
  const [period, setPeriod] = useState('7d')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getFinanceStats(period)
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch finance stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [period])

  const metricsCards = [
    {
      label: 'Revenus Totaux',
      value: `${stats?.totalRevenue || 0} DH`,
      icon: DollarSign,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      change: '+12.5%'
    },
    {
      label: 'Commandes Totales',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: '+8.2%'
    },
    {
      label: 'Panier Moyen',
      value: `${stats?.avgOrderValue || 0} DH`,
      icon: TrendingUp,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: '+5.1%'
    },
    {
      label: 'Taux Annulation',
      value: `${stats?.cancellationRate || 0}%`,
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      change: '-2.3%'
    }
  ]

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour au Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Finances</h1>
                <p className="text-lg text-gray-600 font-semibold">Analysez vos performances financières</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="min-w-[120px]">
                <option value="7d">7 jours</option>
                <option value="30d">30 jours</option>
                <option value="90d">90 jours</option>
                <option value="1y">1 an</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricsCards.map((metric, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-2 border-gray-200 hover:border-red-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">{metric.label}</p>
                      <p className="text-2xl md:text-3xl font-extrabold text-gray-900">{metric.value}</p>
                      <p className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                      <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Revenue Bar Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Évolution des Revenus</h2>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} DH`, 'Revenus']} />
                  <Bar dataKey="revenue" fill="#fc0000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Pie Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Répartition par Catégorie</h2>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={stats?.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats?.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Lists */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Top Produits</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.orders} commandes</p>
                    </div>
                    <p className="font-bold text-[#fc0000]">{product.revenue} DH</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="font-bold text-gray-900">Top Clients</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.orders} commandes</p>
                    </div>
                    <p className="font-bold text-[#fc0000]">{client.total} DH</p>
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
