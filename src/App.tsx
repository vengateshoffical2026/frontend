import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
import Home from './pages/Home'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Journal from './pages/Journal'
import Archive from './pages/Archive'
import Library from './pages/Library'
import Community from './pages/Community'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import NewsEvents from './pages/NewsEvents'
import Sasanam from './pages/Sasanam'
import PdfViewer from './pages/PdfViewer'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'


function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/sasanam" element={<Layout><Sasanam /></Layout>} />
        <Route path="/journal" element={<Layout><Journal /></Layout>} />
        <Route path="/archive" element={<Layout><Archive /></Layout>} />
        <Route path="/library" element={<Layout><Library /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/news-events" element={<Layout><NewsEvents /></Layout>} />
        <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
        <Route path="/signup" element={<Layout hideFooter><Signup /></Layout>} />
        <Route path="/upload" element={<Layout><Upload /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/view/:bookId" element={<PdfViewer />} />
      </Routes>
      <ToastContainer 
        autoClose={2000}
        hideProgressBar={true}
      />
    </>
  )
}

export default App
