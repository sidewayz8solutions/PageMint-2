import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroSection from '../../components/HeroSection'

// Mock PaymentButton component
vi.mock('../../components/PaymentButton', () => ({
  default: ({ productId, className, children }) => (
    <button data-testid={`payment-button-${productId}`} className={className}>
      {children}
    </button>
  )
}))

describe('HeroSection Component', () => {
  it('renders without crashing', () => {
    render(<HeroSection />)
    expect(screen.getByText('PageMint')).toBeInTheDocument()
  })

  it('displays the main heading correctly', () => {
    render(<HeroSection />)

    // Use getAllByText to handle multiple elements with the same text
    const headingElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('Launch Your SaaS') || false
    })
    expect(headingElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/in Hours/)).toBeInTheDocument()
    // "Not Weeks" text spans multiple elements, use getAllByText
    const notWeeksElements = screen.getAllByText((content, element) => {
      return element?.textContent?.includes('Not Weeks') || false
    })
    expect(notWeeksElements.length).toBeGreaterThan(0)
  })

  it('shows the ready-to-deploy badge', () => {
    render(<HeroSection />)
    
    expect(screen.getByText('Ready-to-Deploy Templates')).toBeInTheDocument()
  })

  it('displays the description text', () => {
    render(<HeroSection />)
    
    const description = screen.getByText(/Professional SaaS landing page templates/)
    expect(description).toBeInTheDocument()
    expect(description).toHaveTextContent('Mobile-first design with premium aesthetics')
  })

  it('renders payment buttons', () => {
    render(<HeroSection />)

    // Check for PRO_PACK payment button
    expect(screen.getByTestId('payment-button-PRO_PACK')).toBeInTheDocument()

    // The HeroSection only has one payment button for PRO_PACK
    // STARTER_PACK button is in the pricing section
  })

  it('has proper styling classes', () => {
    render(<HeroSection />)
    
    const section = document.querySelector('section')
    expect(section).toHaveClass('relative', 'overflow-hidden')
    expect(section).toHaveClass('bg-gradient-to-br')
  })

  it('includes icons', () => {
    render(<HeroSection />)
    
    // The Leaf icon should be present (PageMint logo)
    const leafIcon = document.querySelector('svg')
    expect(leafIcon).toBeInTheDocument()
  })

  it('has responsive design classes', () => {
    render(<HeroSection />)
    
    const container = document.querySelector('.mx-auto.max-w-7xl')
    expect(container).toBeInTheDocument()
    
    const textCenter = document.querySelector('.text-center')
    expect(textCenter).toBeInTheDocument()
  })

  it('displays call-to-action text', () => {
    render(<HeroSection />)

    expect(screen.getByText(/Get Pro Pack/)).toBeInTheDocument()
    expect(screen.getByText('View Live Demos')).toBeInTheDocument()
  })
})
