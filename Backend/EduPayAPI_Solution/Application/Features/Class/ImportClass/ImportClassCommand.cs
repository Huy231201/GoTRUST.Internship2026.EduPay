
namespace EduPayAPI.Application.Features.Classes.ImportClass;

public record ImportClassCommand(
    IFormFile File,
    Guid BranchId,
    Guid SchoolYearId
) : IRequest<ImportClassResponse>;