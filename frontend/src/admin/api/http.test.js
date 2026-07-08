import { beforeEach, describe, expect, it } from 'vitest'
import { tokenStorage } from './http.js'

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and clears admin user info (tokens are in HTTP-only cookies)', () => {
    const user = { email: 'admin@smartworkspace.local', roles: ['ADMIN'] }

    tokenStorage.setSession({ user })

    expect(tokenStorage.getUser()).toEqual(user)

    tokenStorage.clear()

    expect(tokenStorage.getUser()).toBeNull()
  })
})
