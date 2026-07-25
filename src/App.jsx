import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import EquipmentPage from './pages/EquipmentPage'
import PortfolioPage from './pages/PortfolioPage'
import AboutPage from './pages/AboutPage'
import ContactsPage from './pages/ContactsPage'
import FaqPage from './pages/FaqPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ScrollToTop from './components/ScrollToTop'
import MaintenanceBanner from './components/MaintenanceBanner'
import PageTransition from './components/PageTransition'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <MaintenanceBanner />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </>
  )
}
