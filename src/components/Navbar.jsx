import React, { useState, useRef, useEffect } from 'react'
import { Menu, X, ShoppingCart, User2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { openCart } from '../components/cart/cartSlice'
import Auth from '../components/Auth'
import Cart from '../components/cart/Cart'

const navLinks = ['Home', 'Menu', 'About', 'Contact']

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const authRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authRef.current && !authRef.current.contains(e.target)) {
        setShowAuth(false)
      }
    }
    if (showAuth) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showAuth])

  // Exact Pixel Scroll Calculation for Menu Section
  const scrollToMenu = () => {
    const element = document.getElementById('menu')
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleNavClick = (link) => {
    setIsOpen(false)

    if (link === 'Home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate('/')
      }
      return
    }

    if (link === 'Menu') {
      if (location.pathname === '/') {
        setTimeout(scrollToMenu, 50)
      } else {
        navigate('/')
        setTimeout(scrollToMenu, 400)
      }
      return
    }

    if (link === 'Contact') {
      navigate('/contact')
      return
    }

    if (link === 'About') {
      navigate('/about')
      return
    }
  }

  return (
    <nav className='sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'>
      <Toaster position='top-right' />

      <div className='relative'>
        <div className='flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <button onClick={() => setIsOpen(!isOpen)} className='md:hidden p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors' aria-label='Toggle menu'>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className='flex items-center gap-2.5 cursor-pointer' onClick={() => handleNavClick('Home')}>
              <img className='w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-amber-500 ring-offset-2' src='pizzac.jfif' alt='Pizzac' />
              <span className='hidden sm:block text-xl font-extrabold text-gray-800 tracking-tight'>Pizzac</span>
            </div>
          </div>

          <ul className='hidden md:flex items-center gap-10 text-sm font-semibold text-gray-500 absolute left-1/2 -translate-x-1/2'>
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href='#'
                  onClick={(e) => { e.preventDefault(); handleNavClick(link) }}
                  className='relative py-1 hover:text-amber-600 transition-colors group'
                >
                  {link}
                  <span className='absolute left-0 -bottom-0.5 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300' />
                </a>
              </li>
            ))}
          </ul>

          <div className='flex items-center gap-2 sm:gap-3'>
            <button onClick={() => dispatch(openCart())} className='relative p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors md:hidden' aria-label='Cart'>
              <ShoppingCart size={22} />
            </button>
            <button onClick={() => dispatch(openCart())} className='hidden md:flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2 rounded-full cursor-pointer hover:border-amber-500 hover:text-amber-600 transition-colors text-sm font-semibold'>
              <ShoppingCart size={16} />
              Cart
            </button>

            <button onClick={() => setShowAuth(!showAuth)} className='p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors md:hidden' aria-label='Account'>
              <User2 size={22} />
            </button>
            <button onClick={() => setShowAuth(!showAuth)} className='hidden md:block px-6 py-2 rounded-full cursor-pointer bg-amber-500 text-white text-sm font-semibold shadow-sm hover:bg-amber-600 hover:shadow-md transition-all'>
              Login
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className='flex flex-col gap-1 px-4 pb-4 pt-1 text-gray-600 font-semibold border-t border-gray-100'>
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href='#'
                  onClick={(e) => { e.preventDefault(); handleNavClick(link) }}
                  className='block py-2 hover:text-amber-600 transition-colors'
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {showAuth && (
          <div ref={authRef}>
            <Auth />
          </div>
        )}
      </div>

      <Cart />
    </nav>
  )
}

export default Navbar