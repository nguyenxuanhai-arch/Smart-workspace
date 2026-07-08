import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CLIENT_ROUTES } from './routes.js'
import ComboSection from './components/home/ComboSection.jsx'
import ReviewsSection from './components/home/ReviewsSection.jsx'
import Workspace3DSection from './components/home/Workspace3DSection.jsx'
import ClientLayout from './components/layout/ClientLayout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import ContactPage from './pages/ContactPage.jsx'
import Login from './pages/Login.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import ProductCatalog from './pages/ProductCatalog.jsx'
import PolicyPage from './pages/PolicyPage.jsx'
import Register from './pages/Register.jsx'
import PayOSReturnPage from './pages/PayOSReturnPage.jsx'
import { ClientAuthProvider, useClientAuth } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

const routePath = (route) => route.replace(/^\//, '')

function SectionPage({ children }) {
  return (
    <ClientLayout>
      <main className="pt-32">
        {children}
      </main>
    </ClientLayout>
  )
}

function RequireClientAuth({ children }) {
  const location = useLocation()
  const { loading, isAuthenticated } = useClientAuth()

  if (loading) {
    return (
      <ClientLayout>
        <main className="mx-auto max-w-[1280px] px-4 pb-section-gap-mobile pt-40 sm:px-6 lg:pb-section-gap lg:pt-44">
          <div className="rounded-lg border border-border-subtle bg-white p-8 font-mono text-sm text-on-surface-variant">
            Đang tải tài khoản...
          </div>
        </main>
      </ClientLayout>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={CLIENT_ROUTES.login} state={{ from: location }} replace />
  }

  return children
}

export default function ClientApp() {
  return (
    <ClientAuthProvider>
      <CartProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route
            path={routePath(CLIENT_ROUTES.products)}
            element={<ProductCatalog />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.productDetail)}
            element={<ProductDetail />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.combos)}
            element={
              <SectionPage>
                <ComboSection />
              </SectionPage>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.workspace3d)}
            element={
              <SectionPage>
                <Workspace3DSection />
              </SectionPage>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.reviews)}
            element={
              <SectionPage>
                <ReviewsSection />
              </SectionPage>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.policies)}
            element={<PolicyPage type="return" />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.returnPolicy)}
            element={<PolicyPage type="return" />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.warrantyPolicy)}
            element={<PolicyPage type="warranty" />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.paymentPolicy)}
            element={<PolicyPage type="payment" />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.shippingPolicy)}
            element={<PolicyPage type="shipping" />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.contact)}
            element={<ContactPage />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.cart)}
            element={<Cart />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.checkout)}
            element={
              <RequireClientAuth>
                <Checkout />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.account)}
            element={<Navigate to={CLIENT_ROUTES.accountOrders} replace />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.accountProfile)}
            element={
              <RequireClientAuth>
                <AccountPage section="profile" />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.accountOrders)}
            element={
              <RequireClientAuth>
                <AccountPage section="orders" />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.accountOrderDetail)}
            element={
              <RequireClientAuth>
                <AccountPage section="orderDetail" />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.accountPayments)}
            element={
              <RequireClientAuth>
                <AccountPage section="payments" />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.accountSettings)}
            element={
              <RequireClientAuth>
                <AccountPage section="settings" />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.login)}
            element={<Login />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.register)}
            element={<Register />}
          />
          <Route
            path={routePath(CLIENT_ROUTES.payosReturn)}
            element={
              <RequireClientAuth>
                <PayOSReturnPage />
              </RequireClientAuth>
            }
          />
          <Route
            path={routePath(CLIENT_ROUTES.payosCancel)}
            element={
              <RequireClientAuth>
                <PayOSReturnPage />
              </RequireClientAuth>
            }
          />
          <Route path="*" element={<Navigate to={CLIENT_ROUTES.home} replace />} />
        </Routes>
      </CartProvider>
    </ClientAuthProvider>
  )
}
