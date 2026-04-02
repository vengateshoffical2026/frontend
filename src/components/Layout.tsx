import React from 'react'
import Header from './Header'
import Footer from './Footer'
import NotificationPopup from './NotificationPopup'

interface LayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-body selection:bg-primary/30 selection:text-primary">
      <Header />
      <NotificationPopup />
      <main className="flex-1 w-full pt-24">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
