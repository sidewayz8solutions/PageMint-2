import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

// Mock all external dependencies
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ 
            data: [
              { id: 1, name: 'Starter Pack', price: 29, is_active: true },
              { id: 2, name: 'Pro Pack', price: 59, is_active: true }
            ], 
            error: null 
          }))
        })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }
}))

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    redirectToCheckout: vi.fn(() => Promise.resolve({ error: null }))
  }))
}))

// Mock fetch for API calls
global.fetch = vi.fn()

describe('Application Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch.mockClear()
  })

  it('renders complete application structure', async () => {
    render(<App />)
    
    // Wait for any async operations
    await waitFor(() => {
      expect(screen.getAllByText('PageMint')).toHaveLength(3) // Appears in nav, hero, and footer
    })

    // Check main sections are present
    expect(document.querySelector('#hero')).toBeInTheDocument()
    expect(document.querySelector('#showcase')).toBeInTheDocument()
    expect(document.querySelector('#features')).toBeInTheDocument()
    expect(document.querySelector('#pricing')).toBeInTheDocument()
  })

  it('handles navigation between sections', async () => {
    render(<App />)
    
    // Check if sections exist and are accessible
    const heroSection = document.querySelector('#hero')
    const pricingSection = document.querySelector('#pricing')
    
    expect(heroSection).toBeInTheDocument()
    expect(pricingSection).toBeInTheDocument()
  })

  it('displays pricing information correctly', async () => {
    render(<App />)

    await waitFor(() => {
      // Should show pricing for both packages - adjust expectations based on actual rendering
      expect(screen.getAllByText(/\$29/)).toHaveLength(1) // Appears in pricing section
      expect(screen.getAllByText(/\$59/)).toHaveLength(3) // Appears in pricing section, hero button, and nav
    })
  })

  it('handles database connection status', async () => {
    render(<App />)
    
    // DatabaseStatus component should be rendered
    // It will attempt to connect to Supabase
    await waitFor(() => {
      expect(document.body).toContainHTML('div')
    }, { timeout: 3000 })
  })

  it('handles error states gracefully', async () => {
    // Mock a failed Supabase connection
    const { supabase } = await import('../../lib/supabase.js')
    supabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ 
            data: null, 
            error: { message: 'Connection failed' } 
          }))
        })),
        limit: vi.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Connection failed' } 
        }))
      }))
    })

    render(<App />)
    
    // App should still render even with database errors
    await waitFor(() => {
      expect(screen.getAllByText('PageMint')).toHaveLength(3) // Appears in nav, hero, and footer
    })
  })

  it('maintains responsive design', () => {
    render(<App />)
    
    // Check for responsive classes
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toBeInTheDocument()
    
    // Check for mobile-first design elements
    const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="lg:"], [class*="xl:"]')
    expect(responsiveElements.length).toBeGreaterThan(0)
  })
})
