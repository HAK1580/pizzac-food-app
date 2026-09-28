import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Fallback so the app still works if the env variable is missing
const api = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_BASE = `${api}/api/cart`

export const getGuestId = () => {
  let guestId = localStorage.getItem('guestId')
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9) + Date.now()
    localStorage.setItem('guestId', guestId)
  }
  return guestId
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  const headers = { 'x-guest-id': getGuestId() }
  if (token) headers.Authorization = `Bearer ${token}`
  return { headers }
}

const errMsg = (err, fallback) => err.response?.data?.message || fallback

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(API_BASE, getAuthHeaders())
    return res.data.cart_items
  } catch (err) {
    return rejectWithValue(errMsg(err, 'Failed to load cart'))
  }
})

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({ name, price, qty, img }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        API_BASE,
        { name, price, qty, img, guestId: getGuestId() },
        getAuthHeaders()
      )
      return res.data.cart_item
    } catch (err) {
      return rejectWithValue(errMsg(err, 'Failed to add item'))
    }
  }
)

export const updateQtyAPI = createAsyncThunk(
  'cart/updateQtyAPI',
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_BASE}/${id}`, { qty }, getAuthHeaders())
      return res.data.cart_item
    } catch (err) {
      return rejectWithValue(errMsg(err, 'Failed to update quantity'))
    }
  }
)

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthHeaders())
      return id
    } catch (err) {
      return rejectWithValue(errMsg(err, 'Failed to remove item'))
    }
  }
)

export const clearCartAPI = createAsyncThunk('cart/clearCartAPI', async (_, { rejectWithValue }) => {
  try {
    await axios.delete(API_BASE, getAuthHeaders())
  } catch (err) {
    return rejectWithValue(errMsg(err, 'Failed to clear cart'))
  }
})

export const mergeCartAPI = createAsyncThunk('cart/mergeCartAPI', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_BASE}/merge`, { guestId: getGuestId() }, getAuthHeaders())
    return res.data.cart_items
  } catch (err) {
    return rejectWithValue(errMsg(err, 'Failed to merge cart'))
  }
})

const initialState = {
  items: [],
  isOpen: false,
  loading: false,
  error: null,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCart: (state) => { state.isOpen = true },
    closeCart: (state) => { state.isOpen = false },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
    clearCartError: (state) => { state.error = null },

    // Local-only clear (used after a successful order; server already emptied the DB cart)
    clearCart: (state) => {
      state.items = []
    },

    // Full local reset (e.g. on logout)
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(addToCartAPI.pending, (state) => { state.loading = true; state.error = null })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false
        const i = state.items.findIndex((item) => item._id === action.payload._id)
        if (i !== -1) state.items[i] = action.payload
        else state.items.push(action.payload)
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(updateQtyAPI.fulfilled, (state, action) => {
        const item = state.items.find((item) => item._id === action.payload._id)
        if (item) item.qty = action.payload.qty
      })
      .addCase(updateQtyAPI.rejected, (state, action) => { state.error = action.payload })

      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => { state.error = action.payload })

      .addCase(clearCartAPI.fulfilled, (state) => { state.items = [] })
      .addCase(clearCartAPI.rejected, (state, action) => { state.error = action.payload })

      .addCase(mergeCartAPI.pending, (state) => { state.loading = true; state.error = null })
      .addCase(mergeCartAPI.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload || []
      })
      .addCase(mergeCartAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { openCart, closeCart, toggleCart, clearCart, clearCartError, resetCartState } =
  cartSlice.actions

export default cartSlice.reducer