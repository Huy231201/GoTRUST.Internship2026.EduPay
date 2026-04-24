namespace EduPayAPI.Application.Features.Schools.Update;

public class UpdateMainSchoolHandler 
    : IRequestHandler<UpdateMainSchoolCommand, SchoolResponse>
{
    private readonly ISchoolRepository _schoolRepository;
    private readonly IBranchRepository _branchRepository; // thêm branch repo
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UpdateMainSchoolHandler> _logger;

    public UpdateMainSchoolHandler(
        ISchoolRepository schoolRepository,
        IBranchRepository branchRepository,  // inject
        IUnitOfWork unitOfWork,
        ILogger<UpdateMainSchoolHandler> logger)
    {
        _schoolRepository = schoolRepository;
        _branchRepository = branchRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<SchoolResponse> Handle(
        UpdateMainSchoolCommand request,
        CancellationToken cancellationToken)
    {
        // 1. Lấy school chính
        var school = await _schoolRepository.GetMainSchoolAsync(cancellationToken);
        if (school is null)
        {
            _logger.LogWarning("Main school not found");
            throw new NotFoundException("Main school not found");
        }

        // 2. Check trùng Code (chỉ khi thay đổi)
        if (!string.Equals(school.Code, request.Code, StringComparison.OrdinalIgnoreCase))
        {
            var isExist = await _schoolRepository.ExistsByCodeAsync(request.Code, cancellationToken);
            if (isExist)
            {
                _logger.LogWarning("School code already exists: {Code}", request.Code);
                throw new ConflictException("School code already exists");
            }
        }

        // 3. Update School
        school.Update(
            request.Name,
            request.Code,
            request.Level,
            request.TaxCode,
            request.Email,
            request.Phone,
            request.Website,
            request.Principal,
            request.Address,
            request.Type
        );

        await _schoolRepository.UpdateAsync(school, cancellationToken);

        // 4. Update Main Branch để đồng bộ với School chính
        var mainBranch = await _branchRepository.GetMainBranchBySchoolIdAsync(school.Id, cancellationToken);
        if (mainBranch != null)
        {
            mainBranch.Update(
                school.Name,
                school.Code,
                school.Address ?? "",
                school.Type,
                school.Level,
                school.Email,
                school.Phone,
                school.TaxCode
            );

            await _branchRepository.UpdateAsync(mainBranch, cancellationToken);
        }

        // 5. Save 1 lần qua UnitOfWork
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Main school and main branch updated: {Id}", school.Id);

        // 6. Return response
        return new SchoolResponse
        {
            Id = school.Id,
            Name = school.Name,
            Code = school.Code,
            Level = school.Level,
            TaxCode = school.TaxCode,
            Email = school.Email,
            Phone = school.Phone,
            Website = school.Website,
            Principal = school.Principal,
            Address = school.Address,
            Type = school.Type
        };
    }
}