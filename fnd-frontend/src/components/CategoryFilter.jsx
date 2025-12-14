import React from 'react'

const categories = ['Tous','Burgers','Tacos','Menus','Accompagnements','Boissons']

export default function CategoryFilter({ value, onChange }){
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={()=>onChange(cat)}
          className={`px-4 py-2 rounded-full border text-sm font-semibold transition transform ${
            value===cat
              ? 'bg-gray-900 text-white shadow-lg border-gray-900 hover:-translate-y-0.5'
              : 'bg-white/90 text-gray-800 border-gray-200 hover:-translate-y-0.5 hover:border-gray-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
