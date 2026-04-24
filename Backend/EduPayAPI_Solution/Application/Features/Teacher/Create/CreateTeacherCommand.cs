namespace EduPayAPI.Application.Features.Teachers.Create;

public record CreateTeacherCommand(
    string Code,
    string Name,
    string Email,
    string? PhoneNumber,
    Guid BranchId,
    Guid SchoolYearId
) : IRequest<TeacherResponse>;