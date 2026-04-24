
namespace EduPayAPI.Application.Features.Grades.Delete;

public record DeleteGradeCommand(Guid Id) : IRequest<bool>;