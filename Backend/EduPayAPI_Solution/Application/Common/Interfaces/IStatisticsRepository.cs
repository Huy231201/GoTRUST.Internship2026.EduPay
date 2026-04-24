namespace EduPayAPI.Application.Common.Interfaces;

public interface IStatisticsRepository
{
    Task<int> GetTotalStudentsAsync(Guid schoolYearId, CancellationToken cancellationToken);
    Task<int> GetTotalTeachersAsync(Guid schoolYearId, CancellationToken cancellationToken);
    Task<int> GetTotalClassesAsync(Guid schoolYearId, CancellationToken cancellationToken);

    Task<Dictionary<Guid, int>> GetStudentCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken);
    Task<Dictionary<Guid, int>> GetTeacherCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken);
    Task<Dictionary<Guid, int>> GetClassCountsByBranchAsync(Guid schoolYearId, CancellationToken cancellationToken);
}