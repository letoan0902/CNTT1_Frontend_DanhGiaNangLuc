import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';

// Bố cục chung: header ở trên, nội dung từng trang nằm trong main.
// ToastProvider bọc ngoài các trang để thông báo vẫn hiện sau khi chuyển trang.
export default function App() {
  return (
    <ToastProvider>
      <header className="app-header">
        <span className="app-title">OfficeMart Admin</span>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
        </Routes>
      </main>
    </ToastProvider>
  );
}
