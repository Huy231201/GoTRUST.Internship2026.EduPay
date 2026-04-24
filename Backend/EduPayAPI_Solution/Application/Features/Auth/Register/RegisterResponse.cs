namespace EduPayAPI.Application.Features.Auth.Register;
public class RegisterResponse
{
    public Guid UserId { get; init; }
    public string Account { get; init; } = default!;
    public string FullName { get; init; } = default!;

    public SchoolInfo School { get; init; } = default!;

    public DateTime CreatedAt { get; init; }
}

public class SchoolInfo
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;
}