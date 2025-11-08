export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Luqma
        </h1>
        <p className="text-xl text-gray-600">
          Recipe Search with Nutritional Information
        </p>
      </header>

      <main className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 mb-4">
            This is a minimal scaffold for the Luqma frontend. The project structure is ready for you to build upon.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Next Steps:</strong> Implement recipe search, detail views, and ingredient exclusion features.
            </p>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2" aria-hidden="true">✓</span>
              <span>React 19.2.0 with hooks</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2" aria-hidden="true">✓</span>
              <span>Vite 7.2.2 for fast development</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2" aria-hidden="true">✓</span>
              <span>TailwindCSS 4.1.17 for styling</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2" aria-hidden="true">✓</span>
              <span>React Router 7.9.5 for navigation</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2" aria-hidden="true">✓</span>
              <span>Folder structure ready for Context API</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}