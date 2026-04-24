namespace EduPayAPI.Application.Common.Interfaces;

// Interface này định nghĩa các hành động liên quan đến JWT Token
public interface IJwtTokenService
{

    // Phương thức tạo Access Token dựa trên thông tin người dùng
    string GenerateAccessToken(
        Guid userId,
        string account,
        string fullName,
        Guid schoolId,
        IEnumerable<string> roles
    );

    // Phương thức tạo Refresh Token
    string GenerateRefreshToken();

    // Thời gian sống của Access Token (tính bằng giây)
    int AccessTokenExpirySeconds { get; }
}
