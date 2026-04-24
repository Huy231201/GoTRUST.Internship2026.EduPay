namespace EduPayAPI.Application.Features.Students.ImportStudent;
public class ImportStudentDto
{
    public string Code { get; set; } = default!;
    public string FullName { get; set; } = default!;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string Gender { get; set; } = default!;
    public string DateOfBirth { get; set; } = default!;
    public string ClassName { get; set; } = default!;
    public string Type { get; set; } = default!;
}