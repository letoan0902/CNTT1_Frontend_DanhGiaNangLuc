import { Navigate, Route, Routes } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage.jsx';

// Bố cục chung: header ở trên, nội dung từng trang nằm trong main.
export default function App() {
  return (
    <>
      <header className="app-header">
        <span className="app-title">OfficeMart Admin</span>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
        </Routes>
      </main>
    </>
  );
}
