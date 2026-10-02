import './index.css'
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectPage from './pages/ProjectPage'
import ScrollToTop from './components/ScrollToTop'
import { markHydrated } from './lib/hydration'

// Admin is the only client-only route; public pages are prerendered (src/entry-server.tsx)
const AdminPage = lazy(() => import('./pages/AdminPage'))

const fallback = <div className="min-h-screen bg-brutalist-black" />

export function AppRoutes() {
  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  // Runs after every child has committed, i.e. once hydration is done
  useEffect(markHydrated, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
