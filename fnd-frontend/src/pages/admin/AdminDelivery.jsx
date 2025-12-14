import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Truck, CheckCircle, Clock, MapPin, Phone, User, Package } from 'lucide-react'
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

// Section Header component
const SectionHeader = ({ title, count, icon: Icon, color = 'blue' }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-2 rounded-lg bg-${color}-100`}>
      <Icon className={`w-5 h-5 text-${color}-600`} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{count} commande{count !== 1 ? 's' : ''}</p>
    </div>
  </div>
)

export default function AdminDelivery() {
  const [orders, setOrders] = useState([])
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
          address: order.address || 'Adresse non spécifiée',
          status: order.status.toLowerCase(),
          createdAt: order.createdAt,
          deliveredAt: order.deliveredAt,
          deliveryStartedAt: order.deliveryStartedAt,
          items: order.items.map(item => ({
            name: item.productName,
            qty: item.quantity
          })),
          total: order.total,
          estimatedDeliveryTime: 30 // Default estimated time, could be calculated based on items
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

  const getElapsedTime = (startTime) => {
    if (!startTime) return 0
    const now = new Date()
    const start = new Date(startTime)
    const diffMs = now - start
    return Math.floor(diffMs / 60000) // minutes
  }

  const getDeliveryTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 0
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end - start
    return Math.floor(diffMs / 60000) // minutes
  }

  const getTimeColor = (elapsed, estimated) => {
    if (elapsed > estimated + 10) return 'text-red-600'
    if (elapsed > estimated) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-yellow-100 text-yellow-800'
      case 'delivering': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const readyOrders = orders.filter(order => order.status === 'ready')
  const deliveringOrders = orders.filter(order => order.status === 'delivering')
  const recentDeliveredOrders = orders.filter(order => order.status === 'delivered').slice(0, 5)

  const handleTakeForDelivery = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'DELIVERING')
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'delivering', deliveryStartedAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Failed to take for delivery:', error)
      // Optionally show error message to user
    }
  }

  const handleMarkDelivered = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'DELIVERED')
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: 'delivered', deliveredAt: new Date().toISOString() }
          : order
      ))
    } catch (error) {
      console.error('Failed to mark as delivered:', error)
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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Livraison</h1>
                <p className="text-lg text-gray-600 font-semibold">Gestion des livraisons et suivi en temps réel</p>
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

        {/* Sections */}
        <div className="space-y-8">
          {/* À PRENDRE */}
          <div>
            <SectionHeader
              title="À PRENDRE"
              count={readyOrders.length}
              icon={Package}
              color="yellow"
            />
            <div className="space-y-4">
              {readyOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune commande prête
                    </h3>
                    <p className="text-gray-600">
                      Les commandes prêtes apparaîtront ici automatiquement.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                readyOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
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
                                  Prête
                                </Badge>
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
                              </div>
                              <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{order.address}</span>
                              </div>
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="text-sm text-gray-600">
                                    {item.qty}x {item.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                              Total: <span className="font-semibold text-[#fc0000]">{order.total} DH</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Temps estimé: <span className="font-semibold">{order.estimatedDeliveryTime} min</span>
                            </div>
                          </div>

                          <Button
                            variant="warning"
                            onClick={() => handleTakeForDelivery(order.id)}
                            className="flex items-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            Prendre en charge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* EN LIVRAISON */}
          <div>
            <SectionHeader
              title="EN LIVRAISON"
              count={deliveringOrders.length}
              icon={Truck}
              color="blue"
            />
            <div className="space-y-4">
              {deliveringOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune livraison en cours
                    </h3>
                    <p className="text-gray-600">
                      Les livraisons en cours apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                deliveringOrders.map((order, index) => {
                  const elapsed = getElapsedTime(order.deliveryStartedAt)
                  const timeColor = getTimeColor(elapsed, order.estimatedDeliveryTime)

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
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
                                    En livraison
                                  </Badge>
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
                                      {elapsed} min écoulés
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span>{order.address}</span>
                                </div>
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-sm text-gray-600">
                                      {item.qty}x {item.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-600">
                                Total: <span className="font-semibold text-[#fc0000]">{order.total} DH</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Temps estimé: <span className="font-semibold">{order.estimatedDeliveryTime} min</span>
                              </div>
                              {elapsed > order.estimatedDeliveryTime && (
                                <div className="text-sm text-red-600 font-medium">
                                  Retard: {elapsed - order.estimatedDeliveryTime} min
                                </div>
                              )}
                            </div>

                            <Button
                              variant="success"
                              onClick={() => handleMarkDelivered(order.id)}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Marquer livrée
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>

          {/* LIVRÉES RÉCEMMENT */}
          <div>
            <SectionHeader
              title="LIVRÉES RÉCEMMENT"
              count={recentDeliveredOrders.length}
              icon={CheckCircle}
              color="green"
            />
            <div className="space-y-4">
              {recentDeliveredOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune livraison récente
                    </h3>
                    <p className="text-gray-600">
                      Les livraisons récentes apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                recentDeliveredOrders.map((order, index) => {
                  const deliveryTime = getDeliveryTime(order.deliveryStartedAt, order.deliveredAt)

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow opacity-75">
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
                                    Livrée
                                  </Badge>
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
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">
                                      {deliveryTime} min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <span>{order.address}</span>
                                </div>
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-sm text-gray-600">
                                      {item.qty}x {item.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-600">
                                Total: <span className="font-semibold text-[#fc0000]">{order.total} DH</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Livrée à: <span className="font-semibold">
                                  {new Date(order.deliveredAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
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
      </div>
    </div>
  )
}
