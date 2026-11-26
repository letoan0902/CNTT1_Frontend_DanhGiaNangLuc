import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 400; // ngừng gõ 400 ms mới tìm kiếm

// Thanh tìm kiếm và bộ lọc của trang danh sách.
// Props:
// - q, category, status: giá trị đang có trên URL
// - categories: mảng danh mục [{ id, name }] lấy từ API
// - onChange: hàm nhận các tham số cần đổi, ví dụ onChange({ category: 'mouse', page: 1 })
export default function ProductFilters({ q, category, status, categories, onChange }) {
  // keyword là chữ đang gõ trong ô tìm kiếm (chưa chắc đã được ghi lên URL).
  const [keyword, setKeyword] = useState(q);

  // URL -> ô nhập: q trên URL đổi (bấm Back/Forward) thì hiện lại từ khoá đó.
  // Nếu ô nhập đã khớp với q (do chính mình vừa ghi lên URL) thì giữ nguyên,
  // để không xoá mất khoảng trắng người dùng đang gõ dở.
  useEffect(() => {
    setKeyword((current) => (current.trim() === q ? current : q));
  }, [q]);

  // Ô nhập -> URL: chờ người dùng ngừng gõ 400 ms rồi mới ghi từ khoá lên URL.
  useEffect(() => {
    const trimmed = keyword.trim(); // từ khoá chỉ có khoảng trắng coi như không có từ khoá
    if (trimmed === q) return; // URL đã khớp với ô nhập: không cần ghi

    const timerId = setTimeout(() => {
      onChange({ q: trimmed, page: 1 }); // đổi từ khoá thì về trang 1
    }, DEBOUNCE_MS);

    // Dọn dẹp: gõ tiếp (hoặc URL đổi) trước 400 ms thì huỷ hẹn giờ cũ.
    return () => clearTimeout(timerId);
    // Có category, status trong mảng phụ thuộc: đổi bộ lọc lúc đang chờ thì hẹn giờ lại,
    // để onChange ghi từ khoá kèm bộ lọc mới nhất (không ghi đè bằng bộ lọc cũ).
  }, [keyword, q, category, status]);

  return (
    <div className="filters">
      <input
        type="text"
        className="filter-search"
        data-testid="search-input"
        aria-label="Tìm theo tên hoặc SKU"
        placeholder="Tìm theo tên hoặc SKU"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select
        data-testid="category-filter"
        aria-label="Lọc theo danh mục"
        value={category}
        onChange={(e) => onChange({ category: e.target.value, page: 1 })}
      >
        <option value="">Tất cả</option>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        data-testid="status-filter"
        aria-label="Lọc theo trạng thái"
        value={status}
        onChange={(e) => onChange({ status: e.target.value, page: 1 })}
      >
        <option value="">Tất cả</option>
        <option value="active">Đang bán</option>
        <option value="inactive">Ngừng bán</option>
      </select>
    </div>
  );
}
