namespace EduPayAPI.API.DTOs.Teacher;

public class CreateTeacherRequest
{
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;

    public string Email { get; set; } = default!;
    public string? PhoneNumber { get; set; }

    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}