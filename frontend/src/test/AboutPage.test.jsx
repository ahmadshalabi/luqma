import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AboutPage } from '@/pages/about/AboutPage'

describe('AboutPage', () => {
  it('should render main content', () => {
    render(<AboutPage />)
    
    expect(screen.getByRole('heading', { name: 'About Luqma' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument()
  })
})
