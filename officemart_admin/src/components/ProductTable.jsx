import ProductRow from './ProductRow.jsx';

// Bảng sản phẩm. Hiển thị products theo đúng thứ tự được truyền vào.
// Props:
// - products: mảng sản phẩm (bắt buộc)
// - categoryNames, onEdit, onDelete: không bắt buộc, chuyển tiếp xuống ProductRow
export default function ProductTable({ products, categoryNames, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <table className="product-table" data-testid="product-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              categoryNames={categoryNames}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
