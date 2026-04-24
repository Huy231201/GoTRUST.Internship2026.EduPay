namespace EduPayAPI.Application.Features.SchoolYears.Delete;

public record DeleteSchoolYearCommand(Guid Id) : IRequest<bool>;