import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import OrderTracker from '../components/OrderTracker'
import OrderChat from '../components/OrderChat'
import LoyaltyDisplay from '../components/LoyaltyDisplay'
import ReviewModal from '../components/ReviewModal'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { motion } from 'framer-motion'
import { RefreshCw, Printer, RotateCcw, Star, Check } from 'lucide-react'

export default function Orders(){
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [activeOrder, setActiveOrder] = useState(null)

  const reorderItems = (orderItems) => {
    orderItems.forEach(item => {
      addToCart({
        id: item.productId || item.id,
        name: item.productName || item.name,
        price: item.productPrice || item.price,
        quantity: item.quantity
      })
    })
    alert('Articles ajoutés au panier !')
  }

  useEffect(()=>{
    if (!user) {
      setOrders([])
      return
    }

    setLoading(true)
    setError(null)
    api.fetchOrders()
      .then(r => {
        setOrders(r)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching orders:', err)
        setError(err.response?.data?.error || 'Erreur lors du chargement des commandes')
        setLoading(false)
      })
  }, [user])

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">MES COMMANDES</h1>
        <div className="p-6 bg-white rounded">
          <p className="text-gray-600">Vous devez être connecté pour voir vos commandes.</p>
          <a href="/profile" className="text-blue-600 underline mt-2 inline-block">Se connecter</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoyaltyDisplay />

        <motion.header initial={{opacity:0, y:-12}} animate={{opacity:1, y:0}} className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold font-['Poppins'] text-[#fc0000]">MES COMMANDES</h1>
            <p className="text-xl font-bold text-gray-700 mt-2">Suivez vos commandes en temps réel</p>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center" onClick={() => api.fetchOrders().then(setOrders)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>
        </motion.header>

        <motion.div layout className="space-y-6">
          {loading ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc0000] mx-auto"></div>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center text-gray-600">
              <div className="text-6xl mb-4">📦</div>
              Vous n'avez pas encore de commandes.
            </div>
          ) : (
            orders.map((o, i) => (
              <motion.div key={o.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}>
                <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#fc0000]">
                  <div className="bg-[#FFB703] rounded-2xl p-6 border-b-4 border-[#fc0000]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">Commande #{o.id}</div>
                        <div className="text-sm text-gray-700">{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{o.total} DH</div>
                        <div className="text-sm text-gray-600 capitalize">{o.status}</div>
                        {o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && (
                          <div className="text-sm text-gray-600">⏱ Livraison estimée : 30 min</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-3">Articles commandés</h4>
                        <ul className="space-y-2">
                          {o.items?.map((it, idx) => (
                            <li key={it.id || idx} className="flex justify-between">
                              <span>{it.quantity}x {it.productName || it.name}</span>
                              <span>{it.productPrice || it.price} DH</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 text-sm text-gray-600">
                          <div>Adresse : {o.address}</div>
                          <div>Téléphone : {o.phone}</div>
                          {o.notes && <div>Notes : {o.notes}</div>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <OrderTracker status={o.status.toLowerCase()} />
                        <div className="flex flex-wrap gap-2">
                          <button className="px-4 py-2 border border-[#fc0000] rounded hover:bg-[#fc0000] flex items-center justify-center">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Commander à nouveau
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center">
                            <Printer className="w-4 h-4 mr-2" />
                            Imprimer
                          </button>
                          {o.status === 'DELIVERED' && !o.review ? (
                            <button
                              className="px-4 py-2 bg-[#FFB703] rounded hover:bg-yellow-400 flex items-center justify-center"
                              onClick={() => { setActiveOrder(o); setReviewOpen(true) }}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Avis
                            </button>
                          ) : o.status === 'DELIVERED' && o.review ? (
                            <div className="px-4 py-2 bg-green-100 text-green-800 rounded flex items-center justify-center">
                              <Check className="w-4 h-4 mr-2" />
                              Avis donné
                            </div>
                          ) : null}
                        </div>
                        <OrderChat orderId={o.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <ReviewModal
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          orderId={activeOrder?.id}
          onSubmitted={() => {
            // Refresh orders after review submission
            api.fetchOrders().then(setOrders)
          }}
        />
      </div>
    </div>
  )
}
