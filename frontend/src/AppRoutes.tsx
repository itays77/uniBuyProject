import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/layout';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage';
import CartPage from './pages/CartPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentSimulationPage from './pages/PaymentSimulationPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './auth/ProtectedRoute';
import MyOrdersPage from './pages/MyOrdersPage';





const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route
        path="/"
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />

      {/* All protected routes that require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/items"
          element={
            <Layout>
              <ItemsPage />
            </Layout>
          }
        />

        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />

        <Route
          path="/my-orders"
          element={
            <Layout>
              <MyOrdersPage />
            </Layout>
          }
        />

        <Route
          path="/payment-simulation"
          element={
            <Layout>
              <PaymentSimulationPage />
            </Layout>
          }
        />

        <Route
          path="/order-confirmation/:orderId"
          element={
            <Layout>
              <OrderConfirmationPage />
            </Layout>
          }
        />

        {/* Admin-specific route */}
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;