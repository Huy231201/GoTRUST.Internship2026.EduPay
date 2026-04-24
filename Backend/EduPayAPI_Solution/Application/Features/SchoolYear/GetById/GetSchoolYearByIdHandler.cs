

namespace EduPayAPI.Application.Features.SchoolYears.GetById;

public class GetSchoolYearByIdHandler 
    : IRequestHandler<GetSchoolYearByIdQuery, SchoolYearResponse>
{
    private readonly ISchoolYearRepository _schoolYearRepository;

    public GetSchoolYearByIdHandler(ISchoolYearRepository schoolYearRepository)
    {
        _schoolYearRepository = schoolYearRepository;
    }

    public async Task<SchoolYearResponse> Handle(
        GetSchoolYearByIdQuery request,
        CancellationToken cancellationToken)
    {
        var schoolYear = await _schoolYearRepository
            .GetByIdAsync(request.SchoolYearId, cancellationToken);

        if (schoolYear == null)
            throw new NotFoundException("SchoolYear not found");

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