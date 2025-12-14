import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-[#fc0000] text-white mt-8">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="text-2xl font-extrabold font-poppins tracking-tight bg-gradient-to-r from-[#FFB703] to-white bg-clip-text text-transparent">Fast & Delicious</div>
          <p className="text-white/80 text-sm">Cuisine nocturne, livraison prioritaire a Agdal et alentours. Burgers, tacos, menus prets en moins de 40 minutes.</p>
          <Link to="/menu" className="inline-flex w-fit mt-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold shadow hover:-translate-y-0.5 transition">Commander maintenant</Link>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Navigation</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/orders">Commandes</Link></li>
            <li><Link to="/favorites">Favoris</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Contact & horaires</h4>
          <p className="text-sm text-white/80">20h - 05h - 7j/7</p>
          <p className="text-sm text-white/80 mt-1">Agdal, Rabat</p>
          <p className="text-sm text-white/80 mt-1">Tel : 06 66 12 34 56</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-white/60 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Fast & Delicious. Tous droits reserves.</span>
          <span>Livraison locale - Agdal & proches quartiers</span>
        </div>
      </div>
    </footer>
  )
}