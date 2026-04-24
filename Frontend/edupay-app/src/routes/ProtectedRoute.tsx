import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

// Component dùng để bảo vệ route (chỉ cho vào khi đã login)
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {

  // Lấy token từ zustand store
  // token này đã được load từ localStorage/sessionStorage khi app start
  const token = useAuthStore((s) => s.token);

  // Nếu không có token → chưa đăng nhập
  if (!token) {
    // redirect về trang login
    // replace = true để không quay lại được bằng nút back
    return <Navigate to="/login" replace />;
  }

  // Nếu có token → cho render nội dung bên trong (AppLayout, Dashboard,...)
  return <>{children}</>;
}