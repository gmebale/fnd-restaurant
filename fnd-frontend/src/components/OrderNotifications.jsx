import React, { useEffect, useRef, useState } from 'react'
import api from '../lib/api'

export default function OrderNotifications(){
  const [lastCount, setLastCount] = useState(0)
  const audioRef = useRef(null)

  useEffect(()=>{
    audioRef.current = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA')
    let mounted = true
    async function poll(){
      const orders = await api.fetchOrders()
      if(!mounted) return
      if(orders.length > lastCount){
        try{ if('Notification' in window && Notification.permission === 'granted'){ new Notification('Nouvelle commande', { body: 'Vous avez une nouvelle commande en attente.' }) } }
        catch(e){}
        audioRef.current && audioRef.current.play().catch(()=>{})
      }
      setLastCount(orders.length)
    }
    poll()
    const t = setInterval(poll, 5000)
    return ()=>{ mounted = false; clearInterval(t) }
  }, [lastCount])

  useEffect(()=>{
    if('Notification' in window && Notification.permission !== 'granted'){
      Notification.requestPermission().catch(()=>{})
    }
  }, [])

  return null
}
