import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'
import CountdownGate from './components/CountdownGate'

const ToastContainer = lazy(() =>
  import('react-toastify').then(m => ({ default: m.ToastContainer }))
)

// Eagerly load Home for fastest LCP
import Home from './pages/Home'
import Donation from './pages/Donation'

// Lazy load all other routes
const Upload = lazy(() => import('./pages/Upload'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Journal = lazy(() => import('./pages/Journal'))
const Archive = lazy(() => import('./pages/Archive'))
const Library = lazy(() => import('./pages/Library'))
const Community = lazy(() => import('./pages/Community'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NewsEvents = lazy(() => import('./pages/NewsEvents'))
const Sasanam = lazy(() => import('./pages/Sasanam'))
const PdfViewer = lazy(() => import('./pages/PdfViewer'))
const Profile = lazy(() => import('./pages/Profile'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function App() {
  return (
    <CountdownGate>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-cream" />}>
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
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/news-events" element={<Layout><NewsEvents /></Layout>} />
          <Route path='/donation' element={<Layout><Donation /></Layout>} />
          <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
          <Route path="/signup" element={<Layout hideFooter><Signup /></Layout>} />
          <Route path="/forgot-password" element={<Layout hideFooter><ForgotPassword /></Layout>} />
          <Route path="/reset-password" element={<Layout hideFooter><ResetPassword /></Layout>} />
          <Route path="/auth/callback" element={<Layout hideFooter><AuthCallback /></Layout>} />
          <Route path="/upload" element={<Layout><Upload /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/view/:bookId" element={<PdfViewer />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
        />
      </Suspense>
    </CountdownGate>
  )
}

export default App
