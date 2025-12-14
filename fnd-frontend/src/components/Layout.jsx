import React from 'react'
import Header from './Header'
import Footer from './Footer'

import PageTransition from './PageTransition'

export default function Layout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
