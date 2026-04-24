namespace EduPayAPI.API.DTOs.Grade;

public class CreateGradeRequest
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool Status { get; set; }
    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}