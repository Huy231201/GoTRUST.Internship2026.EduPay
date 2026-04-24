namespace EduPayAPI.Application.Features.Report;

public class StudentReportDto
{
    public string BranchName { get; set; } = default!;
    public string GradeName { get; set; } = default!;
    public string ClassCode { get; set; } = default!;

    public string StudentCode { get; set; } = default!;
    public string FullName { get; set; } = default!;

    public DateOnly DateOfBirth { get; set; }

    public string Gender { get; set; } = default!;
    public string ParentName { get; set; } = "";

    public string PhoneNumber { get; set; } = "";

    public string Address { get; set; } = "";
    public string Status { get; set; } = default!;
    
    public string FilterText { get; set; } = "";
}