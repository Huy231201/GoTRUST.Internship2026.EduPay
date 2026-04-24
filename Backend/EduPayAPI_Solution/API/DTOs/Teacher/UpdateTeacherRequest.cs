

namespace EduPayAPI.Application.Features.Teachers.Update;

public class UpdateTeacherRequest
{
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public TeacherStatus Status { get; set; }
}