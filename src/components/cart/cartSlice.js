import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
    const api=import.meta.env.VITE_API_URL

const CART_KEY = 'cart'
const API_BASE = `${api}/api/cart`

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

// ---- API thunks (matches your cartController) ----

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_BASE, authHeaders())
    return response.data.cart_items
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart')
  }
})

export const addToCartAPI = createAsyncThunk(
  'cart/addToCartAPI',
  async ({ name, price, qty, img }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE, { name, price, qty, img }, authHeaders())
      return response.data.cart_item
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item')
    }
  }
)

export const updateQtyAPI = createAsyncThunk(
  'cart/updateQtyAPI',
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE}/${id}`, { qty }, authHeaders())
      return response.data.cart_item
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update quantity')
    }
  }
)

export const removeFromCartAPI = createAsyncThunk(
  'cart/removeFromCartAPI',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, authHeaders())
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item')
    }
  }
)

export const clearCartAPI = createAsyncThunk('cart/clearCartAPI', async (_, { rejectWithValue }) => {
  try {
    await axios.delete(API_BASE, authHeaders())
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart')
  }
})

const initialState = {
  items: loadCart(),
  isOpen: false,
  loading: false,
  error: null,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // local/guest cart — unchanged
    addToCart: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        existing.qty += action.payload.qty || 1
      } else {
        state.items.push({ ...action.payload, qty: action.payload.qty || 1 })
      }
      saveCart(state.items)
    },
    updateQty: (state, action) => {
      const { id, delta } = action.payload
      const item = state.items.find((item) => item.id === id)
      if (item) item.qty = Math.max(1, item.qty + delta)
      saveCart(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      saveCart(state.items)
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // addToCartAPI
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const existing = state.items.find((item) => item._id === action.payload._id)
        if (existing) {
          existing.qty = action.payload.qty
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.error = action.payload
      })

      // updateQtyAPI
      .addCase(updateQtyAPI.fulfilled, (state, action) => {
        const item = state.items.find((item) => item._id === action.payload._id)
        if (item) item.qty = action.payload.qty
      })
      .addCase(updateQtyAPI.rejected, (state, action) => {
        state.error = action.payload
      })

      // removeFromCartAPI
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload)
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.error = action.payload
      })

      // clearCartAPI
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = []
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { addToCart, updateQty, removeFromCart, clearCart, openCart, closeCart } = cartSlice.actions

export default cartSlice.reducer