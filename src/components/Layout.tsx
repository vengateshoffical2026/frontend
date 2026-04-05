import React, { lazy, Suspense } from 'react'
import Header from './Header'
import Footer from './Footer'
import { isBusinessMode } from '../config'

const NotificationPopup = lazy(() => import('./NotificationPopup'))

interface LayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-body selection:bg-primary/30 selection:text-primary">
      <Header />
      {isBusinessMode && (
        <Suspense fallback={null}>
          <NotificationPopup />
        </Suspense>
      )}
      <main className="flex-1 w-full pt-24 relative z-0">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
