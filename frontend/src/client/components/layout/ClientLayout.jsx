import Footer from './Footer.jsx'
import Header from './Header.jsx'

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
