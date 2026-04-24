namespace EduPayAPI.API.DTOs.Class;
public class BulkCreateClassRequest
{
    public Guid GradeId { get; set; }

    public char StartLetter { get; set; }
    public char EndLetter { get; set; }

    public int StartNumber { get; set; }
    public int EndNumber { get; set; }
    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}