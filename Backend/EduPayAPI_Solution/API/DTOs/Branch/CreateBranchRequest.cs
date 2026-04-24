namespace EduPayAPI.API.DTOs.Branches;
public class CreateBranchRequest
{
    public Guid SchoolId { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Address { get; set; } = default!;

    public SchoolLevel? Level { get; set; }
    public string? TaxCode { get; set; }

    public string? Email { get; set; }
    public string? Phone { get; set; }
    public SchoolType? Type { get; set; }
}