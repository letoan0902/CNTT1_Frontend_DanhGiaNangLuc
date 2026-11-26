import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ProductTable from '../components/ProductTable.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useCategories from '../hooks/useCategories.js';

const PAGE_SIZE = 10; // số sản phẩm mỗi trang

// Trang /products: danh sách sản phẩm lấy từ API, có xoá sản phẩm.
export default function ProductListPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categoryNames, loading: categoriesLoading } = useCategories();

  // ----- Tải danh sách -----
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0); // tăng lên 1 để tải lại danh sách

  useEffect(() => {
    // ignore = true khi effect đã bị dọn dẹp: bỏ qua kết quả trả về muộn.
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/products', { params: { page: 1, limit: PAGE_SIZE } });
        if (!ignore) setProducts(res.data.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message ?? 'Không tải được danh sách sản phẩm');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  function reloadProducts() {
    setReloadCount((count) => count + 1);
  }

  // ----- Xoá sản phẩm -----
  const [productToDelete, setProductToDelete] = useState(null); // sản phẩm đang chờ xác nhận xoá
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function openDeleteDialog(product) {
    setProductToDelete(product);
    setDeleteError('');
  }

  function closeDeleteDialog() {
    setProductToDelete(null);
  }

  async function confirmDelete() {
    if (deleting) return; // đang xoá thì bỏ qua, tránh gửi hai request
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setProductToDelete(null);
      showToast('Đã xoá sản phẩm');
      // Tải lại để sản phẩm biến mất và trang 1 vẫn đủ 10 sản phẩm.
      reloadProducts();
    } catch (err) {
      setDeleteError(err.response?.data?.message ?? 'Xoá sản phẩm thất bại, vui lòng thử lại');
    } finally {
      setDeleting(false);
    }
  }

  // ----- Hiển thị -----
  function renderContent() {
    if (loading || categoriesLoading) {
      return (
        <p className="state-box" data-testid="loading">
          Đang tải...
        </p>
      );
    }

    if (error) {
      return (
        <div className="state-box">
          <p className="state-error" data-testid="error-message">
            {error}
          </p>
          <button type="button" className="btn" data-testid="retry-button" onClick={reloadProducts}>
            Thử lại
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <p className="state-box" data-testid="empty-state">
          Chưa có sản phẩm nào
        </p>
      );
    }

    return (
      <ProductTable
        products={products}
        categoryNames={categoryNames}
        onEdit={(product) => navigate(`/products/${product.id}/edit`)}
        onDelete={openDeleteDialog}
      />
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <button type="button" className="btn btn-primary" data-testid="add-button" onClick={() => navigate('/products/new')}>
          Thêm sản phẩm
        </button>
      </div>

      {renderContent()}

      {productToDelete && (
        <ConfirmDialog
          message={`Bạn có chắc muốn xoá sản phẩm "${productToDelete.name}"?`}
          error={deleteError}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={closeDeleteDialog}
        />
      )}
    </>
  );
}
