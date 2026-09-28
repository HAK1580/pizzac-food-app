import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ShoppingBag, MapPin, Phone, Banknote, CreditCard, PartyPopper, User, Mail } from 'lucide-react'
import { clearCart, getGuestId } from './cart/cartSlice'

const api = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const Checkout = () => {
    const items = useSelector((state) => state.cart.items)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const guestId = getGuestId()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { paymentMethod: 'COD' },
    })

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

    const onSubmit = async (data) => {
        try {
            const headers = { 'x-guest-id': guestId }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await axios.post(
                `${api}/api/orders`,
                {
                    deliveryAddress: {
                        street: data.street,
                        city: data.city,
                        phone: data.phone,
                    },
                    paymentMethod: data.paymentMethod,
                    guestId,
                    guestInfo: !token ? {
                        name: data.guestName || '',
                        email: data.guestEmail || '',
                    } : undefined,
                },
                { headers }
            )

            dispatch(clearCart())
            toast.success('🎉 Order placed successfully!')
            navigate('/', { state: { order: response.data.order } })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order. Please try again.')
        }
    }

    if (items.length === 0) {
        return (
            <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 bg-white'>
                <div className='bg-violet-50 border-2 border-violet-200 rounded-3xl p-8 flex flex-col items-center gap-3'>
                    <ShoppingBag size={48} strokeWidth={1.5} className='text-violet-500' />
                    <p className='text-lg font-bold text-gray-800'>Your cart is empty</p>
                    <button
                        onClick={() => navigate('/')}
                        className='bg-violet-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-violet-700 transition-colors cursor-pointer shadow-md'
                    >
                        Browse the menu 🍕
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-white py-8 px-4'>
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 flex items-center gap-2'>
                    <PartyPopper className='text-violet-600' size={32} />
                    Checkout
                </h1>

                <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
                    {/* Order summary */}
                    <div className='md:col-span-2 order-2 md:order-1'>
                        <div className='bg-white border-2 border-violet-200 rounded-3xl p-5 shadow-md'>
                            <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
                                <ShoppingBag size={18} className='text-violet-600' />
                                Order Summary
                            </h2>

                            <div className='flex flex-col gap-3 max-h-72 overflow-y-auto pr-1'>
                                {items.map((item) => (
                                    <div key={item._id || item.id} className='flex items-center gap-3 bg-teal-50 rounded-xl p-2 border border-teal-100'>
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className='w-12 h-12 rounded-lg object-cover border-2 border-white shadow shrink-0'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-semibold text-gray-800 truncate'>{item.name}</p>
                                            <p className='text-xs text-gray-500'>Qty: {item.qty}</p>
                                        </div>
                                        <p className='text-sm font-bold text-pink-600 shrink-0'>
                                            Rs {(item.price * item.qty).toFixed(0)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className='border-t-2 border-dashed border-violet-200 mt-4 pt-4 flex items-center justify-between'>
                                <span className='text-gray-500 text-sm font-medium'>Total</span>
                                <span className='text-2xl font-extrabold text-violet-600'>
                                    Rs {subtotal.toFixed(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery form */}
                    <div className='md:col-span-3 order-1 md:order-2'>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='bg-white border-2 border-violet-200 rounded-3xl p-5 shadow-md flex flex-col gap-4'
                        >
                            {!token && (
                                <div className='flex flex-col gap-3 pb-2 border-b-2 border-dashed border-violet-100'>
                                    <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                                        <User size={18} className='text-violet-600' />
                                        Contact Information
                                    </h2>
                                    <div>
                                        <input
                                            type='text'
                                            placeholder='Your Full Name'
                                            className='border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 w-full text-sm transition-colors'
                                            {...register('guestName', { required: 'Name is required for guest checkout' })}
                                        />
                                        {errors.guestName && (
                                            <p className='text-pink-600 text-xs mt-1'>{errors.guestName.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <div className='relative'>
                                            <Mail size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-violet-500' />
                                            <input
                                                type='email'
                                                placeholder='Email Address'
                                                className='border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-violet-500 w-full text-sm transition-colors'
                                                {...register('guestEmail', {
                                                    required: 'Email is required for order updates',
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Enter a valid email address',
                                                    },
                                                })}
                                            />
                                        </div>
                                        {errors.guestEmail && (
                                            <p className='text-pink-600 text-xs mt-1'>{errors.guestEmail.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                                <MapPin size={18} className='text-teal-600' />
                                Delivery Details
                            </h2>

                            <div>
                                <input
                                    type='text'
                                    placeholder='Street Address'
                                    className='border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 w-full text-sm transition-colors'
                                    {...register('street', { required: 'Street address is required' })}
                                />
                                {errors.street && (
                                    <p className='text-pink-600 text-xs mt-1'>{errors.street.message}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type='text'
                                    placeholder='City'
                                    className='border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-violet-500 w-full text-sm transition-colors'
                                    {...register('city', { required: 'City is required' })}
                                />
                                {errors.city && (
                                    <p className='text-pink-600 text-xs mt-1'>{errors.city.message}</p>
                                )}
                            </div>

                            <div>
                                <div className='relative'>
                                    <Phone size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-teal-500' />
                                    <input
                                        type='tel'
                                        placeholder='Phone Number'
                                        className='border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-violet-500 w-full text-sm transition-colors'
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9+\-\s]{10,15}$/,
                                                message: 'Enter a valid phone number',
                                            },
                                        })}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className='text-pink-600 text-xs mt-1'>{errors.phone.message}</p>
                                )}
                            </div>

                            <div className='mt-1'>
                                <p className='text-sm font-semibold text-gray-700 mb-2'>Payment Method</p>
                                <div className='grid grid-cols-2 gap-3'>
                                    <label className='flex items-center gap-2 border-2 border-gray-200 bg-white rounded-xl px-3 py-2.5 cursor-pointer has-[:checked]:border-teal-500 has-[:checked]:bg-teal-50 transition-colors'>
                                        <input type='radio' value='COD' className='accent-teal-600' {...register('paymentMethod')} />
                                        <Banknote size={16} className='text-teal-600' />
                                        <span className='text-sm text-gray-700 font-medium'>Cash on Delivery</span>
                                    </label>
                                    <label className='flex items-center gap-2 border-2 border-gray-200 bg-white rounded-xl px-3 py-2.5 cursor-pointer has-[:checked]:border-pink-500 has-[:checked]:bg-pink-50 transition-colors'>
                                        <input type='radio' value='card' className='accent-pink-600' {...register('paymentMethod')} />
                                        <CreditCard size={16} className='text-pink-600' />
                                        <span className='text-sm text-gray-700 font-medium'>Card</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='bg-violet-600 text-white rounded-full py-3.5 mt-2 font-bold hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-md'
                            >
                                {isSubmitting && (
                                    <span className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                )}
                                {isSubmitting ? 'Placing Order...' : `Place Order — Rs ${subtotal.toFixed(0)} 🎉`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout