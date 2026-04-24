namespace EduPayAPI.Application.Features.Grades.GetAll;

public class GetAllGradeHandler : IRequestHandler<GetAllGradeQuery, List<GradeResponse>>
{
    private readonly IGradeRepository _gradeRepository;

    public GetAllGradeHandler(IGradeRepository gradeRepository)
    {
        _gradeRepository = gradeRepository;
    }

    public async Task<List<GradeResponse>> Handle(
        GetAllGradeQuery request,
        CancellationToken cancellationToken)
    {
        var grades = await _gradeRepository.GetAllAsync(
            request.Search,
            request.Status,
            request.BranchId,
            request.SchoolYearId,
            cancellationToken);

        return grades.Select(g => new GradeResponse
        {
            Id = g.Id,
            Name = g.Name,
            Description = g.Description,
            Status = g.Status,
            BranchId = g.BranchId,
            SchoolYearId = g.SchoolYearId
        }).ToList();
    }
}