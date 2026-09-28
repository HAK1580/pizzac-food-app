import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react'
import { fetchCart, updateQtyAPI, removeFromCartAPI, closeCart } from '../cart/cartSlice'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const items = useSelector((state) => state.cart.items)
  const isOpen = useSelector((state) => state.cart.isOpen)
  const loading = useSelector((state) => state.cart.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) dispatch(fetchCart())
  }, [isOpen, dispatch])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const totalQty = items.reduce((n, item) => n + item.qty, 0)

  if (!isOpen) return null

  const handleCheckout = () => {
    dispatch(closeCart())
    navigate('/checkout')
  }

  return createPortal(
    <div className='fixed inset-0 z-100'>
      <div
        onClick={() => dispatch(closeCart())}
        className='absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out]'
      />

      {/* h-dvh fixes the mobile address-bar overflow */}
      <div className='absolute inset-y-0 right-0 h-dvh w-full sm:w-100 bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 bg-white shrink-0'>
          <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
            <ShoppingBag size={20} className='text-amber-600' />
            Your Cart
            {totalQty > 0 && (
              <span className='text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full'>
                {totalQty}
              </span>
            )}
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className='p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors'
            aria-label='Close cart'
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: min-h-0 lets this area shrink and scroll instead of pushing the footer out */}
        {loading ? (
          <div className='flex-1 min-h-0 flex items-center justify-center bg-white'>
            <Loader2 size={28} className='animate-spin text-amber-600' />
          </div>
        ) : items.length === 0 ? (
          <div className='flex-1 min-h-0 flex flex-col items-center justify-center gap-3 text-gray-400 px-6 bg-white'>
            <ShoppingBag size={40} strokeWidth={1.5} />
            <p className='text-sm'>Your cart is empty</p>
            <button
              onClick={() => dispatch(closeCart())}
              className='mt-2 text-amber-600 text-sm font-medium hover:underline cursor-pointer'
            >
              Browse the menu
            </button>
          </div>
        ) : (
          <div className='flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 bg-white'>
            <div className='flex flex-col gap-4'>
              {items.map((item) => (
                <div key={item._id} className='flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0'>
                  <img
                    src={item.img}
                    alt={item.name}
                    className='w-16 h-16 rounded-lg object-cover border border-gray-100 shrink-0 bg-amber-50'
                  />
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <p className='text-sm font-semibold text-gray-800 leading-tight'>{item.name}</p>
                      <button
                        onClick={() => dispatch(removeFromCartAPI(item._id))}
                        className='p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer transition-colors shrink-0'
                        aria-label='Remove item'
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className='text-xs text-gray-500 mt-0.5'>Rs{item.price.toFixed(2)} each</p>

                    <div className='flex items-center justify-between mt-2.5'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => dispatch(updateQtyAPI({ id: item._id, qty: Math.max(1, item.qty - 1) }))}
                          disabled={item.qty <= 1}
                          className='p-1 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
                          aria-label='Decrease quantity'
                        >
                          <Minus size={12} />
                        </button>
                        <span className='text-sm font-medium w-5 text-center'>{item.qty}</span>
                        <button
                          onClick={() => dispatch(updateQtyAPI({ id: item._id, qty: item.qty + 1 }))}
                          className='p-1 rounded-md border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors'
                          aria-label='Increase quantity'
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className='text-sm font-semibold text-gray-800'>Rs{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer: extra bottom padding for phones with a home bar */}
        {!loading && items.length > 0 && (
          <div className='border-t border-gray-100 px-4 sm:px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3 bg-white shrink-0'>
            <div className='flex items-center justify-between text-sm text-gray-600'>
              <span>Subtotal</span>
              <span className='font-semibold text-gray-800'>Rs{subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className='w-full bg-amber-600 text-white rounded-xl py-3 font-medium hover:bg-amber-700 transition-colors cursor-pointer'
            >
              Checkout — Rs{subtotal.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default Cart