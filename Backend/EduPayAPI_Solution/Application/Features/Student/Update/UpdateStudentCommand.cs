using EduPayAPI.Domain.Enums;

namespace EduPayAPI.Application.Features.Students.Update;

public record UpdateStudentCommand(
    Guid Id,
    string FullName,
    string Code,
    Gender Gender,
    DateOnly DateOfBirth,
    Guid ClassId,
    StudentType Type,
    string? Email,
    string? PhoneNumber,
    StudentStatus Status
) : IRequest<StudentResponse>;