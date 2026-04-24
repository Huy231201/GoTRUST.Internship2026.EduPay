
namespace EduPayAPI.Application.Features.SchoolYears.Create;

public class CreateSchoolYearHandler 
    : IRequestHandler<CreateSchoolYearCommand, SchoolYearResponse>
{
    private readonly ISchoolYearRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateSchoolYearHandler> _logger;
    private readonly ICacheService _cache;

    public CreateSchoolYearHandler(
        ISchoolYearRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<CreateSchoolYearHandler> logger,
        ICacheService cache)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _cache = cache;
    }

    public async Task<SchoolYearResponse> Handle(
        CreateSchoolYearCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Validate basic
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new Exception("Name is required");

        if (request.EndDate <= request.StartDate)
            throw new Exception("EndDate must be greater than StartDate");

        // 2. Validate format Name: YYYY-YYYY
        var parts = request.Name.Split('-');

        if (parts.Length != 2 
            || !int.TryParse(parts[0], out var startYear) 
            || !int.TryParse(parts[1], out var endYear))
        {
            throw new Exception("Name must be format 'YYYY-YYYY'");
        }

        if (startYear >= endYear)
            throw new Exception("Invalid school year range");

        // 3. Validate date range
        if (request.StartDate.Year < startYear || request.StartDate.Year > endYear)
            throw new Exception("StartDate is out of school year range");

        if (request.EndDate.Year < startYear || request.EndDate.Year > endYear)
            throw new Exception("EndDate is out of school year range");

        // 4. Check duplicate
        var exists = await _repository.ExistsByNameAsync(request.Name, cancellationToken);
        if (exists)
            throw new Exception("School year already exists");

        // 5. Create entity
        var schoolYear = new SchoolYear(
            request.Name,
            request.StartDate,
            request.EndDate,
            request.Description
        );

        // 6. Add
        await _repository.AddAsync(schoolYear, cancellationToken);

        // 7. Save
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        //  8. Invalidate cache
        await _cache.RemoveAsync("schoolyears:all");

        _logger.LogInformation("Created SchoolYear: {Name}", request.Name);

        // 9. Return
        return new SchoolYearResponse
        {
            Id = schoolYear.Id,
            Name = schoolYear.Name,
            StartDate = schoolYear.StartDate,
            EndDate = schoolYear.EndDate,
            Description = schoolYear.Description
        };
    }
}