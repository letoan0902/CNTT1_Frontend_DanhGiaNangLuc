import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductTable from '../components/ProductTable.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useCategories from '../hooks/useCategories.js';
import useProductSearch, { PAGE_SIZE } from '../hooks/useProductSearch.js';

const STATUS_VALUES = ['active', 'inactive']; // các trạng thái hợp lệ trên URL

// Đọc số trang từ URL. Giá trị không hợp lệ (page=-3, page=abc, page=1.5) thì coi là trang 1.
function parsePage(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

// Trang /products: danh sách sản phẩm có tìm kiếm, lọc, phân trang và xoá sản phẩm.
export default function ProductListPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categories, categoryNames, loading: categoriesLoading } = useCategories();

  // ----- Tham số tìm kiếm: URL là nơi duy nhất lưu từ khoá, bộ lọc và trang -----
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();
  const page = parsePage(searchParams.get('page'));

  // Trạng thái lạ (ví dụ status=abc) thì coi như "Tất cả".
  const rawStatus = searchParams.get('status') ?? '';
  const status = STATUS_VALUES.includes(rawStatus) ? rawStatus : '';

  // Danh mục lạ (không có trong danh sách lấy từ API) cũng coi như "Tất cả".
  // Chỉ kiểm tra được sau khi đã tải xong danh mục.
  const rawCategory = searchParams.get('category') ?? '';
  const category = categories.length > 0 && !categoryNames[rawCategory] ? '' : rawCategory;

  // Ghi tham số mới lên URL, ví dụ updateParams({ status: 'active', page: 1 }).
  // Tham số rỗng và page=1 không ghi để URL gọn. Mặc định thêm một mục lịch sử để bấm Back quay lại được.
  function updateParams(changes, options) {
    const next = { q, category, status, page, ...changes };
    const params = {};
    if (next.q) params.q = next.q;
    if (next.category) params.category = next.category;
    if (next.status) params.status = next.status;
    if (next.page > 1) params.page = String(next.page);
    setSearchParams(params, options);
  }

  // ----- Tải danh sách theo tham số trên URL -----
  const { data: products, total, loading, error, reload } = useProductSearch({ q, category, status, page });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Trang trên URL lớn hơn trang cuối (ví dụ page=999, hoặc vừa xoá sản phẩm duy nhất của trang cuối).
  const pageTooLarge = !loading && !error && page > totalPages;

  // Mỗi khi có kết quả mới (products đổi): nếu trang trên URL lớn hơn trang cuối thì chuyển về trang cuối.
  // Chỉ phụ thuộc products để việc kiểm tra dùng total của đúng lần tải vừa xong.
  // replace: true để thay mục lịch sử hiện tại, bấm Back không quay lại trang không tồn tại.
  useEffect(() => {
    if (pageTooLarge) updateParams({ page: totalPages }, { replace: true });
  }, [products]);

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
      // Tải lại trang hiện tại để sản phẩm biến mất và trang vẫn đủ 10 sản phẩm.
      reload();
    } catch (err) {
      setDeleteError(err.response?.data?.message ?? 'Xoá sản phẩm thất bại, vui lòng thử lại');
    } finally {
      setDeleting(false);
    }
  }

  // ----- Hiển thị -----
  function renderContent() {
    if (loading || categoriesLoading || pageTooLarge) {
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
          <button type="button" className="btn" data-testid="retry-button" onClick={reload}>
            Thử lại
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      const hasFilter = q !== '' || category !== '' || status !== '';
      return (
        <p className="state-box" data-testid="empty-state">
          {hasFilter ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
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

      {/* Bộ lọc luôn hiển thị (kể cả lúc đang tải) để ô tìm kiếm không mất con trỏ khi đang gõ. */}
      <ProductFilters q={q} category={category} status={status} categories={categories} onChange={updateParams} />

      {renderContent()}

      {/* Chưa tải xong lần nào (total = null) thì chưa biết tổng số trang nên chưa hiện phân trang. */}
      {total !== null && (
        <Pagination page={page} totalPages={totalPages} onPageChange={(newPage) => updateParams({ page: newPage })} />
      )}

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
