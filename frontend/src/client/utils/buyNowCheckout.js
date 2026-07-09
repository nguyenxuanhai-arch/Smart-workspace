export const BUY_NOW_CHECKOUT_STORAGE_KEY = 'sw_buy_now_checkout'

export function saveBuyNowDraft(draft) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(BUY_NOW_CHECKOUT_STORAGE_KEY, JSON.stringify(draft))
}

export function getBuyNowDraft() {
  if (typeof window === 'undefined') return null
  const raw = window.sessionStorage.getItem(BUY_NOW_CHECKOUT_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    window.sessionStorage.removeItem(BUY_NOW_CHECKOUT_STORAGE_KEY)
    return null
  }
}

export function clearBuyNowDraft() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(BUY_NOW_CHECKOUT_STORAGE_KEY)
}
