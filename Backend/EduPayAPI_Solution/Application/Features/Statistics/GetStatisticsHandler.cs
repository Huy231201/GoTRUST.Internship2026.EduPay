
namespace EduPayAPI.Application.Features.Statistics;

public class GetStatisticsHandler 
    : IRequestHandler<GetStatisticsQuery, StatisticsResponse>
{
    private readonly IStatisticsRepository _statisticsRepository;
    private readonly IBranchRepository _branchRepository;

    public GetStatisticsHandler(
        IStatisticsRepository statisticsRepository,
        IBranchRepository branchRepository)
    {
        _statisticsRepository = statisticsRepository;
        _branchRepository = branchRepository;
    }

    public async Task<StatisticsResponse> Handle(
        GetStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        // 🔥 TOTAL (chạy tuần tự)
        var totalStudents = await _statisticsRepository
            .GetTotalStudentsAsync(request.SchoolYearId, cancellationToken);

        var totalTeachers = await _statisticsRepository
            .GetTotalTeachersAsync(request.SchoolYearId, cancellationToken);

        var totalClasses = await _statisticsRepository
            .GetTotalClassesAsync(request.SchoolYearId, cancellationToken);

        // 🔥 GROUP (chạy tuần tự)
        var studentDict = await _statisticsRepository
            .GetStudentCountsByBranchAsync(request.SchoolYearId, cancellationToken);

        var teacherDict = await _statisticsRepository
            .GetTeacherCountsByBranchAsync(request.SchoolYearId, cancellationToken);

        var classDict = await _statisticsRepository
            .GetClassCountsByBranchAsync(request.SchoolYearId, cancellationToken);

        // 🔥 BRANCHES
        var branches = await _branchRepository
            .GetBySchoolIdAsync(request.SchoolId, cancellationToken);

        // 🔥 Mapping
        var branchStats = branches.Select(b => new BranchStatisticResponse
        {
            BranchId = b.Id,
            BranchName = b.Name,
            IsMain = b.IsMain,

            StudentCount = studentDict.GetValueOrDefault(b.Id, 0),
            TeacherCount = teacherDict.GetValueOrDefault(b.Id, 0),
            ClassCount = classDict.GetValueOrDefault(b.Id, 0)
        }).ToList();

        var mainBranch = branchStats.FirstOrDefault(x => x.IsMain);

        if (mainBranch == null)
            throw new NotFoundException("Main branch not found or no branches found");
            
        var subBranches = branchStats.Where(x => !x.IsMain).ToList();

        return new StatisticsResponse
        {
            TotalStudents = totalStudents,
            TotalTeachers = totalTeachers,
            TotalClasses = totalClasses,

            MainBranch = mainBranch,
            SubBranches = subBranches
        };
    }
}