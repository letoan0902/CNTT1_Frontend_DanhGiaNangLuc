import axios from 'axios';
import { useEffect, useState } from 'react';
import api from '../api/axiosClient.js';

export const PAGE_SIZE = 10; // số sản phẩm mỗi trang

// Custom hook tải danh sách sản phẩm theo từ khoá, danh mục, trạng thái và trang.
// Bản đã sửa của src/ai/useProductSearch_ai.js: khi tham số đổi, request cũ bị huỷ
// bằng AbortController nên danh sách luôn khớp với tham số mới nhất.
//
// params: { q, category, status, page } ('' nghĩa là không lọc theo mục đó)
// Trả về:
// - data: mảng sản phẩm của trang hiện tại
// - total: tổng số sản phẩm khớp điều kiện (null khi chưa tải xong lần nào)
// - loading: đang tải hay không
// - error: thông báo lỗi ('' nếu không lỗi)
// - reload: hàm gọi lại API với tham số hiện tại (dùng cho nút "Thử lại" và sau khi xoá)
export default function useProductSearch(params) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0); // tăng lên 1 để tải lại

  useEffect(() => {
    // Mỗi lần effect chạy có một controller riêng để huỷ đúng request của lần đó.
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError('');

      // Chỉ gửi những tham số có giá trị.
      const query = { page: params.page, limit: PAGE_SIZE };
      if (params.q) query.q = params.q;
      if (params.category) query.category = params.category;
      if (params.status) query.status = params.status;

      try {
        const res = await api.get('/products', { params: query, signal: controller.signal });
        setData(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        if (axios.isCancel(err)) return; // lỗi do chính mình huỷ request: bỏ qua
        setError(err.response?.data?.message ?? 'Không tải được danh sách sản phẩm');
      } finally {
        // Request đã bị huỷ thì không tắt loading, vì request mới hơn vẫn đang chờ.
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    // Dọn dẹp: tham số đổi (hoặc gỡ component) thì huỷ request cũ đang chờ.
    return () => {
      controller.abort();
    };
  }, [params.q, params.category, params.status, params.page, reloadCount]);

  function reload() {
    setReloadCount((count) => count + 1);
  }

  return { data, total, loading, error, reload };
}
