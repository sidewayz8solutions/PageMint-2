import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testSupabaseConnection, checkDatabaseTables, checkProducts } from '../../utils/testSupabaseConnection'

// Mock the supabase client
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('Supabase Connection Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('testSupabaseConnection', () => {
    it('should return success when connection works', async () => {
      const { supabase } = await import('../../lib/supabase.js')
      
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [{ count: 1 }],
            error: null
          })
        })
      })

      const result = await testSupabaseConnection()
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Connected successfully')
      expect(supabase.from).toHaveBeenCalledWith('products')
    })

    it('should return error when connection fails', async () => {
      const { supabase } = await import('../../lib/supabase.js')
      
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' }
          })
        })
      })

      const result = await testSupabaseConnection()
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Connection failed')
    })
  })

  describe('checkDatabaseTables', () => {
    it('should check all required tables', async () => {
      const { supabase } = await import('../../lib/supabase.js')
      
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [{ count: 1 }],
            error: null
          })
        })
      })

      const result = await checkDatabaseTables()
      
      expect(result).toHaveProperty('customers', 'Exists')
      expect(result).toHaveProperty('products', 'Exists')
      expect(result).toHaveProperty('orders', 'Exists')
      expect(result).toHaveProperty('order_items', 'Exists')
      expect(result).toHaveProperty('digital_deliveries', 'Exists')
    })
  })

  describe('checkProducts', () => {
    it('should return active products', async () => {
      const { supabase } = await import('../../lib/supabase.js')
      
      const mockProducts = [
        { id: 1, name: 'Starter Pack', price: 29, is_active: true },
        { id: 2, name: 'Pro Pack', price: 59, is_active: true }
      ]
      
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null
          })
        })
      })

      const result = await checkProducts()
      
      expect(result.success).toBe(true)
      expect(result.products).toEqual(mockProducts)
      expect(supabase.from).toHaveBeenCalledWith('products')
    })
  })
})
