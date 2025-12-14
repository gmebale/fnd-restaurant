import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import * as api from '../lib/api'
import { motion } from 'framer-motion'
// Note: shadcn/ui Card not installed yet, using basic divs

export default function LoyaltyDisplay() {
  const { user } = useAuth()

  const { data: loyaltyData, isLoading, error } = useQuery({
    queryKey: ['loyaltyPoints', user?.id],
    queryFn: api.getLoyaltyPoints,
    enabled: !!user,
  })

  if (!user) return null

  const points = loyaltyData?.points ?? 0
  const total_spent = loyaltyData?.total_spent ?? 0
  const orders_count = loyaltyData?.orders_count ?? 0
  const progress_percent = loyaltyData?.progress_percent ?? 0
  const next_reward_amount_needed = loyaltyData?.next_reward_amount_needed ?? 100

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg rounded-lg">
        <div className="p-6">
          <div className="text-2xl font-bold flex items-center mb-4">
            <span className="mr-2">🎁</span> Programme de Fidélité
          </div>
        </div>
        <div className="p-6 pt-0">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">Chargement...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-200">Erreur lors du chargement des données de fidélité</p>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{points}</div>
                <p className="text-sm opacity-90">Points de fidélité</p>
              </div>

              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progrès vers la prochaine récompense</span>
                  <span>{progress_percent}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <motion.div
                    className="bg-white h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress_percent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs mt-2 opacity-90">
                  Encore {next_reward_amount_needed} DH dépensés pour gagner 10 DH de récompense !
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{total_spent.toFixed(2)} DH</div>
                  <p className="text-sm opacity-90">Total dépensé</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{orders_count}</div>
                  <p className="text-sm opacity-90">Commandes</p>
                </div>
              </div>

              <div className="text-xs opacity-75 text-center">
                <p>1 DH dépensé = 1 point • 100 points = 10 DH offerts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
