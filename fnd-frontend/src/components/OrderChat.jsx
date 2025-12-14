import React, { useEffect, useRef, useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

export default function OrderChat({ orderId }){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const boxRef = useRef()

  useEffect(()=>{ if(open) boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, open])

  function send(){
    if(!text) return
    setMessages(prev => [...prev, { id: Date.now(), text, from: 'user', date: new Date().toISOString() }])
    setText('')
    setTimeout(()=> setMessages(prev=> [...prev, { id: Date.now()+1, text: 'Réponse auto: Nous avons reçu votre message.', from: 'admin', date: new Date().toISOString() }]), 800)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {open && (
        <div className="w-80 h-96 bg-white shadow-lg rounded flex flex-col overflow-hidden">
          <div className="p-2 bg-red-600 text-white flex items-center justify-between">
            <div className="font-semibold">Chat commande {orderId}</div>
            <button onClick={()=>setOpen(false)}><X /></button>
          </div>
          <div className="flex-1 p-2 overflow-auto space-y-2">
            {messages.map(m=> (
              <div key={m.id} className={`p-2 rounded ${m.from==='user'? 'bg-yellow-50 self-end':'bg-gray-100 self-start'}`}>{m.text}</div>
            ))}
            <div ref={boxRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border px-2 py-1 rounded" placeholder="Message..." />
            <button className="bg-red-600 text-white px-3 rounded" onClick={send}>Envoyer</button>
          </div>
        </div>
      )}
      {!open && (
        <button onClick={()=>setOpen(true)} className="bg-red-600 text-white p-3 rounded-full shadow flex items-center gap-2">
          <MessageSquare /> Chat
        </button>
      )}
    </div>
  )
}
