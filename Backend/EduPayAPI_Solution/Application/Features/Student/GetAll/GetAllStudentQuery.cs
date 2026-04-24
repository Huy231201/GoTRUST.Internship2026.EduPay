using EduPayAPI.Domain.Enums;

namespace EduPayAPI.Application.Features.Students.GetAll;

public record GetStudentsQuery(
    Guid? SchoolYearId,
    Guid? BranchId,
    Guid? ClassId,
    StudentStatus? Status,
    string? Search
) : IRequest<List<StudentResponse>>;