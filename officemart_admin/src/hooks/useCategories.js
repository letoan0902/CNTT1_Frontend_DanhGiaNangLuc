import { useEffect, useState } from 'react';
import api from '../api/axiosClient.js';

// Custom hook tải danh sách danh mục từ GET /api/categories.
// Trả về:
// - categories: mảng [{ id, name }] (dùng cho thẻ select)
// - categoryNames: object { id danh mục: tên hiển thị } (dùng cho bảng sản phẩm)
// - loading: đang tải hay không
// - error: thông báo lỗi ('' nếu không lỗi)
export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ignore = true khi effect đã bị dọn dẹp: bỏ qua kết quả trả về muộn.
    let ignore = false;

    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        if (!ignore) setCategories(res.data);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message ?? 'Không tải được danh mục');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  // Đổi mảng [{ id, name }] thành object { id: name } để tra tên cho nhanh.
  const categoryNames = {};
  categories.forEach((category) => {
    categoryNames[category.id] = category.name;
  });

  return { categories, categoryNames, loading, error };
}
