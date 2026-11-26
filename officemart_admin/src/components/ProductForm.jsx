import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateProduct } from '../utils/validate.js';

// Form thêm / sửa sản phẩm (dùng chung cho cả hai trang).
// Props:
// - initialValues: giá trị ban đầu { name, sku, category, price, stock, status }, đều là chuỗi
// - categories: mảng danh mục [{ id, name }] cho ô chọn danh mục
// - onSubmit: hàm async nhận dữ liệu đã hợp lệ (price, stock là số) và gọi API.
//   Nếu API báo lỗi thì hàm ném lỗi của axios ra, form sẽ hiển thị lỗi đó.
export default function ProductForm({ initialValues, categories, onSubmit }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({}); // lỗi từng trường: { sku: '...' }
  const [formError, setFormError] = useState(''); // lỗi chung, không thuộc trường nào
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Người dùng đang sửa trường nào thì ẩn lỗi cũ của trường đó.
    setErrors({ ...errors, [name]: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return; // đang gửi thì bỏ qua, tránh gửi hai request

    const newErrors = validateProduct(form);
    setErrors(newErrors);
    setFormError('');
    if (Object.keys(newErrors).length > 0) return; // có lỗi: không gọi API

    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
      });
      // Thành công: trang cha chuyển về danh sách nên không cần mở khoá nút.
    } catch (err) {
      const data = err.response?.data;
      if (data?.field) {
        // Lỗi 400, 409 của server có field (ví dụ sku trùng): hiện dưới đúng trường đó.
        setErrors({ [data.field]: data.message });
      } else {
        setFormError(data?.message ?? 'Lưu sản phẩm thất bại, vui lòng thử lại');
      }
      setSaving(false);
    }
  }

  return (
    // noValidate: tắt kiểm tra của trình duyệt để dùng thông báo lỗi của mình.
    <form className="product-form" data-testid="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Tên sản phẩm</label>
        <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
        {errors.name && (
          <p className="field-error" data-testid="field-error-name">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" type="text" placeholder="ABC-1234" value={form.sku} onChange={handleChange} />
        {errors.sku && (
          <p className="field-error" data-testid="field-error-sku">
            {errors.sku}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="category">Danh mục</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="field-error" data-testid="field-error-category">
            {errors.category}
          </p>
        )}
      </div>

      {/* Giá và tồn kho dùng type="text" để tự kiểm tra và báo lỗi bằng tiếng Việt. */}
      <div className="form-field">
        <label htmlFor="price">Giá</label>
        <input id="price" name="price" type="text" inputMode="decimal" placeholder="Ví dụ: 150000" value={form.price} onChange={handleChange} />
        {errors.price && (
          <p className="field-error" data-testid="field-error-price">
            {errors.price}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="stock">Tồn kho</label>
        <input id="stock" name="stock" type="text" inputMode="numeric" value={form.stock} onChange={handleChange} />
        {errors.stock && (
          <p className="field-error" data-testid="field-error-stock">
            {errors.stock}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
        {errors.status && (
          <p className="field-error" data-testid="field-error-status">
            {errors.status}
          </p>
        )}
      </div>

      {formError && <p className="field-error">{formError}</p>}

      <div className="form-actions">
        <Link to="/products" className="btn">
          Huỷ
        </Link>
        <button type="submit" className="btn btn-primary" data-testid="submit-button" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  );
}
