import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import FavoriteButton from './FavoriteButton'

export default function MenuCard({ product }){
  const { addItem } = useCart()

  return (
    <motion.article layout initial={{opacity:1, y:12}} whileHover={{y:-6}} className="card-surface rounded-2xl transition-all overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={product.image} alt={product.name} className="object-cover h-full w-full transform hover:scale-105 transition-transform duration-300" />
        {product.popular && (
          <div className="absolute top-3 right-3 bg-[#FFB703] px-3 py-1 rounded-full text-xs font-bold">HOT</div>
        )}
        <div className="absolute left-4 bottom-3 price-badge">{product.price} DH</div>
      </div>
      <div className="flex-1 p-4">
        <h3 className="font-poppins font-bold text-lg text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
      </div>
      <div className="p-4 border-t flex items-center gap-3">
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} className="flex-1 px-4 py-2 rounded-lg btn-primary font-semibold" onClick={()=>addItem(product)}>
          Ajouter
        </motion.button>
        <FavoriteButton productId={product.id} />
      </div>
    </motion.article>
  )
}
