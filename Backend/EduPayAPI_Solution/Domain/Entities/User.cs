namespace EduPayAPI.Domain.Entities;

// Thực thể User đại diện cho người dùng
public class User
{
    public Guid Id { get; private set; }
    public string Account { get; private set; } = default!;
    public string Password { get; private set; } = default!;
    public string FullName { get; private set; } = default!;
    public UserRole Role { get; private set; } = default;
    public Guid SchoolId { get; private set; }
    public School School { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; }

    // Constructor rỗng bắt buộc cho Entity Framework Core
    protected User() { }


    public User(string account, string password, string fullName, UserRole role, Guid schoolId)
    {
        Id = Guid.NewGuid();
        Account = account;
        Password = password;
        FullName = fullName;
        Role = role;
        SchoolId = schoolId;
        CreatedAt = DateTime.UtcNow;
    }

    public void ChangePassword(string newPassword)
    {
        Password = newPassword;
    }
}