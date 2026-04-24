
namespace EduPayAPI.Application.Features.Grades.Create;

public record CreateGradeCommand(
    string Name,
    string? Description,
    bool Status,
    Guid BranchId,
    Guid SchoolYearId
) : IRequest<GradeResponse>;