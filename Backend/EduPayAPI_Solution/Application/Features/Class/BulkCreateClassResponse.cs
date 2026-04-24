namespace EduPayAPI.Application.Features.Classes;
public class BulkCreateClassResponse
{
    public int CreatedCount { get; set; }

    public List<string> CreatedClassNames { get; set; } = [];

    public List<string> SkippedClassNames { get; set; } = [];
}