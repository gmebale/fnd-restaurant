import React, { useEffect, useState } from 'react'
import CategoryFilter from '../components/CategoryFilter'
import MenuCard from '../components/MenuCard'
import * as api from '../lib/api'
import { motion } from 'framer-motion'

export default function MenuPage(){
  const [category, setCategory] = useState('Tous')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    setError(null)
    api.fetchProducts({ category })
      .then(r => {
        setProducts(r)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setError(err.response?.data?.error || 'Erreur lors du chargement des produits')
        setLoading(false)
      })
  }, [category])

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header initial={{opacity:0, y:-12}} animate={{opacity:1, y:0}} className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Poppins'] text-[#fc0000]">NOTRE MENU</h1>
          <p className="text-xl font-bold text-gray-700 mt-2">Découvrez nos délicieuses spécialités</p>
        </motion.header>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
          <CategoryFilter value={category} onChange={setCategory} />
        </motion.div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc0000] mx-auto"></div>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-gray-600">Aucun produit trouvé</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {products.map((p, i)=> (
              <motion.div key={p.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}>
                <MenuCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
