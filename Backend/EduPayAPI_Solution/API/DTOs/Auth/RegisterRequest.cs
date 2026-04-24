

namespace EduPayAPI.API.DTOs.Auth;

public record RegisterRequest(
    string Account,
    string Password,
    string FullName,
    SchoolRequest School
);

public record SchoolRequest(
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
);