namespace EduPayAPI.Application.Features.Branches;

public class BranchResponse
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;
    public string Address { get; init; } = default!;
    public bool IsMain { get; set; }
    public SchoolLevel? Level { get; init; }
    
    public string? TaxCode { get; init; } 
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public SchoolType? Type { get; init; }
}