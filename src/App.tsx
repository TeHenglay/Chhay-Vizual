import './index.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWorks from './components/SelectedWorks'
import About from './components/About'
import SkillsMarquee from './components/SkillsMarquee'
import Skills from './components/Skills'
import Contact from './components/Contact'
const AdminPage = lazy(() => import('./pages/AdminPage'))

const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
import ScrollToTop from './components/ScrollToTop'

function Home() {
  return (
    <div className="font-sans antialiased select-none overflow-y-auto bg-brutalist-black text-brutalist-grey">
      <Header />
      <Navbar />
      <Hero />
      <SelectedWorks />
      <About />
      <SkillsMarquee />
      <Skills />
      <Contact />
    </div>
  )
}

function App() {
  return (
    <>
    <LoadingScreen />
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={
            <Suspense fallback={<div className="min-h-screen bg-brutalist-black" />}>
              <ProjectsPage />
            </Suspense>
          } />
        <Route path="/admin/*" element={
            <Suspense fallback={<div className="min-h-screen bg-brutalist-black" />}>
              <AdminPage />
            </Suspense>
          } />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
