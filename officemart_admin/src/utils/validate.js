// Kiểm tra dữ liệu form sản phẩm (Mục 4.2.2).

const SKU_PATTERN = /^[A-Z]{3}-\d{4}$/; // 3 chữ in hoa, gạch ngang, 4 chữ số: KEY-0001
const NUMBER_PATTERN = /^\d+(\.\d+)?$/; // số không âm, có thể có phần thập phân: 150000, 99.5
const INTEGER_PATTERN = /^\d+$/; // số nguyên không âm: 0, 12

// form: { name, sku, category, price, stock, status }, mọi giá trị đều là chuỗi lấy từ ô nhập.
// Trả về object lỗi { tên trường: thông báo }. Dữ liệu hợp lệ thì trả về {}.
export function validateProduct(form) {
  const errors = {};

  const name = form.name.trim();
  if (name === '') {
    errors.name = 'Vui lòng nhập tên sản phẩm';
  } else if (name.length < 3 || name.length > 100) {
    errors.name = 'Tên sản phẩm phải từ 3 đến 100 ký tự';
  }

  if (form.sku === '') {
    errors.sku = 'Vui lòng nhập SKU';
  } else if (!SKU_PATTERN.test(form.sku)) {
    errors.sku = 'SKU phải đúng dạng ABC-1234 (3 chữ in hoa, dấu gạch ngang, 4 chữ số)';
  }

  if (form.category === '') {
    errors.category = 'Vui lòng chọn danh mục';
  }

  // Lưu ý Number('') là 0 nên phải kiểm tra ô trống riêng.
  const price = form.price.trim();
  if (price === '') {
    errors.price = 'Vui lòng nhập giá';
  } else if (!NUMBER_PATTERN.test(price) || Number(price) <= 0) {
    errors.price = 'Giá phải là số lớn hơn 0 (chỉ nhập chữ số, ví dụ 150000)';
  }

  const stock = form.stock.trim();
  if (stock === '') {
    errors.stock = 'Vui lòng nhập tồn kho';
  } else if (!INTEGER_PATTERN.test(stock)) {
    errors.stock = 'Tồn kho phải là số nguyên không âm (ví dụ 0, 12)';
  }

  if (form.status !== 'active' && form.status !== 'inactive') {
    errors.status = 'Vui lòng chọn trạng thái';
  }

  return errors;
}
