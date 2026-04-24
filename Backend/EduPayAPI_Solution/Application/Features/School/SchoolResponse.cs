

namespace EduPayAPI.Application.Features.Schools;

public class SchoolResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;
    public SchoolLevel Level { get; init; }
    public string TaxCode { get; init; } = default!;
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Website { get; init; }
    public string? Principal { get; init; }
    public string? Address { get; init; }
    public SchoolType? Type { get; init; }
}