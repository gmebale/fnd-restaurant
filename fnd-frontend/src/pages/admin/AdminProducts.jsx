import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react'
import api from '../../lib/api'

const empty = { name:'', category:'Burgers', description:'', price:0, image:'/images/placeholder.jpg', available:true, popular:false }

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

// Custom Textarea component
const Textarea = ({ className = '', ...props }) => (
  <textarea className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props} />
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

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function load() {
    setLoading(true)
    const data = await api.fetchProducts()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? Number(value) : value)
    }))
  }

  async function create() {
    const p = await api.createProduct(form)
    setProducts(prev => [p, ...prev])
    setForm(empty)
    setIsModalOpen(false)
  }

  async function save() {
    await api.updateProduct(editing, form)
    setEditing(null)
    setForm(empty)
    setIsModalOpen(false)
    load()
  }

  async function remove(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await api.deleteProduct(id)
    load()
  }

  async function toggleAvailable(id, current) {
    await api.updateProduct(id, { available: !current })
    load()
  }

  async function togglePopular(id, current) {
    await api.updateProduct(id, { popular: !current })
    load()
  }

  function startEdit(p) {
    setEditing(p.id)
    setForm({ ...p })
    setIsModalOpen(true)
  }

  function openAddModal() {
    setEditing(null)
    setForm(empty)
    setIsModalOpen(true)
  }

  const categories = ['Burgers', 'Pizzas', 'Salades', 'Desserts', 'Boissons']

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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Gestion des Produits</h1>
                <p className="text-lg text-gray-600 font-semibold">Gérez votre catalogue de produits</p>
              </div>
            </div>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => toggleAvailable(product.id, product.available)}
                          className={`p-2 rounded-full ${product.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                        >
                          {product.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => togglePopular(product.id, product.popular)}
                          className={`p-2 rounded-full ${product.popular ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-extrabold text-[#fc0000]">{product.price} DH</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                          {product.available ? 'Disponible' : 'Indisponible'}
                        </Badge>
                        {product.popular && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Populaire
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => startEdit(product)}
                          className="flex-1 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Éditer
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => remove(product.id)}
                          className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editing ? 'Modifier le produit' : 'Ajouter un produit'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Nom du produit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Description du produit"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DH)</label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={onChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <Input
                  name="image"
                  value={form.image}
                  onChange={onChange}
                  placeholder="URL de l'image"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.available}
                    onChange={(checked) => setForm(f => ({ ...f, available: checked }))}
                  />
                  <label className="text-sm font-medium text-gray-700">Disponible</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.popular}
                    onChange={(checked) => setForm(f => ({ ...f, popular: checked }))}
                  />
                  <label className="text-sm font-medium text-gray-700">Populaire</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={editing ? save : create}>
                {editing ? 'Sauvegarder' : 'Créer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
