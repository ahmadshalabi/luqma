import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const AboutPage = lazy(() => import('@/pages/about/AboutPage').then(module => ({ default: module.AboutPage })))
const RecipePage = lazy(() => import('@/pages/recipe/RecipePage').then(module => ({ default: module.RecipePage })))

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main id="main-content" className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
