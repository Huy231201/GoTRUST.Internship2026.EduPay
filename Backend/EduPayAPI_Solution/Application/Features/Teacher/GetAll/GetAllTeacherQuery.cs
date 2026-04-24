

namespace EduPayAPI.Application.Features.Teachers.GetAll;

public record GetAllTeacherQuery(
    Guid? BranchId,
    Guid? SchoolYearId,
    string? Search,
    TeacherStatus? Status,
    Guid? DepartmentId
) : IRequest<List<TeacherResponse>>;