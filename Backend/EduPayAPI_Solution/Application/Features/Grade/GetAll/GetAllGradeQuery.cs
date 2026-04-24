namespace EduPayAPI.Application.Features.Grades.GetAll;

public record GetAllGradeQuery(
    string? Search,
    bool? Status,
    Guid? BranchId,
    Guid? SchoolYearId
) : IRequest<List<GradeResponse>>;