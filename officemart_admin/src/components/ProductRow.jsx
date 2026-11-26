import { formatPrice } from '../utils/format.js';

// Một dòng của bảng sản phẩm (trên điện thoại là một thẻ).
// Props:
// - product: object sản phẩm (bắt buộc)
// - categoryNames: object { id danh mục: tên hiển thị }, lấy từ API /api/categories (không bắt buộc)
// - onEdit, onDelete: hàm được gọi với product khi bấm nút Sửa / Xoá (không bắt buộc)
export default function ProductRow({ product, categoryNames = {}, onEdit, onDelete }) {
  const isActive = product.status === 'active';
  // Không tìm thấy tên danh mục thì hiển thị tạm id danh mục.
  const categoryName = categoryNames[product.category] ?? product.category;

  function handleEdit() {
    if (onEdit) onEdit(product);
  }

  function handleDelete() {
    if (onDelete) onDelete(product);
  }

  // data-label dùng cho giao diện điện thoại: CSS lấy làm nhãn bên trái mỗi ô.
  return (
    <tr data-testid="product-row">
      <td data-label="Tên" className="cell-name">
        {product.name}
      </td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryName}</td>
      <td data-label="Giá">{formatPrice(product.price)}</td>
      <td data-label="Tồn kho">
        {product.stock === 0 ? <span className="out-of-stock">Hết hàng</span> : product.stock}
      </td>
      <td data-label="Trạng thái">
        <span data-testid="product-status" className={isActive ? 'badge badge-active' : 'badge badge-inactive'}>
          {isActive ? 'Đang bán' : 'Ngừng bán'}
        </span>
      </td>
      <td data-label="Thao tác">
        <div className="row-actions">
          <button type="button" className="btn btn-sm" data-testid="edit-button" onClick={handleEdit}>
            Sửa
          </button>
          <button type="button" className="btn btn-sm btn-danger" data-testid="delete-button" onClick={handleDelete}>
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
