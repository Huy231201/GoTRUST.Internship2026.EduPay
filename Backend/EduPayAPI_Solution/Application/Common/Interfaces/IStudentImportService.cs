

using EduPayAPI.Application.Features.Students.ImportStudent;

namespace EduPayAPI.Application.Common.Interfaces;

public interface IStudentImportService
{
    List<string> SupportedExtensions { get; }

    Task<List<ImportStudentDto>> ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct);
}