import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Checkout from './components/Checkout'
import Menue from './components/Menue'
import { Menu } from 'lucide-react'
import Contact from './pages/Contact'
import About from './pages/About'
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <div>
        <Navbar />
      <Routes>
        <Route path='/'  element={<Homepage/>}   />
        <Route path='/checkout' element={ <Checkout/> } />
         <Route path='/about' element={<About/>} />
         <Route path='/contact' element={<Contact/>} />

      </Routes>
    </div>
  )
}

export default App