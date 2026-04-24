

namespace EduPayAPI.Application.Features.Schools.GetMainSchool;

public class GetMainSchoolHandler : IRequestHandler<GetMainSchoolQuery, SchoolResponse>
{
    private readonly ISchoolRepository _schoolRepository;
    private readonly ILogger<GetMainSchoolHandler> _logger;

    public GetMainSchoolHandler(ISchoolRepository schoolRepository, ILogger<GetMainSchoolHandler> logger)
    {
        _schoolRepository = schoolRepository;
        _logger = logger;
    }

    public async Task<SchoolResponse> Handle(GetMainSchoolQuery request, CancellationToken cancellationToken)
    {
        var school = await _schoolRepository.GetMainSchoolAsync(cancellationToken);

        if (school is null)
        {
            _logger.LogWarning("No main school found");
            throw new NotFoundException("Main school not found");
        }

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