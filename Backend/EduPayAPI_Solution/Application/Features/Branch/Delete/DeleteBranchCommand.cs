namespace EduPayAPI.Application.Features.Branches.Delete;  
public record DeleteBranchCommand(Guid BranchId) : IRequest;