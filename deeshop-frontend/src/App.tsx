import { Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import PaymentPage from './pages/PaymentPage'
import StatusPage from './pages/StatusPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:gameId" element={<ProductDetail />} />
          <Route path="/checkout/:gameId/:packageId" element={<PaymentPage />} />
          <Route path="/status/:orderId" element={<StatusPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
