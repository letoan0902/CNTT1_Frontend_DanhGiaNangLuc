// Vùng phân trang: nút trước, "trang hiện tại / tổng số trang", nút sau.
// Props:
// - page: trang hiện tại (từ 1)
// - totalPages: tổng số trang (ít nhất là 1)
// - onPageChange: hàm nhận số trang muốn chuyển tới
export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination" data-testid="pagination">
      <button
        type="button"
        className="btn btn-sm"
        data-testid="page-prev"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Trước
      </button>

      <span data-testid="page-current">{`${page} / ${totalPages}`}</span>

      <button
        type="button"
        className="btn btn-sm"
        data-testid="page-next"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}
