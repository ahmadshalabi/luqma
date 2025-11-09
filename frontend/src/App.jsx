import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/features/layout/Header'
import { Footer } from '@/features/layout/Footer'
import { LoadingSpinner } from '@/primitives/LoadingSpinner'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })))
const RecipePage = lazy(() => import('./pages/RecipePage').then(module => ({ default: module.RecipePage })))

export const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
        </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  )
}