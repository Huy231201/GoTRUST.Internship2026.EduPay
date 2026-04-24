

namespace EduPayAPI.Application.Features.Classes.GetAll;

public record GetAllClassQuery(
    Guid? SchoolYearId,
    Guid? BranchId,
    Guid? GradeId,
    string? Search
) : IRequest<List<ClassResponse>>;