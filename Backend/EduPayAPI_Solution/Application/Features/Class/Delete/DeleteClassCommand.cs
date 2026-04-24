namespace EduPayAPI.Application.Features.Classes.Delete;

public record DeleteClassCommand(Guid Id) : IRequest<bool>;
