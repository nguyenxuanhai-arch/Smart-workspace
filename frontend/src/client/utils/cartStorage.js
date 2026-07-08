export const CART_STORAGE_KEY = 'sw_client_cart'
export const CART_UPDATED_EVENT = 'sw_client_cart_updated'

export const defaultCartItems = [
  {
    id: 'smart-standing-desk-s1',
    productId: 'smart-standing-desk-s1',
    name: 'Smart Standing Desk S1',
    price: 15500000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBReaKbCB0PiDmZxpTzp8bhMnCGYlmmR-lFMCZ91pChFAI2arztTakpNqIm8lXdV5AulqQOF3kuZq8sgEORuZgCGYMrq2cuM3aeo0WJtnB5fdblSMJPb3TxgE7XJO4AtgI2PseRSYfhCwMzccAjZWyFa8IpETCLrTxnG-Msd97VhOUYv2RZQxVAuA2VqRoIRVeeB-Hu5489gLqTVjR7en8GfwVuva-2uvQPU0eq-tmo4nMXEeco6_1OpA',
    options: [
      ['Mặt bàn', 'Walnut top'],
      ['Khung', 'Black frame'],
      ['Kích thước', '120x60cm'],
    ],
  },
  {
    id: 'monitor-light-bar',
    productId: 'monitor-light-bar',
    name: 'Monitor Light Bar',
    price: 1250000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXXyD_PChULakPW8FThaARqy-LPdsNvoT9Z9vc4wtsiIOW6MtIMDsw8fzELEj45U4FM53K3_sW_zqGm_TMTCFDDB55cJRy9iKASC4F_xG2IQnojF2w7sumBOHhMdYGFD34AnY8RdXHZARBihKiOPFbPQ-AlRTGt9hBzrvDHA1Tufr5jgBX7fnhhn2UDSR_-SPmlJN0RrghllnXiE8fYFwQ86tl_622pUkksaCi3JqYVMEFG_gJB80cng',
    options: [['Loại', 'Pro Series']],
  },
]

function getStorage() {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function normalizeCartItem(item) {
  return {
    ...item,
    id: String(item.id || item.productId || item.name),
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: Number(item.price) || 0,
    options: Array.isArray(item.options) ? item.options : [],
  }
}

function normalizeCartItems(items) {
  return Array.isArray(items) ? items.map(normalizeCartItem) : []
}

function emitCartUpdated(items) {
  if (typeof window === 'undefined') return
  const dispatch = () => {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { items } }))
  }

  if (typeof window.queueMicrotask === 'function') {
    window.queueMicrotask(dispatch)
  } else {
    window.setTimeout(dispatch, 0)
  }
}

export function getCartItems() {
  const storage = getStorage()
  if (!storage) return defaultCartItems

  const raw = storage.getItem(CART_STORAGE_KEY)
  if (raw === null) return defaultCartItems

  try {
    return normalizeCartItems(JSON.parse(raw))
  } catch {
    storage.removeItem(CART_STORAGE_KEY)
    return defaultCartItems
  }
}

export function saveCartItems(items) {
  const storage = getStorage()
  const normalizedItems = normalizeCartItems(items)

  if (storage) {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedItems))
  }
  emitCartUpdated(normalizedItems)
  return normalizedItems
}

export function addCartItem(item) {
  const cartItem = normalizeCartItem(item)
  const currentItems = getCartItems()
  const existingIndex = currentItems.findIndex((currentItem) => currentItem.id === cartItem.id)
  const nextItems =
    existingIndex >= 0
      ? currentItems.map((currentItem, index) =>
          index === existingIndex ? { ...currentItem, quantity: currentItem.quantity + cartItem.quantity } : currentItem,
        )
      : [...currentItems, cartItem]

  return saveCartItems(nextItems)
}

export function getCartItemCount(items = getCartItems()) {
  return items.reduce((total, item) => total + (Number(item.quantity) || 0), 0)
}

export function subscribeToCartChanges(listener) {
  if (typeof window === 'undefined') return () => {}

  const handleCartUpdated = (event) => {
    listener(event.detail?.items || getCartItems())
  }
  const handleStorage = (event) => {
    if (event.key === CART_STORAGE_KEY) listener(getCartItems())
  }

  window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated)
    window.removeEventListener('storage', handleStorage)
  }
}

export function clearCart() {
  const storage = getStorage()
  if (storage) {
    storage.removeItem(CART_STORAGE_KEY)
  }
  emitCartUpdated([])
}
