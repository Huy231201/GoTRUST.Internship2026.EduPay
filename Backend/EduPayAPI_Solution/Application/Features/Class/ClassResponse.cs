namespace EduPayAPI.Application.Features.Classes;

public class ClassResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public string Code { get; set; } = default!;

    public Guid GradeId { get; set; }

    public string GradeName { get; set; } = default!;

    public Guid BranchId { get; set; }

    public string BranchName { get; set; } = default!;

    public bool IsMain { get; set; } 

    public Guid SchoolYearId { get; set; }
}