
namespace EduPayAPI.Application.Features.Students.Delete;

public record DeleteStudentCommand(Guid Id) : IRequest<bool>;