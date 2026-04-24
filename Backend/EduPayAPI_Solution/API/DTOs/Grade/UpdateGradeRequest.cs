namespace EduPayAPI.API.DTOs.Grade;

public class UpdateGradeRequest
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool Status { get; set; }
}