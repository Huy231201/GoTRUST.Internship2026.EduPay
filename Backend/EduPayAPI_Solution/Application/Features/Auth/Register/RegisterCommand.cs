

namespace EduPayAPI.Application.Features.Auth.Register;

public record RegisterCommand(
    // 🔐 User
    string Account,
    string Password,
    string FullName,

    // 🏫 School
    SchoolCommand School

) : IRequest<RegisterResponse>;

public record SchoolCommand(
    // required
    string Name,
    string Code,
    SchoolLevel Level,
    string TaxCode,

    // optional
    string? Email,
    string? Phone,
    string? Website,
    string? Principal,
    string? Address,
    SchoolType? Type
);