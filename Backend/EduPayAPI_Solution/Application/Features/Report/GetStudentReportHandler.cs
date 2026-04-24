

namespace EduPayAPI.Application.Features.Report;

public class GetStudentReportHandler 
    : IRequestHandler<GetStudentReportQuery, List<StudentReportDto>>
{
    private readonly IStudentRepository _repo;

    public GetStudentReportHandler(IStudentRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<StudentReportDto>> Handle(
        GetStudentReportQuery request,
        CancellationToken cancellationToken)
    {
        return await _repo.GetStudentReportAsync(
            request.BranchId, 
            request.SchoolYearId,
            request.GradeId,
            request.ClassId,
            request.Status
        );
    }
}