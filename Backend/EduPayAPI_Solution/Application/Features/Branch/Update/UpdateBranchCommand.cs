

namespace EduPayAPI.Application.Features.Branches.Update;


public record UpdateBranchCommand(
    [property: JsonIgnore] Guid Id,
    string Name,
    string Code,
    string Address,
    SchoolLevel? Level,
    string? TaxCode,
    string? Email,
    string? Phone,
    SchoolType? Type
) : IRequest<BranchResponse>;