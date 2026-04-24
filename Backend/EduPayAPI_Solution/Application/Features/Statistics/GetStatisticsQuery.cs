

namespace EduPayAPI.Application.Features.Statistics;

public record GetStatisticsQuery(Guid SchoolYearId, Guid SchoolId) 
    : IRequest<StatisticsResponse>;