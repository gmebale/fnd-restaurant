import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import CartItem from '../components/CartItem'
import * as api from '../lib/api'

export default function CartPage(){
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()
  const [address, setAddress] = useState(user?.address || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [notes, setNotes] = useState('')
  const [promo, setPromo] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [usingPoints, setUsingPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('error') // 'success' or 'error'

  async function handlePromoApply(){
    if(!promo) return
    try{
      const result = await api.validatePromoCode(promo, subtotal)
      setPromoDiscount(result.discount || 0)
      setMessageType('success')
      setMessage(`Code promo appliqué: ${result.discount} DH de réduction`)
    }catch(e){
      setMessageType('error')
      setMessage(e.response?.data?.error || 'Code promo invalide')
      setPromoDiscount(0)
    }
  }

  async function handleOrder(){
    if(!address || !phone) {
      setMessageType('error')
      return setMessage('Adresse et téléphone requis')
    }
    setLoading(true)
    setMessage(null)

    const orderData = {
      phone,
      address,
      notes,
      items: items.map(i => ({
        productId: i.product?.id || i.productId,
        quantity: i.qty,
      })),
      promoCode: promo || undefined,
      usePoints: usingPoints > 0 ? usingPoints : undefined,
    }

    try{
      const res = await api.createOrder(orderData)
      await clearCart()
      setMessageType('success')
      setMessage(`Commande créée avec succès! ID: ${res.id}`)
      if (user) {
        setTimeout(() => {
          navigate('/orders')
        }, 2000)
      } else {
        setTimeout(() => {
          navigate('/menu')
        }, 2000)
      }
    }catch(e){
      setMessageType('error')
      setMessage(e.response?.data?.error || e.message || 'Erreur lors de la commande')
    }finally{
      setLoading(false)
    }
  }

  const deliveryFee = 15 // From backend config
  const total = subtotal - promoDiscount + deliveryFee - (usingPoints * 0.1) // Assuming 1 point = 0.1 DH

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center gap-4">
        <a href="/menu" className="text-sm text-gray-600">← Retour au menu</a>
        <h1 className="text-2xl font-bold">MON PANIER</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {items.length===0 ? (
            <div className="p-6 bg-white rounded">Votre panier est vide.</div>
          ) : items.map(i=> (
            <CartItem key={i.id} item={i} onUpdateQty={updateQty} onRemove={removeItem} />
          ))}
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Livraison</h3>
          <div className="mt-2">
            <label className="block text-sm">Adresse *</label>
            <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full border px-2 py-1 rounded mt-1" />
          </div>
          <div className="mt-2">
            <label className="block text-sm">Téléphone *</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border px-2 py-1 rounded mt-1" />
          </div>
          <div className="mt-2">
            <label className="block text-sm">Notes (optionnel)</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full border px-2 py-1 rounded mt-1" />
          </div>

          <div className="mt-4">
            <label className="block text-sm">Code promo</label>
            <div className="flex flex-wrap gap-2 mt-1">
              <input 
                value={promo} 
                onChange={e=>setPromo(e.target.value)} 
                className="flex-1 border px-2 py-1 rounded" 
                placeholder="Entrez le code"
              />
              <button 
                onClick={handlePromoApply}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                Appliquer
              </button>
            </div>
            {promoDiscount > 0 && (
              <div className="mt-1 text-sm text-green-600">Réduction: -{promoDiscount} DH</div>
            )}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between"><span>Sous-total</span><span className="font-semibold">{subtotal.toFixed(2)} DH</span></div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600"><span>Réduction</span><span>-{promoDiscount.toFixed(2)} DH</span></div>
            )}
            <div className="flex justify-between"><span>Livraison</span><span className="font-semibold">{deliveryFee} DH</span></div>
            {usingPoints > 0 && (
              <div className="flex justify-between text-blue-600"><span>Points utilisés ({usingPoints})</span><span>-{(usingPoints * 0.1).toFixed(2)} DH</span></div>
            )}
            <div className="mt-3 text-xl font-bold">TOTAL: {total.toFixed(2)} DH</div>
            <button
              disabled={loading || items.length===0}
              onClick={handleOrder}
              className="mt-4 w-full py-3 rounded bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'COMMANDE EN COURS...' : 'COMMANDER MAINTENANT'}
            </button>
            {message && (
              <div className={`mt-3 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}
            {!user && (
              <div className="mt-2 text-sm text-gray-600">
                <a href="/profile" className="text-blue-600 underline">Connectez-vous</a> pour suivre vos commandes
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
