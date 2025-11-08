import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage').then(module => ({ default: module.SearchResultsPage })))
const RecipesPage = lazy(() => import('./pages/RecipesPage').then(module => ({ default: module.RecipesPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })))

/**
 * Loading fallback component displayed while lazy-loaded routes are loading.
 * Shows a centered spinner with "Loading..." text for user feedback.
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
      <p className="text-base text-gray-600">Loading...</p>
    </div>
  </div>
)

export const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  )
}