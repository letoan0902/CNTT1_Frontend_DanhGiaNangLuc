// Hộp xác nhận xoá tự làm (không dùng window.confirm).
// Props:
// - message: câu hỏi xác nhận
// - error: thông báo lỗi hiện trong hộp (không bắt buộc)
// - busy: true khi đang xử lý, hai nút bị khoá
// - onConfirm: hàm gọi khi bấm nút đồng ý
// - onCancel: hàm gọi khi bấm nút huỷ
export default function ConfirmDialog({ message, error, busy = false, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog" role="dialog" aria-modal="true" data-testid="confirm-dialog">
        <p className="dialog-message">{message}</p>
        {error && <p className="field-error">{error}</p>}

        <div className="dialog-actions">
          <button type="button" className="btn" data-testid="confirm-no" disabled={busy} onClick={onCancel}>
            Huỷ
          </button>
          <button type="button" className="btn btn-primary" data-testid="confirm-yes" disabled={busy} onClick={onConfirm}>
            {busy ? 'Đang xoá...' : 'Xoá'}
          </button>
        </div>
      </div>
    </div>
  );
}
