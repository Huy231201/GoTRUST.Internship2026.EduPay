

namespace EduPayAPI.Application.Features.SchoolYears.Update;

public record UpdateSchoolYearCommand(
    Guid Id,
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    string? Description
) : IRequest<SchoolYearResponse>;