import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, DollarSign, Users, Tag, UtensilsCrossed, Truck, MessageSquare } from 'lucide-react'

export default function AdminNav(){
  return (
    <nav className="fixed left-0 top-20 h-screen w-64 bg-gray-900 text-white overflow-y-auto z-20">
      <div className="p-4 space-y-2">
        <AdminNavLink to="/admin" icon={<LayoutDashboard size={18} />}>Dashboard</AdminNavLink>
        <AdminNavLink to="/admin/orders" icon={<ShoppingCart size={18} />}>Commandes</AdminNavLink>
        <AdminNavLink to="/admin/kitchen" icon={<UtensilsCrossed size={18} />}>Cuisine</AdminNavLink>
        <AdminNavLink to="/admin/delivery" icon={<Truck size={18} />}>Livraison</AdminNavLink>
        <AdminNavLink to="/admin/products" icon={<Package size={18} />}>Produits</AdminNavLink>
        <AdminNavLink to="/admin/reviews" icon={<MessageSquare size={18} />}>Avis</AdminNavLink>
      </div>
    </nav>
  )
}

function AdminNavLink({ to, icon, children }){
  return (
    <NavLink to={to} className={({isActive})=>`flex items-center gap-2 px-3 py-2 rounded transition-colors ${isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
      {icon}
      <span>{children}</span>
    </NavLink>
  )
}
