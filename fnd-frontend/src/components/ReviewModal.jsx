import React, { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'

export default function ReviewModal({ open, onClose, orderId, onSubmitted }){
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  if(!open) return null

  async function submit(){
    setLoading(true)
    try{
      await api.submitReview({ orderId, rating, comment })
      onSubmitted && onSubmitted()
      onClose()
    }catch(e){ }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="bg-white rounded p-4 w-full max-w-md">
        <h3 className="text-lg font-bold">Donnez votre avis</h3>
        <div className="mt-3">
          <label className="text-sm">Note</label>
          <div className="flex gap-1 mt-1">
            {[1,2,3,4,5].map(n=> (
              <button key={n} className={`px-2 py-1 rounded ${n<=rating? 'bg-yellow-400':'bg-gray-100'}`} onClick={()=>setRating(n)}>{n}★</button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm">Commentaire</label>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full border px-2 py-1 mt-1 rounded" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1" onClick={onClose}>Annuler</button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={submit} disabled={loading}>{loading? '...' : 'Envoyer'}</button>
        </div>
      </motion.div>
    </div>
  )
}
