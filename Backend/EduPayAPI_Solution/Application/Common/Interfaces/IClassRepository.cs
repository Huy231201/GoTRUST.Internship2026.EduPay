namespace EduPayAPI.Application.Common.Interfaces;
public interface IClassRepository
{
    // 🔹 Get list (có filter)
    Task<List<Class>> GetListAsync(
        Guid? schoolYearId,
        Guid? branchId,
        Guid? gradeId,
        string? search,
        CancellationToken cancellationToken);

    // 🔹 Get by id
    Task<Class?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    // 🔹 Check tồn tại theo name (tránh trùng)
    Task<bool> ExistsAsync(
        string name,
        Guid schoolYearId,
        Guid branchId,
        CancellationToken cancellationToken);

    // 🔹 Bulk: lấy danh sách tên đã tồn tại
    Task<List<string>> GetExistingClassNamesAsync(
        Guid schoolYearId,
        Guid branchId,
        CancellationToken cancellationToken);

    // 🔹 Create
    Task AddAsync(Class entity, CancellationToken cancellationToken);

    // 🔹 Bulk create
    Task AddRangeAsync(List<Class> classes, CancellationToken cancellationToken);

    // 🔹 Delete
    Task DeleteAsync(Class entity, CancellationToken cancellationToken);

    Task<List<string>> GetExistingCodesAsync(
    List<string> codes,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct);

    Task<List<string>> GetExistingNamesAsync(
    List<string> names,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct);

    Task<List<Class>> GetByBranchAndYearAsync(
    Guid branchId,
    Guid schoolYearId,
    CancellationToken cancellationToken);

    Task<List<Class>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct);
}