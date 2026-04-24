
public class StatisticsRepository : IStatisticsRepository
{
    private readonly AppDbContext _context;

    public StatisticsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalStudentsAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Students
            .CountAsync(x => x.SchoolYearId == schoolYearId, cancellationToken);
    }

    public async Task<int> GetTotalTeachersAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Teachers
            .CountAsync(x => x.SchoolYearId == schoolYearId, cancellationToken);
    }

    public async Task<int> GetTotalClassesAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Classes
            .CountAsync(x => x.SchoolYearId == schoolYearId, cancellationToken);
    }

    public async Task<Dictionary<Guid, int>> GetStudentCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Students
            .Where(x => x.SchoolYearId == schoolYearId)
            .GroupBy(x => x.BranchId)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<Guid, int>> GetTeacherCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Teachers
            .Where(x => x.SchoolYearId == schoolYearId)
            .GroupBy(x => x.BranchId)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    public async Task<Dictionary<Guid, int>> GetClassCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken)
    {
        return await _context.Classes
            .Where(x => x.SchoolYearId == schoolYearId)
            .GroupBy(x => x.BranchId)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }
}