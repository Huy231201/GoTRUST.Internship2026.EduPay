namespace EduPayAPI.API.DTOs.Auth;

/// <summary>
/// Dữ liệu client gửi lên khi login
/// </summary>
public record LoginRequest(
    string Account,
    string Password
);
