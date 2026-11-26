import ProductTable from '../components/ProductTable.jsx';
import sampleProducts from '../data/sample.js';

// Sắp xếp mới nhất trước (theo createdAt), không làm đổi mảng gốc.
function sortNewestFirst(products) {
  return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Trang /products: danh sách sản phẩm.
export default function ProductListPage() {
  const products = sortNewestFirst(sampleProducts);

  return (
    <>
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <button type="button" className="btn btn-primary" data-testid="add-button">
          Thêm sản phẩm
        </button>
      </div>

      <ProductTable products={products} />
    </>
  );
}
