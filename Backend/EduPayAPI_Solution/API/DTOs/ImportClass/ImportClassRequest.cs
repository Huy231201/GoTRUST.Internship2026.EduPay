namespace EduPayAPI.API.DTOs.ImportClass;
public class ImportClassRequest
{
    public IFormFile File { get; set; } = default!;
    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
}