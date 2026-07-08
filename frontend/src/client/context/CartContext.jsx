import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useClientAuth } from './AuthContext.jsx'
import { getCartItems, saveCartItems, clearCart } from '../utils/cartStorage.js'
import { cartApi } from '../api/cart.js'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { isAuthenticated } = useClientAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Load initial cart
  useEffect(() => {
    if (isAuthenticated === undefined) return // still loading auth

    if (!isAuthenticated) {
      setItems(getCartItems())
      setLoading(false)
    } else {
      syncAndLoadCart()
    }
  }, [isAuthenticated])

  const syncAndLoadCart = async () => {
    setLoading(true)
    try {
      // 1. Check if there are items in localStorage to sync
      const localItems = getCartItems()
      if (localItems.length > 0) {
        // Sync each item to backend
        // Note: Backend might group same productId, we just push them sequentially
        for (const item of localItems) {
          // If productId is not a number, it might be a mock data. We try to sync only if it has a numeric or valid DB id.
          // Wait, local item has `productId: product.id` if added recently.
          if (item.dbId || typeof item.productId === 'number' || !isNaN(Number(item.productId))) {
             await cartApi.addItem({
               productId: item.dbId || Number(item.productId),
               quantity: item.quantity
             }).catch(console.error)
          }
        }
        clearCart()
      }

      // 2. Fetch fresh cart from backend
      const res = await cartApi.getMyCart()
      // Map API response to frontend format
      const mappedItems = res.items.map(apiItem => ({
        id: apiItem.id, // This is cartItemId
        productId: apiItem.productId,
        name: apiItem.productName,
        price: apiItem.unitPrice,
        quantity: apiItem.quantity,
        image: apiItem.productImageUrl || '',
        options: [] // API doesn't support options yet
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
      saveCartItems(nextItems)
      setItems(nextItems)
    } else {
      try {
        await cartApi.addItem({
          productId: productData.dbId || Number(productData.productId),
          quantity: productData.quantity
        })
        await syncAndLoadCart() // reload to get the latest state from backend
      } catch (err) {
        console.error(err)
      }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) quantity = 1
    if (!isAuthenticated) {
      const nextItems = items.map(item => item.id === itemId ? { ...item, quantity } : item)
      saveCartItems(nextItems)
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
      saveCartItems(nextItems)
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
      clearCart()
      setItems([])
    } else {
      // Backend doesn't have clear API, we'd have to delete one by one or ignore.
      // Usually used after successful checkout.
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
