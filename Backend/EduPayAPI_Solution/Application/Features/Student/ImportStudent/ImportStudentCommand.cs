

public record ImportStudentCommand(
    IFormFile File,
    Guid BranchId,
    Guid SchoolYearId
) : IRequest<ImportStudentResponse>;