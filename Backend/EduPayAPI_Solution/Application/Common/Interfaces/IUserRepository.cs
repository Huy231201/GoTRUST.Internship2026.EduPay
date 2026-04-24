namespace EduPayAPI.Application.Common.Interfaces;

// Interface này định nghĩa các hành động truy xuất dữ liệu User
// Nó nằm ở tầng Application để Handler có thể sử dụng mà không cần biết DB là gì (Loosely Coupled)
public interface IUserRepository
{
    // Tìm kiếm một User dựa vào Email
    // Task<User?>: Trả về một User nếu tìm thấy, hoặc null nếu không tồn tại (dấu ? đại diện cho nullable)
    // CancellationToken: Cho phép hủy bỏ tác vụ tìm kiếm nếu request bị đóng đột ngột (tối ưu hiệu năng)
    Task<User?> GetByAccountAsync(string account, CancellationToken cancellationToken);

    Task AddAsync(User user, CancellationToken cancellationToken);

    Task<bool> ExistsByAccountAsync(string account, CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
}