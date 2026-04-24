

namespace EduPayAPI.Application.Features.SchoolYears.GetSchoolYear;

public record GetSchoolYearQuery(string? Search) 
    : IRequest<List<SchoolYearResponse>>;