import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Users, DollarSign, ChefHat, Truck, UserCheck, UserX } from 'lucide-react'
import api, { getStaff, createStaff, updateStaff, deleteStaff } from '../../lib/api'

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

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    role: 'cuisinier',
    phone: '',
    email: '',
    status: 'active',
    hireDate: '',
    salary: 0
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true)
        const staffData = await getStaff()
        setStaff(staffData)
      } catch (error) {
        console.error('Failed to fetch staff:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  const getRoleIcon = (role) => {
    switch (role) {
      case 'cuisinier': return ChefHat
      case 'livreur': return Truck
      case 'serveur': return Users
      case 'manager': return UserCheck
      default: return Users
    }
  }

  const getRoleLabel = (role) => {
    const labels = {
      cuisinier: 'Cuisinier',
      serveur: 'Serveur',
      livreur: 'Livreur',
      manager: 'Manager'
    }
    return labels[role] || role
  }

  const getStatusBadge = (status) => {
    return status === 'active'
      ? { label: 'Actif', color: 'bg-green-100 text-green-800' }
      : { label: 'Inactif', color: 'bg-gray-100 text-gray-800' }
  }

  const handleSubmit = async () => {
    try {
      if (editing) {
        // Update existing staff
        const updatedStaff = await updateStaff(editing, form)
        setStaff(prev => prev.map(s => s.id === editing ? updatedStaff : s))
      } else {
        // Add new staff
        const newStaff = await createStaff(form)
        setStaff(prev => [...prev, newStaff])
      }
      setIsModalOpen(false)
      setEditing(null)
      setForm({
        name: '',
        role: 'cuisinier',
        phone: '',
        email: '',
        status: 'active',
        hireDate: '',
        salary: 0
      })
    } catch (error) {
      console.error('Failed to save staff:', error)
      alert('Erreur lors de la sauvegarde de l\'employé')
    }
  }

  const handleEdit = (staffMember) => {
    setEditing(staffMember.id)
    setForm({ ...staffMember })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) return
    try {
      await deleteStaff(id)
      setStaff(prev => prev.filter(s => s.id !== id))
    } catch (error) {
      console.error('Failed to delete staff:', error)
      alert('Erreur lors de la suppression de l\'employé')
    }
  }

  const openAddModal = () => {
    setEditing(null)
    setForm({
      name: '',
      role: 'cuisinier',
      phone: '',
      email: '',
      status: 'active',
      hireDate: '',
      salary: 0
    })
    setIsModalOpen(true)
  }

  const activeStaff = staff.filter(s => s.status === 'active')
  const totalSalary = activeStaff.reduce((sum, s) => sum + s.salary, 0)

  const staffByRole = activeStaff.reduce((acc, s) => {
    acc[s.role] = (acc[s.role] || 0) + 1
    return acc
  }, {})

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
                <h1 className="text-4xl font-extrabold font-['Poppins'] text-gray-900">Gestion du Personnel</h1>
                <p className="text-lg text-gray-600 font-semibold">Gérez votre équipe</p>
              </div>
            </div>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un employé
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Employés Actifs</p>
                  <p className="text-3xl font-extrabold text-gray-900">{activeStaff.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Salaire Total</p>
                  <p className="text-3xl font-extrabold text-gray-900">{totalSalary} DH</p>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Cuisiniers</p>
                  <p className="text-3xl font-extrabold text-gray-900">{staffByRole.cuisinier || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Livreurs</p>
                  <p className="text-3xl font-extrabold text-gray-900">{staffByRole.livreur || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-gray-900">Liste du Personnel</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Employé</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rôle</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date d'embauche</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Salaire</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, index) => {
                    const RoleIcon = getRoleIcon(member.role)
                    const statusInfo = getStatusBadge(member.status)
                    return (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">{member.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <RoleIcon className="w-4 h-4 text-gray-600" />
                            <span>{getRoleLabel(member.role)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>{member.phone}</div>
                            <div className="text-gray-600">{member.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm">{new Date(member.hireDate).toLocaleDateString('fr-FR')}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#fc0000]">{member.salary} DH</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleEdit(member)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDelete(member.id)}
                              className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editing ? 'Modifier l\'employé' : 'Ajouter un employé'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <Select
                  value={form.role}
                  onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="cuisinier">Cuisinier</option>
                  <option value="serveur">Serveur</option>
                  <option value="livreur">Livreur</option>
                  <option value="manager">Manager</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+212 6 XX XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@fnd.ma"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <Select
                  value={form.status}
                  onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
                <Input
                  type="date"
                  value={form.hireDate}
                  onChange={(e) => setForm(f => ({ ...f, hireDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salaire (DH)</label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm(f => ({ ...f, salary: Number(e.target.value) }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editing ? 'Sauvegarder' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
