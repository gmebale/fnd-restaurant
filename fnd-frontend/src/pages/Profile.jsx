import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Edit, Save, LogOut, User } from 'lucide-react'
import * as api from '../lib/api'

// Custom Card component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

// Custom Button component
const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
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
  <input className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${className}`} {...props} />
)

// Custom Textarea component
const Textarea = ({ className = '', ...props }) => (
  <textarea className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${className}`} {...props} />
)

export default function Profile(){
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  function onChange(e){
    setForm(f=> ({ ...f, [e.target.name]: e.target.value }))
  }

  async function save(){
    setSaving(true)
    setMessage(null)

    try {
      // Update user via API
      const response = await api.updateProfile(form)
      updateUser(response.user)

      setMessageType('success')
      setMessage('Profil mis à jour avec succès')
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessageType('error')
      setMessage(error.response?.data?.error || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la Page */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Poppins'] text-[#fc0000]">MON PROFIL</h1>
          <p className="text-xl font-bold text-gray-700">Gérez vos informations personnelles</p>
        </div>

        {/* Carte d'Accès Admin (Conditionnelle) */}
        {isAdmin && (
          <Card className="border-4 border-[#FFB703] bg-gradient-to-br from-[#FFB703] to-[#FFB703]/80 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Shield className="w-16 h-16 text-gray-900" />
                  <div>
                    <h2 className="text-2xl font-extrabold font-['Poppins'] text-gray-900">ACCÈS ADMINISTRATEUR</h2>
                    <p className="text-gray-800 font-semibold">Vous avez les droits d'administrateur</p>
                  </div>
                </div>
                <Button className="bg-gray-900 text-[#FFB703] hover:bg-gray-800 w-full md:w-auto" onClick={() => navigate('/admin')}>
                   DASHBOARD ADMIN
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Carte d'Informations du Profil */}
        <Card className="border-4 border-[#fc0000]">
          {/* Header de Carte */}
          <CardHeader className="bg-[#FFB703] border-b-4 border-[#fc0000] text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold font-['Poppins'] text-gray-900">{user?.name}</h2>
                <p className="text-gray-700 font-semibold">{user?.email}</p>
                {isAdmin && (
                  <Badge className="bg-[#fc0000] text-white font-bold mt-2">ADMIN</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Contenu de la Carte */}
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Détails du Profil</h3>

            {/* Formulaire */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  name="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  disabled={!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse par défaut</label>
                <Textarea
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  disabled={!editing}
                  rows={3}
                />
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className={`mt-4 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-2">
              {!editing ? (
                <Button className="flex items-center bg-[#fc0000] hover:bg-red-700" onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              ) : (
                <>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={save} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditing(false)
                    setForm({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' })
                    setMessage(null)
                  }}>
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bouton de Déconnexion */}
        <div className="mt-8">
          <Button variant="destructive" className="flex items-center w-full sm:w-auto" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}
