import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import MenuCard from '../components/MenuCard'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, Bike, ShieldCheck, Flame, Sparkles, CheckCircle2 } from 'lucide-react'

const highlights = [
  { title: 'Livraison', value: '20 - 40 min', pill: 'Prioritaire' },
  { title: 'Ouvert', value: '20h - 05h', pill: '7j/7' },
  { title: 'Zone', value: 'Agdal & proches', pill: 'Suivi live' }
]

const steps = [
  { icon: CheckCircle2, title: 'Choisis', desc: 'Compose ton burger, tacos ou menu en 2 clics.' },
  { icon: Clock3, title: 'On prépare', desc: 'Cuisson minute, produits frais, sauces maison.' },
  { icon: Bike, title: 'On livre', desc: 'Livreurs géolocalisés, info temps réel jusqu’à ta porte.' }
]

const perks = [
  { icon: Flame, title: 'Saveurs F&D', desc: 'Recettes généreuses et gourmandes, inspirées du spot de Rabat.' },
  { icon: ShieldCheck, title: 'Fiable & rapide', desc: 'Paiement simple, notifications automatiques, suivi clair.' },
  { icon: Sparkles, title: 'Loyalty', desc: 'Points fidélité et offres du soir pour les habitués.' }
]

export default function Home(){
  const [popular, setPopular] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)
    
    api.fetchPopular()
      .then(r => {
        if (mounted) {
          setPopular(r)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          console.error('Error fetching popular products:', err)
          setError(err.response?.data?.error || 'Erreur lors du chargement')
          setLoading(false)
        }
      })
    
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fc0000] via-[#d00000] to-[#b30000] text-white">
      <section className="relative overflow-hidden">
        <div className="hero-glow" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{duration:0.6}} className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-sm border text-sm font-semibold text-black">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Livraison locale en soirée
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-poppins font-extrabold leading-tight text-white">
              Fast & Delicious
              <span className="block text-3xl sm:text-4xl font-semibold text-white/80 mt-2">Agdal, Rabat — le spot pour tes cravings nocturnes</span>
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl">
              Burgers, tacos, menus complets : commande en ligne, on prépare minute et on livre en priorité dans Agdal et les alentours.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a href="/menu" className="btn-primary rounded-lg font-semibold flex items-center gap-3 shadow-lg transform hover:-translate-y-1 transition-all">
                Commander maintenant <ArrowRight size={18} />
              </a>
              <a href="/menu" className="btn-secondary font-semibold flex items-center gap-2 hover:-translate-y-1 transition bg-white/10 border border-white/20 text-white">
                Voir le menu
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {highlights.map((item)=> (
                <div key={item.title} className="bg-white/10 border border-white/20 text-white rounded-2xl p-4 shadow-soft-lg">
                  <div className="text-sm text-white/70">{item.title}</div>
                  <div className="text-xl font-bold text-white">{item.value}</div>
                  <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-semibold">{item.pill}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{duration:0.6, delay:0.1}} className="relative">
            <div className="absolute -left-10 -top-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60" />
            <div className="absolute -right-6 top-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-60" />
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/70 bg-white relative">
              <img src="/images/hero.jpg" alt="Plats Fast & Delicious" className="object-cover w-full h-[460px]" />
              <div className="absolute top-4 right-4 bg-white/95 px-3 py-2 rounded-full text-sm font-semibold shadow">
                Livraison prioritaire
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-3 rounded-2xl shadow flex items-center gap-3">
                <Clock3 size={18} className="text-primary" />
                <div>
                  <div className="text-xs text-gray-500">Temps moyen</div>
                  <div className="font-semibold text-gray-900">30 min</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{opacity:0, y:-12}} animate={{opacity:1, y:0}} className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-3xl font-poppins font-bold text-white">Nos favoris</h2>
            <p className="text-white/80">Les best-sellers qui partent en moins de 40 minutes.</p>
          </div>
          <a href="/menu" className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">Voir tout le menu <ArrowRight size={16} /></a>
        </motion.div>
        {loading ? (
          <div className="text-center text-white/80 py-10">Chargement des produits populaires...</div>
        ) : error ? (
          <div className="text-center text-red-300 py-10">{error}</div>
        ) : popular.length === 0 ? (
          <div className="text-center text-white/80 py-10">Aucun produit populaire pour le moment</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {popular.map((p, i)=> (
              <motion.div key={p.id} initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:i*0.08}}>
                <MenuCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white/10 border border-white/15 rounded-3xl p-6 shadow-soft-lg">
          <h3 className="text-2xl font-poppins font-bold text-white mb-4">Comment ça marche ?</h3>
          <div className="space-y-4">
            {steps.map((step, idx)=> (
              <div key={step.title} className="flex gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">{idx+1}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon size={18} className="text-white" />
                    <p className="font-semibold text-white">{step.title}</p>
                  </div>
                  <p className="text-sm text-white/80 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-10 w-64 h-64 bg-red-500/10 blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-poppins font-bold mb-4">Pourquoi Fast & Delicious ?</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {perks.map((perk)=> (
                <div key={perk.title} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
                    <perk.icon size={18} />
                  </div>
                  <p className="font-semibold text-gray-900">{perk.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-[#fc0000] to-[#ff6b35] rounded-3xl text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/10">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-white/80 font-semibold">Prêt à déguster ?</p>
            <h4 className="text-2xl md:text-3xl font-poppins font-bold mt-1">Commande prioritaire et retrait en 20 minutes</h4>
            <p className="text-white/85 mt-2">On lance la cuisson dès ta commande, tu suis chaque étape en temps réel.</p>
          </div>
          <div className="flex gap-3">
            <a href="/menu" className="bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold shadow-lg hover:-translate-y-1 transition">Commander</a>
            <a href="/orders" className="bg-white/15 border border-white/30 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/20 transition">Suivre ma commande</a>
          </div>
        </div>
      </section>
    </div>
  )
}
