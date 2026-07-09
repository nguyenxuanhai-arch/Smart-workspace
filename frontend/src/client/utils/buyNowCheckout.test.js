import { beforeEach, describe, expect, it } from 'vitest'
import {
  BUY_NOW_CHECKOUT_STORAGE_KEY,
  clearBuyNowDraft,
  getBuyNowDraft,
  saveBuyNowDraft,
} from './buyNowCheckout.js'

describe('buy now checkout storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores, reads, and clears the buy-now draft', () => {
    const draft = {
      productId: 1,
      name: 'Smart Desk',
      price: 1500000,
      quantity: 2,
    }

    saveBuyNowDraft(draft)

    expect(getBuyNowDraft()).toEqual(draft)

    clearBuyNowDraft()

    expect(getBuyNowDraft()).toBeNull()
  })

  it('drops invalid stored JSON', () => {
    sessionStorage.setItem(BUY_NOW_CHECKOUT_STORAGE_KEY, '{bad-json')

    expect(getBuyNowDraft()).toBeNull()
    expect(sessionStorage.getItem(BUY_NOW_CHECKOUT_STORAGE_KEY)).toBeNull()
  })
})
