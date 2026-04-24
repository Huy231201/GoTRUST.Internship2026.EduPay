

namespace EduPayAPI.Application.Features.Grades.Update;

public record UpdateGradeCommand(
    Guid Id,
    string Name,
    string? Description,
    bool Status
) : IRequest<GradeResponse>;