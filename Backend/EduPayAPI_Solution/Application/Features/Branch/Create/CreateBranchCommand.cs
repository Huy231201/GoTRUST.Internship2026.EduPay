

namespace EduPayAPI.Application.Features.Branches.Create;

public record CreateBranchCommand(
    Guid SchoolId,
    string Name,
    string Code,
    string Address,
    SchoolLevel? Level,
    string? TaxCode,
    string? Email,
    string? Phone,
    SchoolType? Type
) : IRequest<BranchResponse>;