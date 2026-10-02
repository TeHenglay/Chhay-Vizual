import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Prerendered pages carry the route they were built for. Hydrate only when it
// matches (an unknown URL falls back to the home page's HTML via the SPA rewrite).
const path = location.pathname.replace(/\/+$/, '') || '/'
if (root.hasChildNodes() && root.dataset.route === path) {
  ReactDOM.hydrateRoot(root, app)
} else {
  root.textContent = ''
  ReactDOM.createRoot(root).render(app)
}
