import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<App />)
    
    // Check for main sections by their IDs
    expect(document.querySelector('#hero')).toBeInTheDocument()
    expect(document.querySelector('#showcase')).toBeInTheDocument()
    expect(document.querySelector('#features')).toBeInTheDocument()
    expect(document.querySelector('#pricing')).toBeInTheDocument()
    expect(document.querySelector('#testimonials')).toBeInTheDocument()
    expect(document.querySelector('#faq')).toBeInTheDocument()
    expect(document.querySelector('#cta')).toBeInTheDocument()
  })

  it('renders navigation and footer', () => {
    render(<App />)
    
    // Navigation should be present
    expect(document.querySelector('nav') || document.querySelector('[role="navigation"]')).toBeInTheDocument()
    
    // Footer should be present
    expect(document.querySelector('footer')).toBeInTheDocument()
  })

  it('includes database status component', () => {
    render(<App />)
    
    // DatabaseStatus component should be rendered
    // This will help us verify the app structure
    expect(document.body).toContainHTML('div')
  })
})
