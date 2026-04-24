

namespace EduPayAPI.Application.Features.Schools.Update;

public record UpdateMainSchoolCommand(
    string Name,
    string Code,
    SchoolLevel Level,
    string TaxCode,
    string? Email,
    string? Phone,
    string? Website,
    string? Principal,
    string? Address,
    SchoolType? Type
) : IRequest<SchoolResponse>;