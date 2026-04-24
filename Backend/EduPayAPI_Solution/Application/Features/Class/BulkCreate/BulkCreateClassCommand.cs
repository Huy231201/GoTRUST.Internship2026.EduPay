namespace EduPayAPI.Application.Features.Classes.BulkCreate;
public record BulkCreateClassCommand(
    Guid GradeId,
    Guid SchoolYearId,
    Guid BranchId,
    char StartLetter,
    char EndLetter,
    int StartNumber,
    int EndNumber
) : IRequest<BulkCreateClassResponse>;