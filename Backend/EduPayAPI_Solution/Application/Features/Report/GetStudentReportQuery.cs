namespace EduPayAPI.Application.Features.Report;

public record GetStudentReportQuery(
    Guid? BranchId,
    Guid? SchoolYearId,
    Guid? GradeId,
    Guid? ClassId,
    int? Status
) : IRequest<List<StudentReportDto>>;