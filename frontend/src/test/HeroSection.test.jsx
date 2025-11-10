import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/layout/HeroSection'

describe('HeroSection', () => {
  it('renders title and description', () => {
    render(
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes"
      />
    )
    
    expect(screen.getByRole('heading', { name: 'Welcome to Luqma' })).toBeInTheDocument()
    expect(screen.getByText('Discover delicious recipes')).toBeInTheDocument()
  })

  it('renders children when provided', () => {
    render(
      <HeroSection
        title="Welcome"
        description="Description"
      >
        <div data-testid="child-content">Search Bar</div>
      </HeroSection>
    )
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  it('does not render children container when children not provided', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    // Check that no extra div is rendered for children
    const childContainer = container.querySelector('.mt-8')
    expect(childContainer).not.toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes"
      />
    )
    
    // Check for section with aria-label
    const section = screen.getByRole('region', { name: 'Hero section' })
    expect(section).toBeInTheDocument()
    
    // Check heading hierarchy (h1)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Welcome to Luqma')
  })

  it('has decorative image with empty alt text for accessibility', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    // Background image should have empty alt
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('alt', '')
  })

  it('has responsive image srcset', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('srcset')
    expect(image?.getAttribute('srcset')).toContain('640w')
    expect(image?.getAttribute('srcset')).toContain('1024w')
    expect(image?.getAttribute('srcset')).toContain('1920w')
    expect(image?.getAttribute('srcset')).toContain('2070w')
  })

  it('has aria-hidden on decorative elements', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    // Background container should be hidden from screen readers
    const backgroundDiv = container.querySelector('.absolute.inset-0.z-0')
    expect(backgroundDiv).toHaveAttribute('aria-hidden', 'true')
    
    // Wave SVG container should be hidden from screen readers
    const waveContainer = container.querySelector('.absolute.bottom-0')
    expect(waveContainer).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
        className="custom-class"
      />
    )
    
    const section = container.querySelector('section')
    expect(section).toHaveClass('custom-class')
  })

  it('has proper loading priority for above-fold image', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    const image = container.querySelector('img')
    expect(image).toHaveAttribute('loading', 'eager')
  })

  it('has proper text contrast classes for accessibility', () => {
    render(
      <HeroSection
        title="Welcome to Luqma"
        description="Discover delicious recipes"
      />
    )
    
    // Title should be white with drop shadow for contrast
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-white')
    expect(heading).toHaveClass('drop-shadow-lg')
    
    // Description should also be white with drop shadow
    const description = screen.getByText('Discover delicious recipes')
    expect(description).toHaveClass('text-white')
    expect(description).toHaveClass('drop-shadow-md')
  })

  it('has mobile-first responsive classes', () => {
    const { container } = render(
      <HeroSection
        title="Welcome"
        description="Description"
      />
    )
    
    const section = container.querySelector('section')
    expect(section?.className).toMatch(/min-h-\[500px\]/)
    expect(section?.className).toMatch(/md:min-h-\[600px\]/)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.className).toMatch(/text-3xl/)
    expect(heading.className).toMatch(/sm:text-4xl/)
    expect(heading.className).toMatch(/md:text-5xl/)
    expect(heading.className).toMatch(/lg:text-6xl/)
  })
})

