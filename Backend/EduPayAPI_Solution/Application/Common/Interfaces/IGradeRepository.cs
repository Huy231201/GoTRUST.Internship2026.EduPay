namespace EduPayAPI.Application.Common.Interfaces;

public interface IGradeRepository
{
    Task AddAsync(Grade grade, CancellationToken cancellationToken);

    Task<bool> ExistsByNameAsync(string name, Guid branchId, Guid schoolYearId, CancellationToken cancellationToken);

    Task<List<Grade>> GetAllAsync(
    string? search,
    bool? status,
    Guid? branchId,
    Guid? schoolYearId,
    CancellationToken cancellationToken);

    Task<Grade?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task DeleteAsync(Grade grade, CancellationToken cancellationToken);

    Task UpdateAsync(Grade grade, CancellationToken cancellationToken);

    Task<List<Grade>> GetByBranchAndYearAsync(
    Guid branchId,
    Guid schoolYearId,
    CancellationToken cancellationToken);
}