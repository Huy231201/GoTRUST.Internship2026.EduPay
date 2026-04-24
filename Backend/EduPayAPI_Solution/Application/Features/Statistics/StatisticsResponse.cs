namespace EduPayAPI.Application.Features.Statistics;

public class StatisticsResponse
{
    public int TotalStudents { get; set; }
    public int TotalTeachers { get; set; }
    public int TotalClasses { get; set; }

    public BranchStatisticResponse MainBranch { get; set; } = default!;
    public List<BranchStatisticResponse> SubBranches { get; set; } = [];
}

public class BranchStatisticResponse
{
    public Guid BranchId { get; set; }
    public string BranchName { get; set; } = default!;
    public bool IsMain { get; set; }

    public int StudentCount { get; set; }
    public int TeacherCount { get; set; }
    public int ClassCount { get; set; }
}