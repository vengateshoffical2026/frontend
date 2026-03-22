import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Journal from './pages/Journal'
import Archive from './pages/Archive'
import Library from './pages/Library'
import Community from './pages/Community'
import Pricing from './pages/Pricing'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './components/Layout'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/journal" element={<Layout><Journal /></Layout>} />
        <Route path="/archive" element={<Layout><Archive /></Layout>} />
        <Route path="/library" element={<Layout><Library /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
        <Route path="/signup" element={<Layout hideFooter><Signup /></Layout>} />
      </Routes>
      <ToastContainer 
        autoClose={2000}
        hideProgressBar={true}
      />
    </>
  )
}

export default App
