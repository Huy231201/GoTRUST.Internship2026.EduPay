namespace EduPayAPI.Application.Features.Branches.GetAll;

public record GetAllBranchQuery(Guid SchoolId) : IRequest<List<BranchResponse>>;