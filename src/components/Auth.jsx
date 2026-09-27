import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import toast, { Toaster } from 'react-hot-toast'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const decoded = jwtDecode(token)
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return
      }
      setUser(decoded.user_info)
    } catch (err) {
      localStorage.removeItem('token')
    }
  }, [])
  const api=import.meta.env.VITE_API_URL
  

  const onLoginSubmit = async (data) => {
    setMessage(null)
    try {
      const response = await axios.post(`${api}/api/user/sign-in`, data)
      const token = response.data.token
      if (token) {
        localStorage.setItem("token", token)
        const decoded = jwtDecode(token)
        const info = decoded.user_info
        setUser(info)
        toast.success(
          <div>
            <p className='font-semibold text-sm'>Welcome back{info?.name ? `, ${info.name}` : ''} 👋</p>
            <p className='text-xs text-gray-500'>{info?.email}</p>
          </div>,
          { duration: 4000 }
        )
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Login failed. Please try again.',
      })
    }
  }

  const onSignupSubmit = async (data) => {
    setMessage(null)
    try {
      const response = await axios.post(`${api}/api/user/sign-up`, data)
      setMessage({ type: 'success', text: response.data.message || 'Account created successfully' })
      toast.success('Account created — now log in')
      setIsLogin(true)
      reset()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Signup failed. Please try again.',
      })
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setMessage(null)
    reset()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast('Logged out')
  }

  return (
    <>
      <Toaster position='top-center' />

      {user ? (
        <div className='absolute top-16 right-3 z-50 w-[90vw] max-w-80 sm:w-80 bg-white p-4 sm:p-6 rounded-xl shadow-lg border'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm shrink-0'>
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className='min-w-0'>
              <p className='font-semibold text-sm truncate'>{user.name || 'User'}</p>
              <p className='text-xs text-gray-500 truncate'>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='w-full mt-4 border border-amber-600 text-amber-600 rounded-xl py-2 text-sm hover:bg-amber-50 cursor-pointer'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='absolute top-16 right-3 z-50 w-[90vw] max-w-80 sm:w-80 bg-white p-4 sm:p-6 rounded-xl shadow-lg border'>
          <h2 className='text-lg sm:text-xl font-bold text-center mb-4'>
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          <form
            onSubmit={handleSubmit(isLogin ? onLoginSubmit : onSignupSubmit)}
            className='flex flex-col gap-3'
          >
            {!isLogin && (
              <div>
                <input
                  type='text'
                  placeholder='Full Name'
                  className='border rounded-lg px-4 py-2 outline-amber-600 w-full text-sm sm:text-base'
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <input
                type='email'
                placeholder='Email'
                className='border rounded-lg px-4 py-2 outline-amber-600 w-full text-sm sm:text-base'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
                })}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                type='password'
                placeholder='Password'
                className='border rounded-lg px-4 py-2 outline-amber-600 w-full text-sm sm:text-base'
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              {errors.password && (
                <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
              )}
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-amber-600 text-white rounded-xl py-2 mt-1 cursor-pointer hover:bg-amber-700 text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {isSubmitting && (
                <span className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              )}
              {isSubmitting
                ? (isLogin ? 'Logging in...' : 'Signing up...')
                : (isLogin ? 'Login' : 'Sign Up')}
            </button>

            {message && (
              <p
                className={`text-center text-xs sm:text-sm mt-1 ${
                  message.type === 'success' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {message.text}
              </p>
            )}
          </form>

          <p className='text-center text-xs sm:text-sm mt-3'>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              onClick={toggleMode}
              className='text-amber-600 cursor-pointer font-medium'
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      )}
    </>
  )
}

export default Auth