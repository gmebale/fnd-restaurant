import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenuPage from './pages/Menu'
import CartPage from './pages/Cart'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminFinances from './pages/admin/AdminFinances'
import AdminStaff from './pages/admin/AdminStaff'
import AdminPromotions from './pages/admin/AdminPromotions'
import AdminKitchen from './pages/admin/AdminKitchen'
import AdminDelivery from './pages/admin/AdminDelivery'
import AdminReviews from './pages/admin/AdminReviews'

function RequireAuth({ children }){
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

function RequireAdmin({ children }){
  const { user } = useAuth()
  if(!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return <Navigate to="/" />
  return children
}

const queryClient = new QueryClient()

export default function App(){
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/menu" element={<MenuPage/>} />
              <Route path="/cart" element={<CartPage/>} />
              <Route path="/orders" element={<RequireAuth><Orders/></RequireAuth>} />
              <Route path="/favorites" element={<RequireAuth><Favorites/></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />

              <Route path="/admin" element={<RequireAdmin><AdminDashboard/></RequireAdmin>} />
              <Route path="/admin/orders" element={<RequireAdmin><AdminOrders/></RequireAdmin>} />
              <Route path="/admin/products" element={<RequireAdmin><AdminProducts/></RequireAdmin>} />
              <Route path="/admin/finances" element={<RequireAdmin><AdminFinances/></RequireAdmin>} />
              <Route path="/admin/staff" element={<RequireAdmin><AdminStaff/></RequireAdmin>} />
              <Route path="/admin/promotions" element={<RequireAdmin><AdminPromotions/></RequireAdmin>} />
              <Route path="/admin/kitchen" element={<RequireAdmin><AdminKitchen/></RequireAdmin>} />
              <Route path="/admin/delivery" element={<RequireAdmin><AdminDelivery/></RequireAdmin>} />
              <Route path="/admin/reviews" element={<RequireAdmin><AdminReviews/></RequireAdmin>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
