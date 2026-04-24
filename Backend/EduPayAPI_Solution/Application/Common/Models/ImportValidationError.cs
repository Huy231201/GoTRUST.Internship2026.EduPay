namespace EduPayAPI.Application.Common.Models;

public class ImportValidationError
{
    public int Row { get; set; }
    public string Field { get; set; } = default!;
    public string Message { get; set; } = default!;
}
