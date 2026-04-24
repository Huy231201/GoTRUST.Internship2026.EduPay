namespace EduPayAPI.Application.Common.Interfaces;

public interface ISchoolRepository
{
    // Lấy school theo Id (dùng cho UI / profile)
    Task<School?> GetMainSchoolAsync(CancellationToken cancellationToken);

    // Check mã trường đã tồn tại chưa (register)
    Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken);

    // Thêm school (register)
    Task AddAsync(School school, CancellationToken cancellationToken);

    Task UpdateAsync(School school, CancellationToken cancellationToken);

    Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken);

    
    
}