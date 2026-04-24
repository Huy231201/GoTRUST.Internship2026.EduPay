

namespace EduPayAPI.API.DTOs.Branches;

public record UpdateBranchRequest(
    string Name,
    string Code,
    string Address,
    SchoolLevel? Level,
    string? TaxCode,
    string? Email,
    string? Phone,
    SchoolType? Type
);