

namespace EduPayAPI.Application.Features.SchoolYears.GetSchoolYear;

public class GetSchoolYearHandler 
    : IRequestHandler<GetSchoolYearQuery, List<SchoolYearResponse>>
{
    private readonly ISchoolYearRepository _repository;
    private readonly ILogger<GetSchoolYearHandler> _logger;
    private readonly ICacheService _cache;

    public GetSchoolYearHandler(
        ISchoolYearRepository repository,
        ILogger<GetSchoolYearHandler> logger,
        ICacheService cache)
    {
        _repository = repository;
        _logger = logger;
        _cache = cache;
    }

    public async Task<List<SchoolYearResponse>> Handle(
        GetSchoolYearQuery request,
        CancellationToken cancellationToken)
    {
        var search = request.Search?.Trim();

        //  1. Chỉ cache khi không search
        if (string.IsNullOrEmpty(search))
        {
            var cacheKey = "schoolyears:all";

            // 1.1 Check cache
            var cached = await _cache.GetAsync<List<SchoolYearResponse>>(cacheKey);
            if (cached != null)
            {
                _logger.LogInformation("Fetched SchoolYears from cache");
                return cached;
            }

            // 1.2 Query DB
            var schoolYears = await _repository.SearchAsync(null, cancellationToken);

            var result = schoolYears
                .Select(x => new SchoolYearResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Description = x.Description
                })
                .ToList();

            // 1.3 Set cache (30 phút)
            await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(30));

            _logger.LogInformation("Fetched SchoolYears from DB and cached");

            return result;
        }

        //  2. Nếu có search → skip cache
        var filtered = await _repository.SearchAsync(search, cancellationToken);

        var filteredResult = filtered
            .Select(x => new SchoolYearResponse
            {
                Id = x.Id,
                Name = x.Name,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                Description = x.Description
            })
            .ToList();

        _logger.LogInformation("Fetched SchoolYears with search: {Search}", search);

        return filteredResult;
    }
}