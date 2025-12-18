import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import AdminNav from './AdminNav'

function NavItem({ to, children }){
  return (
    <NavLink
      to={to}
      className={({isActive})=>`px-3 py-2 rounded-md text-sm font-semibold transition ${
        isActive
          ? 'bg-[#fc0000] text-white shadow-sm'
          : 'text-gray-700 hover:bg-[#fc0000]'
      }`}
    >
      {children}
    </NavLink>
  )
}

export default function Header(){
  const { user, loginAsAdmin, logout } = useAuth()
  const { totalCount } = useCart()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const isAdmin = user?.role === 'admin'

  return (
    <>
      {isAdmin && <AdminNav />}
      <header className="fixed top-0 left-0 right-0 z-30">
        <div className="absolute inset-0 bg-[#FFB703]/95 backdrop-blur-xl border-b border-white/60 shadow-sm" />
        <div className={`relative px-6 py-4 flex items-center justify-between transition-all ${isAdmin ? 'ml-64' : 'max-w-7xl mx-auto'}`}>
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={()=>nav('/')}>
              <div className="text-2xl font-extrabold font-poppins tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Fast & Delicious</div>
              <div className="text-xs text-gray-600">Agdal - Rabat</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavItem to="/">Accueil</NavItem>
            <NavItem to="/menu">Menu</NavItem>
            {user && (
              <>
                <NavItem to="/favorites">Favoris</NavItem>
                <NavItem to="/orders">Commandes</NavItem>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/menu" className="hidden md:inline btn-primary rounded-lg px-4 py-2 shadow-md">Commander</a>

            {user?.role !== 'admin' && (
              <button onClick={()=>nav('/cart')} className="relative p-2 rounded-md bg-gray-900 text-white hover:-translate-y-0.5 transition">
                <ShoppingCart size={18} />
                {totalCount>0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-black rounded-full text-xs px-2">{totalCount}</span>}
              </button>
            )}

            {user ? (
              <button
                className="p-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 hidden md:inline"
                onClick={() => nav('/profile')}
                title="Profil"
              >
                <User size={18} />
              </button>
            ) : (
              <button
                className="p-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 hidden md:inline"
                onClick={() => nav('/login')}
                title="Se connecter"
              >
                <User size={18} />
              </button>
            )}

            <button className="md:hidden p-2 rounded-md bg-gray-100" onClick={()=>setOpen(o=>!o)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white px-4 py-4 border-b border-gray-100 shadow-sm md:hidden">
          <div className="flex flex-col gap-3 text-gray-800">
            <NavLink to="/" onClick={()=>setOpen(false)} className={({isActive})=>`px-3 py-2 rounded-md text-sm font-semibold transition ${isActive ? 'bg-[#fc0000] text-white shadow-sm' : 'text-gray-700 hover:bg-[#fc0000]'}`}>Accueil</NavLink>
            <NavLink to="/menu" onClick={()=>setOpen(false)} className={({isActive})=>`px-3 py-2 rounded-md text-sm font-semibold transition ${isActive ? 'bg-[#fc0000] text-white shadow-sm' : 'text-gray-700 hover:bg-[#fc0000]'}`}>Menu</NavLink>
            {user && (
              <>
                <NavLink to="/favorites" onClick={()=>setOpen(false)} className={({isActive})=>`px-3 py-2 rounded-md text-sm font-semibold transition ${isActive ? 'bg-[#fc0000] text-white shadow-sm' : 'text-gray-700 hover:bg-[#fc0000]'}`}>Favoris</NavLink>
                <NavLink to="/orders" onClick={()=>setOpen(false)} className={({isActive})=>`px-3 py-2 rounded-md text-sm font-semibold transition ${isActive ? 'bg-[#fc0000] text-white shadow-sm' : 'text-gray-700 hover:bg-[#fc0000]'}`}>Commandes</NavLink>
              </>
            )}
            <a href="/menu" className="btn-primary px-4 py-2 rounded-lg text-center">Commander</a>
          </div>
        </div>
      )}
    </>
  )
}