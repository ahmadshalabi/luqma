import { Link } from 'react-router-dom'

export const RecipesPage = () => {
  return (
    <main id="main-content" className="flex-grow">
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
          <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Coming Soon
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
            We&rsquo;re working hard to bring you an amazing recipe browsing experience. 
            Check back soon to explore our full collection of recipes!
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

