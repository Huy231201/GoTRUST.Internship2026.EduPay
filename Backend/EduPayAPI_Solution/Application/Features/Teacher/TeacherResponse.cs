
namespace EduPayAPI.Application.Features.Teachers;
public class TeacherResponse
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;

    public string Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public TeacherStatus Status { get; set; }
    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}