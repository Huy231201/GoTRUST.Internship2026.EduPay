namespace EduPayAPI.Application.Features.Grades;

public class GradeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool Status { get; set; }
    public Guid BranchId { get; set; }
    public Guid SchoolYearId {get; set;}
}