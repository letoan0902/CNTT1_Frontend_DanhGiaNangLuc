// Các hàm định dạng dữ liệu để hiển thị.

const numberFormatter = new Intl.NumberFormat('vi-VN');

// 1290000 -> "1.290.000 ₫"
export function formatPrice(price) {
  return `${numberFormatter.format(price)} ₫`;
}
