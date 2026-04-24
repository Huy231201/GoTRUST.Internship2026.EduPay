
namespace EduPayAPI.Application.Common.Interfaces;

public interface IStudentRepository
{
    Task AddAsync(Student student, CancellationToken cancellationToken);

    Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken);

    Task UpdateAsync(Student student, CancellationToken cancellationToken);

    Task DeleteAsync(Student student, CancellationToken cancellationToken);

    Task<List<Student>> GetAllAsync(
        string? search,
        StudentStatus? status,
        Guid? classId,
        Guid? branchId,
        Guid? schoolYearId,
        CancellationToken cancellationToken
    );

    Task<List<string>> GetExistingCodesAsync(
    List<string> codes,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct);

    Task AddRangeAsync(
    List<Student> students,
    CancellationToken ct);


    Task<List<StudentReportDto>> GetStudentReportAsync(
        Guid? branchId,
        Guid? schoolYearId,
        Guid? gradeId,
        Guid? classId,
        int? status
    );

    Task<List<Student>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct);
}