import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AdminApp from './admin/App.jsx'
import ClientApp from './client/App.jsx'
import { LEGACY_ADMIN_REDIRECTS } from './admin/routes.js'
import { CLIENT_ROUTES } from './client/routes.js'

function RedirectWithSearch({ to }) {
  const { search } = useLocation()
  return <Navigate to={`${to}${search}`} replace />
}

export default function App() {
  const clientRoutes = new Set(Object.values(CLIENT_ROUTES))
  const legacyRedirects = LEGACY_ADMIN_REDIRECTS.filter(({ from }) => from !== '/' && !clientRoutes.has(from))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        {legacyRedirects.map(({ from, to }) => (
          <Route key={from} path={from} element={<RedirectWithSearch to={to} />} />
        ))}
        <Route path="/*" element={<ClientApp />} />
      </Routes>
    </BrowserRouter>
  )
}
