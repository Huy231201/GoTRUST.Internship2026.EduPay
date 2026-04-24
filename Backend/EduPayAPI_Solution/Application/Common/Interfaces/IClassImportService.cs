
namespace EduPayAPI.Application.Common.Interfaces;

public interface IClassImportService
{
    List<string> SupportedExtensions { get; }
    Task<List<ImportClassDto>>  ReadAsync(
        IFormFile file,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken ct);
}

