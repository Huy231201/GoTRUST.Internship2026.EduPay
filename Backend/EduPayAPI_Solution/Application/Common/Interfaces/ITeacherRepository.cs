

namespace EduPayAPI.Application.Common.Interfaces;

public interface ITeacherRepository
{
    Task AddAsync(Teacher teacher, CancellationToken cancellationToken);
    Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken);
    Task<Teacher?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task DeleteAsync(Teacher teacher, CancellationToken cancellationToken);


    Task<List<Teacher>> GetAllAsync(
    Guid? branchId,
    Guid? schoolYearId,
    string? search,
    TeacherStatus? status,
    Guid? departmentId,
    CancellationToken cancellationToken);

    Task<List<Teacher>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct);
}