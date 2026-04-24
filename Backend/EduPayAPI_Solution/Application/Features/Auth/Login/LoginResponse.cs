namespace EduPayAPI.Application.Features.Auth.Login;

// Response trả về khi đăng nhập thành công
public class LoginResponse
{
    public string AccessToken { get; init; } = default!;
    public int ExpiresIn { get; init; }
    public string RefreshToken { get; init; } = default!;
    public UserDto User { get; init; } = default!;
}

public class UserDto
{
    public Guid Id { get; init; }
    public string Account { get; init; } = default!;
    public string FullName { get; init; } = default!;
    public Guid? SchoolId { get; init; } 
    public List<string> Roles { get; init; } = [];
}

