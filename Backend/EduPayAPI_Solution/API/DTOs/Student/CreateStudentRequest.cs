

namespace EduPayAPI.API.DTOs.Student;

public class CreateStudentRequest
{
    public string Code { get; set; } = default!;

    public string FullName { get; set; } = default!;

    public Gender Gender { get; set; } 

    public DateOnly DateOfBirth { get; set; }

    public Guid ClassId { get; set; }

    public StudentType Type { get; set; }

    public Guid BranchId { get; set; }

    public Guid SchoolYearId { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }
}