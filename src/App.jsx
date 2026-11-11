import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppData } from './state/AppDataContext.jsx';
import AdminLayout from './components/AdminLayout.jsx';

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'));
const HoursPage = lazy(() => import('./pages/HoursPage.jsx'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage.jsx'));
const FinancePage = lazy(() => import('./pages/FinancePage.jsx'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage.jsx'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage.jsx'));
const StaffPage = lazy(() => import('./pages/StaffPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));

function Protected({ children }) {
  const { user } = useAppData();
  return user ? children : <Navigate to="/kirish" replace />;
}

export default function App() {
  return <Suspense fallback={<div className="route-loading"><span />Sahifa yuklanmoqda...</div>}><Routes>
    <Route path="/kirish" element={<LoginPage />} />
    <Route path="/" element={<Protected><AdminLayout /></Protected>}>
      <Route index element={<Navigate to="/buyurtmalar" replace />} />
      <Route path="buyurtmalar" element={<OrdersPage />} />
      <Route path="menyu" element={<MenuPage />} />
      <Route path="ish-vaqti" element={<HoursPage />} />
      <Route path="aksiyalar" element={<PromotionsPage />} />
      <Route path="moliya" element={<FinancePage />} />
      <Route path="analitika" element={<AnalyticsPage />} />
      <Route path="sharhlar" element={<ReviewsPage />} />
      <Route path="xodimlar" element={<StaffPage />} />
      <Route path="sozlamalar" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Suspense>;
}
