import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, MessageSquare, Trash2, Reply, TrendingUp, Users, MessageCircle } from 'lucide-react'
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
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
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

// Star Rating component
const StarRating = ({ rating, className = '' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))}
  </div>
)

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const [reviewsResponse, statsResponse] = await Promise.all([
          api.get('/review/admin/all'),
          api.get('/review/stats')
        ])

        const reviewsData = reviewsResponse.data.map(review => ({
          id: review.id,
          orderId: review.order.id,
          customerName: review.user.name,
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt,
          reply: review.adminResponse
        }))

        setReviews(reviewsData)
        setStats(statsResponse.data)
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return
    try {
      setReviews(prev => prev.filter(r => r.id !== id))
      // Update stats after deletion
      const newReviews = reviews.filter(r => r.id !== id)
      const totalReviews = newReviews.length
      const avgRating = totalReviews > 0 ? newReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0
      const ratingDistribution = newReviews.reduce((dist, review) => {
        dist[review.rating] = (dist[review.rating] || 0) + 1
        return dist
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

      setStats({
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        ratingDistribution
      })
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const handleReply = (reviewId) => {
    const reply = prompt('Entrez votre réponse :')
    if (reply) {
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, reply } : r
      ))
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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Avis Clients</h1>
                <p className="text-lg text-gray-600 font-semibold">Gérez les retours de vos clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Note Moyenne</p>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.avgRating}</p>
                  <StarRating rating={Math.round(stats.avgRating)} className="mt-1" />
                </div>
                <div className="p-3 rounded-xl bg-yellow-100">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Avis</p>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.totalReviews}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Avis 5★</p>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.ratingDistribution[5]}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {stats.totalReviews > 0 ? Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Avis 1★</p>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.ratingDistribution[1]}</p>
                  <p className="text-sm text-red-600 font-medium">
                    {stats.totalReviews > 0 ? Math.round((stats.ratingDistribution[1] / stats.totalReviews) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-100">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="font-bold text-gray-900">Répartition des Notes</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className="font-semibold">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-[40px] text-right">
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-gray-100">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            {review.orderId}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <StarRating rating={review.rating} className="mb-3" />
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        {review.reply && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            <div className="flex items-center gap-2 mb-2">
                              <Reply className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-800">Votre réponse</span>
                            </div>
                            <p className="text-blue-700">{review.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    {!review.reply && (
                      <Button
                        variant="outline"
                        onClick={() => handleReply(review.id)}
                        className="flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        Répondre
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
