import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PRODUCTS, createCheckoutSession } from '../../services/stripe'

// Mock fetch
global.fetch = vi.fn()

// Mock loadStripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    redirectToCheckout: vi.fn(() => Promise.resolve({ error: null }))
  }))
}))

describe('Stripe Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch.mockClear()
  })

  describe('PRODUCTS configuration', () => {
    it('should have correct product structure', () => {
      expect(PRODUCTS).toHaveProperty('STARTER_PACK')
      expect(PRODUCTS).toHaveProperty('PRO_PACK')
      
      // Check starter pack structure
      expect(PRODUCTS.STARTER_PACK).toHaveProperty('id', 'starter-pack')
      expect(PRODUCTS.STARTER_PACK).toHaveProperty('name', 'Starter Pack')
      expect(PRODUCTS.STARTER_PACK).toHaveProperty('price', 29)
      expect(PRODUCTS.STARTER_PACK.features).toBeInstanceOf(Array)
      
      // Check pro pack structure
      expect(PRODUCTS.PRO_PACK).toHaveProperty('id', 'pro-pack')
      expect(PRODUCTS.PRO_PACK).toHaveProperty('name', 'Pro Pack')
      expect(PRODUCTS.PRO_PACK).toHaveProperty('price', 59)
      expect(PRODUCTS.PRO_PACK.features).toBeInstanceOf(Array)
    })

    it('should have required features for each product', () => {
      expect(PRODUCTS.STARTER_PACK.features.length).toBeGreaterThan(0)
      expect(PRODUCTS.PRO_PACK.features.length).toBeGreaterThan(0)
      
      // Pro pack should have more features than starter
      expect(PRODUCTS.PRO_PACK.features.length).toBeGreaterThanOrEqual(
        PRODUCTS.STARTER_PACK.features.length
      )
    })
  })

  describe('createCheckoutSession', () => {
    it('should create checkout session for valid product', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          sessionId: 'cs_test_123',
          url: 'https://checkout.stripe.com/pay/cs_test_123'
        })
      }
      
      global.fetch.mockResolvedValue(mockResponse)

      const result = await createCheckoutSession('STARTER_PACK', 'test@example.com')
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/functions/v1/create-checkout'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('price_REPLACE_WITH_YOUR_STARTER_PACK_PRICE_ID')
        })
      )
      
      expect(result).toHaveProperty('id', 'cs_test_123')
    })

    it('should throw error for invalid product ID', async () => {
      await expect(createCheckoutSession('INVALID_PRODUCT')).rejects.toThrow('Invalid product ID')
    })

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'Bad request'
        })
      }
      
      global.fetch.mockResolvedValue(mockResponse)

      await expect(createCheckoutSession('STARTER_PACK')).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))

      await expect(createCheckoutSession('STARTER_PACK')).rejects.toThrow('Network error')
    })
  })
})
