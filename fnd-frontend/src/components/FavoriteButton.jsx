import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import * as api from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function FavoriteButton({ productId }){
  const { user } = useAuth()
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if (!user) {
      setFav(false)
      return
    }

    let mounted = true
    setLoading(true)
    
    api.fetchFavorites()
      .then(favorites => {
        if (!mounted) return
        const isFavorite = favorites.some(f => 
          (f.product?.id || f.productId || f.id) === productId
        )
        setFav(isFavorite)
        setLoading(false)
      })
      .catch(err => {
        if (!mounted) return
        console.error('Error checking favorite:', err)
        setLoading(false)
      })
    
    return () => { mounted = false }
  }, [productId, user])

  async function toggle(){
    if (!user) {
      // Redirect to login or show message
      return
    }

    setLoading(true)
    try {
      if (fav) {
        await api.removeFavorite(productId)
        setFav(false)
      } else {
        await api.addFavorite(productId)
        setFav(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Optionally show error message
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Don't show favorite button if not logged in
  }

  return (
    <button 
      onClick={toggle} 
      disabled={loading}
      className={`p-2 rounded transition ${fav ? 'text-red-500' : 'text-gray-400'} ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'}`}
      title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart fill={fav ? 'currentColor' : 'none'} />
    </button>
  )
}
