


namespace EduPayAPI.Application.Features.Students.Create;

public record CreateStudentCommand(
    string Code,
    string FullName,
    Gender Gender,
    DateOnly DateOfBirth,
    Guid ClassId,
    StudentType Type,
    Guid BranchId,
    Guid SchoolYearId,
    string? Email,
    string? PhoneNumber
) : IRequest<StudentResponse>;