namespace EduPayAPI.API.DTOs.ImportStudent;

public class ImportStudentRequest
{
    public IFormFile File { get; set; } = default!;
    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}