import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Tag, Percent, DollarSign, Calendar, Users, ToggleLeft, ToggleRight } from 'lucide-react'
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

// Custom Input component
const Input = ({ className = '', ...props }) => (
  <input className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props} />
)

// Custom Select component
const Select = ({ children, className = '', ...props }) => (
  <select className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props}>
    {children}
  </select>
)

// Custom Switch component
const Switch = ({ checked, onChange, className = '' }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${checked ? 'bg-[#fc0000]' : 'bg-gray-200'} ${className}`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
)

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-extrabold font-['Poppins'] text-gray-900 mb-4">
                  {title}
                </h3>
                {children}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    minOrder: 0,
    expiration: '',
    usageLimit: 0,
    active: true
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true)
        const response = await api.get('/promo')
        const promoCodes = response.data.map(promo => ({
          id: promo.code,
          code: promo.code,
          type: promo.type.toLowerCase(),
          value: promo.value,
          minOrder: promo.minAmount || 0,
          expiration: promo.validUntil.split('T')[0],
          usageLimit: promo.usageLimit || 0,
          active: promo.active,
          usedCount: promo.usageCount
        }))
        setPromotions(promoCodes)
      } catch (error) {
        console.error('Failed to fetch promotions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPromotions()
  }, [])

  const getTypeIcon = (type) => {
    return type === 'percentage' ? Percent : DollarSign
  }

  const getTypeLabel = (type) => {
    return type === 'percentage' ? 'Pourcentage' : 'Montant fixe'
  }

  const getValueDisplay = (type, value) => {
    return type === 'percentage' ? `${value}%` : `${value} DH`
  }

  const isExpired = (expiration) => {
    return new Date(expiration) < new Date()
  }

  const handleSubmit = async () => {
    try {
      const promoData = {
        code: form.code,
        type: form.type.toUpperCase(),
        value: form.value,
        minAmount: form.minOrder,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: form.expiration,
        usageLimit: form.usageLimit || null,
        active: form.active
      }

      if (editing) {
        // Update existing promotion
        await api.put(`/promo/${editing}`, promoData)
        setPromotions(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p))
      } else {
        // Add new promotion
        await api.post('/promo', promoData)
        const newPromotion = { ...form, id: form.code, usedCount: 0 }
        setPromotions(prev => [...prev, newPromotion])
      }
      setIsModalOpen(false)
      setEditing(null)
      setForm({
        code: '',
        type: 'percentage',
        value: 0,
        minOrder: 0,
        expiration: '',
        usageLimit: 0,
        active: true
      })
    } catch (error) {
      console.error('Failed to save promotion:', error)
    }
  }

  const handleEdit = (promotion) => {
    setEditing(promotion.id)
    setForm({ ...promotion })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return
    try {
      setPromotions(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Failed to delete promotion:', error)
    }
  }

  const toggleActive = async (id, current) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !current } : p))
  }

  const openAddModal = () => {
    setEditing(null)
    setForm({
      code: '',
      type: 'percentage',
      value: 0,
      minOrder: 0,
      expiration: '',
      usageLimit: 0,
      active: true
    })
    setIsModalOpen(true)
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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Gestion des Promotions</h1>
                <p className="text-lg text-gray-600 font-semibold">Créez et gérez vos codes promo</p>
              </div>
            </div>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle promotion
            </Button>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, index) => {
            const TypeIcon = getTypeIcon(promo.type)
            const expired = isExpired(promo.expiration)
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`hover:shadow-md transition-shadow ${!promo.active || expired ? 'opacity-75' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100">
                          <Tag className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{promo.code}</h3>
                          <Badge className={promo.active && !expired ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                            {promo.active && !expired ? 'Active' : expired ? 'Expirée' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={promo.active}
                          onChange={() => toggleActive(promo.id, promo.active)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Type</span>
                        </div>
                        <span className="font-semibold">{getTypeLabel(promo.type)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Réduction</span>
                        <span className="font-bold text-[#fc0000] text-lg">{getValueDisplay(promo.type, promo.value)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Commande min.</span>
                        <span className="font-semibold">{promo.minOrder} DH</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Expiration</span>
                        </div>
                        <span className={`font-semibold ${expired ? 'text-red-600' : 'text-gray-900'}`}>
                          {new Date(promo.expiration).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Utilisations</span>
                        </div>
                        <span className="font-semibold">
                          {promo.usedCount}{promo.usageLimit > 0 ? `/${promo.usageLimit}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(promo)}
                        className="flex-1 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(promo.id)}
                        className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editing ? 'Modifier la promotion' : 'Nouvelle promotion'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code promo</label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="WELCOME10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de réduction</label>
                <Select
                  value={form.type}
                  onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="percentage">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valeur {form.type === 'percentage' ? '(%)' : '(DH)'}
                </label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                  placeholder="10"
                  min="0"
                  max={form.type === 'percentage' ? 100 : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commande minimum (DH)</label>
                <Input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm(f => ({ ...f, minOrder: Number(e.target.value) }))}
                  placeholder="50"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                <Input
                  type="date"
                  value={form.expiration}
                  onChange={(e) => setForm(f => ({ ...f, expiration: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limite d'utilisation (0 = illimité)</label>
                <Input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm(f => ({ ...f, usageLimit: Number(e.target.value) }))}
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={form.active}
                onChange={(checked) => setForm(f => ({ ...f, active: checked }))}
              />
              <label className="text-sm font-medium text-gray-700">Promotion active</label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editing ? 'Sauvegarder' : 'Créer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
