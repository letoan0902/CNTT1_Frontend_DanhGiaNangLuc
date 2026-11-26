import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import ProductForm from '../components/ProductForm.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useCategories from '../hooks/useCategories.js';

// Giá trị ban đầu của form thêm mới. Tồn kho để sẵn 0, trạng thái mặc định là đang bán.
const EMPTY_FORM = { name: '', sku: '', category: '', price: '', stock: '0', status: 'active' };

// Trang /products/new (thêm) và /products/:id/edit (sửa). Có id trên URL là đang sửa.
export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const [product, setProduct] = useState(null); // sản phẩm đang sửa
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState('');

  // Khi sửa: tải sản phẩm theo id để điền sẵn vào form.
  useEffect(() => {
    if (!isEdit) return;
    // ignore = true khi effect đã bị dọn dẹp: bỏ qua kết quả trả về muộn.
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setLoadError('');
      try {
        const res = await api.get(`/products/${id}`);
        if (!ignore) setProduct(res.data);
      } catch (err) {
        if (ignore) return;
        if (err.response?.status === 404) {
          setLoadError('Không tìm thấy sản phẩm');
        } else {
          setLoadError(err.response?.data?.message ?? 'Không tải được sản phẩm, vui lòng thử lại');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      ignore = true;
    };
  }, [id, isEdit]);

  // Được ProductForm gọi khi dữ liệu đã hợp lệ. API lỗi thì lỗi được ném ra cho form hiển thị.
  async function handleSubmit(values) {
    if (isEdit) {
      // PUT cập nhật toàn bộ: gửi cả sản phẩm cũ, ghi đè bằng các giá trị mới.
      await api.put(`/products/${id}`, { ...product, ...values });
      showToast('Đã cập nhật sản phẩm');
    } else {
      await api.post('/products', values);
      showToast('Đã thêm sản phẩm');
    }
    // Trang danh sách tự tải lại từ API nên thấy ngay dữ liệu mới.
    navigate('/products');
  }

  function renderContent() {
    if (loading || categoriesLoading) {
      return (
        <p className="state-box" data-testid="loading">
          Đang tải...
        </p>
      );
    }

    const error = loadError || categoriesError;
    if (error) {
      return (
        <div className="state-box">
          <p className="state-error" data-testid="error-message">
            {error}
          </p>
          <Link to="/products" className="btn">
            Về danh sách sản phẩm
          </Link>
        </div>
      );
    }

    // Đổi giá và tồn kho sang chuỗi vì ô nhập làm việc với chuỗi.
    const initialValues = isEdit
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: String(product.price),
          stock: String(product.stock),
          status: product.status,
        }
      : EMPTY_FORM;

    return <ProductForm initialValues={initialValues} categories={categories} onSubmit={handleSubmit} />;
  }

  return (
    <>
      <div className="page-header">
        <h1>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
      </div>

      {renderContent()}
    </>
  );
}
