

namespace EduPayAPI.Application.Features.SchoolYears.Update;

public class UpdateSchoolYearHandler 
    : IRequestHandler<UpdateSchoolYearCommand, SchoolYearResponse>
{
    private readonly ISchoolYearRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateSchoolYearHandler> _logger;
    private readonly ICacheService _cache;

    public UpdateSchoolYearHandler(
        ISchoolYearRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<UpdateSchoolYearHandler> logger,
        ICacheService cache)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _cache = cache;
    }

    public async Task<SchoolYearResponse> Handle(
        UpdateSchoolYearCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Find
        var schoolYear = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (schoolYear == null)
            throw new Exception("SchoolYear not found");

        // 2. Validate
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new Exception("Name is required");

        if (request.EndDate <= request.StartDate)
            throw new Exception("EndDate must be greater than StartDate");

        // 3. Validate format Name
        var parts = request.Name.Split('-');

        if (parts.Length != 2 
            || !int.TryParse(parts[0], out var startYear) 
            || !int.TryParse(parts[1], out var endYear))
        {
            throw new Exception("Name must be format 'YYYY-YYYY'");
        }

        if (startYear >= endYear)
            throw new Exception("Invalid school year range");

        // 4. Validate date range
        if (request.StartDate.Year < startYear || request.StartDate.Year > endYear)
            throw new Exception("StartDate is out of school year range");

        if (request.EndDate.Year < startYear || request.EndDate.Year > endYear)
            throw new Exception("EndDate is out of school year range");

        // 5. Check duplicate (trừ chính nó)
        var exists = await _repository.ExistsByNameAsync(request.Name, cancellationToken);
        if (exists && schoolYear.Name != request.Name)
            throw new Exception("School year already exists");

        // 6. Update entity
        schoolYear.Update(
            request.Name,
            request.StartDate,
            request.EndDate,
            request.Description
        );

        // 7. Save
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        //  8. Invalidate cache
        await _cache.RemoveAsync("schoolyears:all");

        _logger.LogInformation("Updated SchoolYear: {Id}", request.Id);

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