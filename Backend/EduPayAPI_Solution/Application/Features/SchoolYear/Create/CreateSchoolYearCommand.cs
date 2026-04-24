namespace EduPayAPI.Application.Features.SchoolYears.Create;

public record CreateSchoolYearCommand(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Description
) : IRequest<SchoolYearResponse>;