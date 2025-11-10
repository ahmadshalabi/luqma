/**
 * HeroSection Component
 * 
 * WCAG 2.1 AA compliant hero section with background image, title, description, 
 * and optional content. Implements mobile-first responsive design.
 * 
 * Accessibility features:
 * - Empty alt for decorative background image
 * - High contrast text (white on dark overlay, exceeds 4.5:1 ratio)
 * - Semantic HTML with proper heading hierarchy
 * - Responsive images with srcset
 * - Touch-friendly spacing on mobile
 * 
 * @param {Object} props
 * @param {string} props.title - Hero title (h1)
 * @param {string} props.description - Hero description
 * @param {React.ReactNode} props.children - Optional additional content (e.g., SearchBar)
 * @param {string} props.className - Additional CSS classes
 */
export function HeroSection({ title, description, children, className = '' }) {
  return (
    <section 
      className={`relative overflow-hidden min-h-[500px] md:min-h-[600px] ${className}`}
      aria-label="Hero section"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
          srcSet="
            https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=640&auto=format&fit=crop 640w,
            https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1024&auto=format&fit=crop 1024w,
            https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop 1920w,
            https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop 2070w
          "
          sizes="100vw"
          alt=""
          loading="eager"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for WCAG AA contrast (ensures 4.5:1+ ratio for text) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/75"></div>
      </div>

      {/* Content - Mobile-first spacing */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
          {/* Heading - Mobile-first font sizing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h1>
          
          {/* Description - Mobile-first font sizing with optimal line height */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-relaxed drop-shadow-md max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Children container - Touch-friendly spacing */}
          {children && (
            <div className="mt-8 md:mt-10">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Decorative bottom wave - aria-hidden for screen readers */}
      <div className="absolute bottom-0 left-0 right-0 z-10" aria-hidden="true">
        <svg 
          className="w-full h-8 sm:h-10 md:h-12 lg:h-16 text-white" 
          viewBox="0 0 1440 120" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  )
}

