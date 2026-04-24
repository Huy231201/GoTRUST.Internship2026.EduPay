

namespace EduPayAPI.Application.Features.Teachers.Update;

public record UpdateTeacherCommand(
    Guid Id,
    string Code,
    string Name,
    string Email,
    string? PhoneNumber,
    TeacherStatus Status
) : IRequest<TeacherResponse>;