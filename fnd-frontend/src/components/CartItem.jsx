import React from 'react'

export default function CartItem({ item, onUpdateQty, onRemove }){
  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded shadow">
      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{item.product.name}</div>
        <div className="text-sm text-gray-600">{item.product.description}</div>
        <div className="mt-2 flex items-center gap-2">
          <button className="px-2 bg-gray-100 rounded" onClick={()=>onUpdateQty(item.id, item.qty-1)}>-</button>
          <div className="px-3">{item.qty}</div>
          <button className="px-2 bg-gray-100 rounded" onClick={()=>onUpdateQty(item.id, item.qty+1)}>+</button>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold">{item.product.price * item.qty} DH</div>
        <button className="text-sm text-red-600 mt-2" onClick={()=>onRemove(item.id)}>Supprimer</button>
      </div>
    </div>
  )
}
