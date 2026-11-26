import { createContext, useContext, useEffect, useState } from 'react';

// Context chứa hàm hiện thông báo (toast) dùng chung cho mọi trang.
const ToastContext = createContext(null);

const TOAST_DURATION = 4000; // thông báo tự ẩn sau 4 giây

// Bọc quanh ứng dụng (xem App.jsx). Toast nằm ở đây nên chuyển trang vẫn còn hiển thị.
export function ToastProvider({ children }) {
  // toast là null (không hiện) hoặc object { message }
  const [toast, setToast] = useState(null);

  // Mỗi lần gọi tạo một object mới để bộ hẹn giờ bên dưới được đặt lại.
  function showToast(message) {
    setToast({ message });
  }

  useEffect(() => {
    if (!toast) return;
    const timerId = setTimeout(() => setToast(null), TOAST_DURATION);
    // Dọn dẹp: huỷ hẹn giờ cũ khi có toast mới hoặc khi gỡ component.
    return () => clearTimeout(timerId);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" data-testid="toast" role="status">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Custom hook: const { showToast } = useToast(); showToast('Đã thêm sản phẩm');
export function useToast() {
  return useContext(ToastContext);
}
