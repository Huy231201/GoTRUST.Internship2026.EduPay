namespace EduPayAPI.Application.Common.Interfaces;
public interface IBranchRepository
{

     Task<bool> ExistsByCodeAsync(
        Guid schoolId,
        string code,
        Guid? excludeId,
        CancellationToken cancellationToken
    );

    Task<bool> ExistsByNameAsync(
        Guid schoolId,
        string name,
        Guid? excludeId,
        CancellationToken cancellationToken
    );

    Task AddAsync(Branch branch, CancellationToken cancellationToken);

    Task<Branch?> GetMainBranchBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken);

    Task UpdateAsync(Branch branch, CancellationToken cancellationToken);

    Task<List<Branch>> GetBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken);

    Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task DeleteAsync(Branch branch, CancellationToken cancellationToken);
}