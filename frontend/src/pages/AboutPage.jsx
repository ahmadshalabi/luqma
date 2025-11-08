export const AboutPage = () => {
  return (
    <main id="main-content" className="flex-grow">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            About Luqma
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Your companion for discovering delicious recipes with detailed nutritional information
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission */}
          <article className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Luqma helps you discover and explore recipes while making informed decisions about your nutrition. 
              We believe that cooking should be enjoyable and accessible to everyone, with the ability to customize 
              recipes based on dietary preferences and restrictions.
            </p>
          </article>

          {/* Features */}
          <article className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Recipe Search
                  </h3>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  Search through thousands of recipes by dish names to find exactly what you&rsquo;re craving.
                </p>
              </div>

              <div className="flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Nutritional Info
                  </h3>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  View detailed nutritional information including calories for every recipe.
                </p>
              </div>

              <div className="flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Ingredient Exclusion
                  </h3>
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  Exclude ingredients you don&rsquo;t like or can&rsquo;t eat, and see updated nutritional information in real-time.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

