

namespace EduPayAPI.Application.Common.Interfaces;

public interface ISchoolYearRepository
{
    // Thêm năm học mới
    Task AddAsync(SchoolYear schoolYear, CancellationToken cancellationToken);

    Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken);

    Task<List<SchoolYear>> GetAllAsync(CancellationToken cancellationToken);

    Task<List<SchoolYear>> SearchAsync(string? search, CancellationToken cancellationToken);

    Task<SchoolYear?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task DeleteAsync(SchoolYear schoolYear, CancellationToken cancellationToken);
}