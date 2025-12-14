import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ChefHat, CheckCircle, AlertTriangle, Phone, User } from 'lucide-react'
import api from '../../lib/api'

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
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500'
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

// Tab component
const Tab = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
      active
        ? 'border-[#fc0000] text-[#fc0000]'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
)

export default function AdminKitchen() {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const ordersData = await api.getAllOrders()
        const ordersDataMapped = (ordersData || []).map(order => ({
          id: order.id,
          customerName: order.user?.name || 'Client inconnu',
          phone: order.user?.phone || order.phone || 'N/A',
          status: order.status.toLowerCase(),
          createdAt: order.createdAt,
          startedAt: order.startedAt,
          items: order.items.map(item => ({
            name: item.productName,
            qty: item.quantity,
            category: 'food' // Default category, could be enhanced
          })),
          priority: order.notes?.includes('urgent') || order.notes?.includes('priorité') ? 'high' : 'normal',
          estimatedTime: 15 // Default estimated time, could be calculated based on items
        }))
        setOrders(ordersDataMapped)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // Real-time updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const getElapsedTime = (createdAt, startedAt = null) => {
    const startTime = startedAt ? new Date(startedAt) : new Date(createdAt)
    const now = new Date()
    const diffMs = now - startTime
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const getTimeColor = (elapsed, estimated) => {
    if (elapsed > estimated + 5) return 'text-red-600'
    if (elapsed > estimated) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'pending'
    if (activeTab === 'preparing') return order.status === 'preparing'
    return true
  })

  const handleStartPrep = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'PREPARING')
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'preparing', startedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Failed to start preparation:', error)
      // Optionally show error message to user
    }
  }

  const handleMarkReady = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'READY')
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: 'ready' } : order
      ))
    } catch (error) {
      console.error('Failed to mark as ready:', error)
      // Optionally show error message to user
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour au Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Cuisine</h1>
                <p className="text-lg text-gray-600 font-semibold">Gestion des commandes en cuisine</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Mise à jour en temps réel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <Tab
                active={activeTab === 'pending'}
                onClick={() => setActiveTab('pending')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  En Attente ({orders.filter(o => o.status === 'pending').length})
                </div>
              </Tab>
              <Tab
                active={activeTab === 'preparing'}
                onClick={() => setActiveTab('preparing')}
              >
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  En Préparation ({orders.filter(o => o.status === 'preparing').length})
                </div>
              </Tab>
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'pending' ? 'Aucune commande en attente' : 'Aucune commande en préparation'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending'
                    ? 'Les nouvelles commandes apparaîtront ici automatiquement.'
                    : 'Toutes les commandes sont prêtes ou en attente.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => {
              const elapsed = getElapsedTime(order.createdAt, order.startedAt)
              const timeColor = getTimeColor(elapsed, order.estimatedTime)

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-md transition-shadow ${order.priority === 'high' ? 'ring-2 ring-red-200' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-gray-100">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status === 'pending' ? 'En Attente' :
                                 order.status === 'preparing' ? 'En Préparation' : 'Prêt'}
                              </Badge>
                              {order.priority === 'high' && (
                                <Badge className={getPriorityColor(order.priority)}>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Priorité
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {order.customerName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {order.phone}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className={`w-4 h-4 ${timeColor}`} />
                                <span className={timeColor}>
                                  {elapsed} min {order.status === 'preparing' ? '(en cours)' : '(en attente)'}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.qty}x {item.name}</span>
                                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                                    {item.category}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600">
                            Temps estimé: <span className="font-semibold">{order.estimatedTime} min</span>
                          </div>
                          {elapsed > order.estimatedTime && (
                            <div className="text-sm text-red-600 font-medium">
                              Retard: {elapsed - order.estimatedTime} min
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button
                              variant="warning"
                              onClick={() => handleStartPrep(order.id)}
                              className="flex items-center gap-2"
                            >
                              <ChefHat className="w-4 h-4" />
                              Commencer
                            </Button>
                          )}
                          <Button
                            variant="success"
                            onClick={() => handleMarkReady(order.id)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Prêt
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
