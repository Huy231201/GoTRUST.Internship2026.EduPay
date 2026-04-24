namespace EduPayAPI.API.DTOs.Report;

public class StudentReportRequest
{
    public Guid? BranchId{ get; set; }
    public Guid? SchoolYearId { get; set; }
    public Guid? GradeId { get; set; }
    public Guid? ClassId { get; set; }
    public int? Status { get; set; }
}