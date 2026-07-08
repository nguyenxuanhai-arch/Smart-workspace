import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useClientAuth } from './AuthContext.jsx'
import { cartApi } from '../api/cart.js'

const CART_STORAGE_KEY = 'sw_client_cart'

const CartContext = createContext()

function getLocalCart() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveLocalCart(items) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }
}

function clearLocalCart() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CART_STORAGE_KEY)
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useClientAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load initial cart
  useEffect(() => {
    if (isAuthenticated === undefined) return // still loading auth

    if (!isAuthenticated) {
      setItems(getLocalCart())
      setLoading(false)
    } else {
      syncAndLoadCart()
    }
  }, [isAuthenticated])

  const syncAndLoadCart = async () => {
    setLoading(true)
    try {
      // 1. Sync local items to backend
      const localItems = getLocalCart()
      if (localItems.length > 0) {
        for (const item of localItems) {
          if (item.dbId || typeof item.productId === 'number' || !isNaN(Number(item.productId))) {
             await cartApi.addItem({
               productId: item.dbId || Number(item.productId),
               quantity: item.quantity
             }).catch(console.error)
          }
        }
        clearLocalCart()
      }

      // 2. Fetch fresh cart from backend
      const res = await cartApi.getMyCart()
      
      const mappedItems = res.items.map(apiItem => ({
        id: apiItem.id, // Cart item ID from DB
        productId: apiItem.productId,
        name: apiItem.productName,
        price: apiItem.unitPrice,
        quantity: apiItem.quantity,
        image: apiItem.productImageUrl || '',
        options: [] // Mock options as backend doesn't support yet
      }))
      setItems(mappedItems)
    } catch (error) {
      console.error('Failed to load cart from API', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productData) => {
    if (!isAuthenticated) {
      const nextItems = [...items]
      const existing = nextItems.find(i => i.id === productData.id)
      if (existing) {
        existing.quantity += productData.quantity
      } else {
        nextItems.push(productData)
      }
      saveLocalCart(nextItems)
      setItems(nextItems)
    } else {
      try {
        await cartApi.addItem({
          productId: productData.dbId || Number(productData.productId),
          quantity: productData.quantity
        })
        await syncAndLoadCart()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) quantity = 1
    if (!isAuthenticated) {
      const nextItems = items.map(item => item.id === itemId ? { ...item, quantity } : item)
      saveLocalCart(nextItems)
      setItems(nextItems)
    } else {
      try {
        await cartApi.updateItem(itemId, { quantity })
        await syncAndLoadCart()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const removeItem = async (itemId) => {
    if (!isAuthenticated) {
      const nextItems = items.filter(item => item.id !== itemId)
      saveLocalCart(nextItems)
      setItems(nextItems)
    } else {
      try {
        await cartApi.removeItem(itemId)
        await syncAndLoadCart()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const clear = () => {
    if (!isAuthenticated) {
      clearLocalCart()
      setItems([])
    } else {
      setItems([])
    }
  }

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  return (
    <CartContext.Provider value={{ items, loading, addItem, updateQuantity, removeItem, clear, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
