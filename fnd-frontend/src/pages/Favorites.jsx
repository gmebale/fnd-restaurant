import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import MenuCard from '../components/MenuCard'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Favorites(){
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    if (!user) {
      setProducts([])
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)
    
    api.fetchFavorites()
      .then(favorites => {
        if (!mounted) return
        // API returns favorites with product data
        const favoriteProducts = favorites.map(fav => fav.product || fav)
        setProducts(favoriteProducts)
        setLoading(false)
      })
      .catch(err => {
        if (!mounted) return
        console.error('Error fetching favorites:', err)
        setError(err.response?.data?.error || 'Erreur lors du chargement des favoris')
        setLoading(false)
      })
    
    return () => { mounted = false }
  }, [user])

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Favoris</h1>
        <div className="p-6 bg-white rounded">
          <p className="text-gray-600">Vous devez être connecté pour voir vos favoris.</p>
          <a href="/profile" className="text-blue-600 underline mt-2 inline-block">Se connecter</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header initial={{opacity:0, y:-12}} animate={{opacity:1, y:0}} className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Poppins'] text-[#fc0000]">MES FAVORIS</h1>
          <p className="text-xl font-bold text-gray-700 mt-2">Vos produits préférés à portée de main</p>
        </motion.header>

        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fc0000] mx-auto"></div>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-gray-600">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            Vous n'avez pas encore de favoris.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
