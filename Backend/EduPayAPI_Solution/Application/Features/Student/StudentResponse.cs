

namespace EduPayAPI.Application.Features.Students;

public class StudentResponse
{
    public Guid Id { get; set; }

    public string Code { get; set; } = default!;

    public string FullName { get; set; } = default!;

    public Gender Gender { get; set; } = default!;

    public DateOnly DateOfBirth { get; set; }

    public Guid ClassId { get; set; }

     public string ClassName { get; set; } = default!;

    public StudentType Type { get; set; }

    public StudentStatus Status { get; set; }

    public Guid BranchId { get; set; }

    public Guid SchoolYearId { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }
}