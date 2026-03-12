import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Journal from './pages/Journal'
import Archive from './pages/Archive'
import Library from './pages/Library'
import Community from './pages/Community'
import Pricing from './pages/Pricing'


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/library" element={<Library />} />
      <Route path="/community" element={<Community />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
