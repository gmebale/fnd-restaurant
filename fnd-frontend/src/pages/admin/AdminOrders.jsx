import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Filter, Printer, MessageSquare, Clock, ChefHat, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import api from '../../lib/api'
import OrderNotifications from '../../components/OrderNotifications'
import OrderChat from '../../components/OrderChat'

const STATUSES = ['PENDING', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED']

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

// Custom Badge component
const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Custom Select component
const Select = ({ children, className = '', ...props }) => (
  <select className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props}>
    {children}
  </select>
)

// Custom Input component
const Input = ({ className = '', ...props }) => (
  <input className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props} />
)

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Tous')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [chatOrderId, setChatOrderId] = useState(null)
  const mounted = useRef(true)

  async function load() {
    try {
      console.log('Loading orders...')
      const data = await api.getAllOrders()
      console.log('Orders loaded:', data)
      if (mounted.current) setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
      if (mounted.current) setOrders([])
    }
  }

  useEffect(() => {
    mounted.current = true
    load()
    const t = setInterval(load, 5000)
    return () => {
      mounted.current = false
      clearInterval(t)
    }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= 6) {
        setFilter(STATUSES[num - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function changeStatus(orderId, status) {
    await api.updateOrderStatus(orderId, status)
    load()
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PREPARING: { label: 'En préparation', color: 'bg-orange-100 text-orange-800', icon: ChefHat },
      READY: { label: 'Prêt', color: 'bg-blue-100 text-blue-800', icon: Package },
      DELIVERING: { label: 'En livraison', color: 'bg-purple-100 text-purple-800', icon: Truck },
      DELIVERED: { label: 'Livré', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: Package }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'Tous' || order.status === filter
    const matchesSearch = !searchTerm ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || order.createdAt?.startsWith(dateFilter)
    return matchesStatus && matchesSearch && matchesDate
  })

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Commande ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { margin: 10px 0; }
            .total { font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FND Restaurant</h1>
            <p>Ticket de commande</p>
          </div>
          <div class="details">
            <p><strong>Commande:</strong> ${order.id}</p>
            <p><strong>Téléphone:</strong> ${order.phone}</p>
            <p><strong>Adresse:</strong> ${order.address}</p>
            <p><strong>Statut:</strong> ${getStatusBadge(order.status).label}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div class="total">
            <p>Total: ${order.total} DH</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderNotifications />

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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Gestion des Commandes</h1>
                <p className="text-lg text-gray-600 font-semibold">Gérez toutes les commandes en cours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'Tous' ? 'default' : 'secondary'}
              onClick={() => setFilter('Tous')}
              className="flex items-center gap-2"
            >
              Toutes ({orders.length})
            </Button>
            {STATUSES.map((status, index) => {
              const count = orders.filter(o => o.status === status).length
              const statusInfo = getStatusBadge(status)
              return (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'secondary'}
                  onClick={() => setFilter(status)}
                  className="flex items-center gap-2"
                >
                  <statusInfo.icon className="w-4 h-4" />
                  {statusInfo.label} ({count})
                </Button>
              )
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                    <Input
                      placeholder="ID commande, téléphone, adresse..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('')
                        setDateFilter('')
                        setFilter('Tous')
                      }}
                      className="w-full"
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Total Display */}
        <div className="mb-6">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total des commandes affichées</p>
                  <p className="text-2xl font-extrabold text-gray-900">{filteredOrders.length} commandes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Revenus totaux</p>
                  <p className="text-3xl font-extrabold text-[#fc0000]">{totalRevenue} DH</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune commande trouvée</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{order.id}</h3>
                          <Badge className={getStatusBadge(order.status).color}>
                            {getStatusBadge(order.status).label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-semibold">{order.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Adresse</p>
                            <p className="font-semibold">{order.address}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-extrabold text-[#fc0000]">{order.total} DH</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Notes</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Select
                          value={order.status}
                          onChange={(e) => changeStatus(order.id, e.target.value)}
                          disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          className="min-w-[140px]"
                        >
                          {STATUSES.map(status => (
                            <option key={status} value={status}>{getStatusBadge(status).label}</option>
                          ))}
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => printOrder(order)}
                          className="flex items-center gap-2"
                        >
                          <Printer className="w-4 h-4" />
                          Ticket
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setChatOrderId(order.id)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Chat */}
        {chatOrderId && (
          <OrderChat orderId={chatOrderId} />
        )}
      </div>
    </div>
  )
}
