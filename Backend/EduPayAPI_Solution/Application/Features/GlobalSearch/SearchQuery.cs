

namespace EduPayAPI.Application.Features.GlobalSearch;

public record SearchQuery(
    Guid? SchoolYearId,
    Guid? BranchId,
    string? Search
) : IRequest<SearchResponse>;