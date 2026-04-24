

namespace EduPayAPI.Application.Features.SchoolYears.Delete;

public class DeleteSchoolYearHandler 
    : IRequestHandler<DeleteSchoolYearCommand, bool>
{
    private readonly ISchoolYearRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DeleteSchoolYearHandler> _logger;
    private readonly ICacheService _cache;

    public DeleteSchoolYearHandler(
        ISchoolYearRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<DeleteSchoolYearHandler> logger,
        ICacheService cache)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _cache = cache;
    }

    public async Task<bool> Handle(
        DeleteSchoolYearCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Find
        var schoolYear = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (schoolYear == null)
            throw new Exception("SchoolYear not found");

        // 2. Delete
        await _repository.DeleteAsync(schoolYear, cancellationToken);

        // 3. Save
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        //  4. Invalidate cache
        await _cache.RemoveAsync("schoolyears:all");

        _logger.LogInformation("Deleted SchoolYear: {Id}", request.Id);

        return true;
    }
}