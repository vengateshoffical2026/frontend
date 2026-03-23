import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4ecd8] font-sans text-[#4A3B32] selection:bg-[#8B4513]/30 selection:text-[#8B4513]">
      <Header />
      <main className="flex-1 w-full pt-24">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
