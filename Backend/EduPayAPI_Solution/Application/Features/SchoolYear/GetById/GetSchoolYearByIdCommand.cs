namespace EduPayAPI.Application.Features.SchoolYears.GetById;

public record GetSchoolYearByIdQuery(Guid SchoolYearId) 
    : IRequest<SchoolYearResponse>;