/**
 * HeroSection Component
 * 
 * Hero section with title, description, and optional content (like SearchBar).
 * 
 * @param {Object} props
 * @param {string} props.title - Hero title
 * @param {string} props.description - Hero description
 * @param {React.ReactNode} props.children - Optional additional content (e.g., SearchBar)
 * @param {string} props.className - Additional CSS classes
 */
export function HeroSection({ title, description, children, className = '' }) {
  return (
    <section className={`container mx-auto px-4 py-12 md:py-16 ${className}`}>
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

