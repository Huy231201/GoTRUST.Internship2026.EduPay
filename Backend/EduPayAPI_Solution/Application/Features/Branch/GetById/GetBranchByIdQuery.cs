
namespace EduPayAPI.Application.Features.Branches.GetById;

public record GetBranchByIdQuery(Guid BranchId) : IRequest<BranchResponse>;