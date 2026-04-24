namespace EduPayAPI.Application.Features.GlobalSearch;
public class SearchResponse
{
    public List<ClassItem> Classes { get; set; } = [];
    public List<StudentItem> Students { get; set; } = [];
    public List<TeacherItem> Teachers { get; set; } = [];
}

public class ClassItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
}

public class StudentItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string ClassName { get; set; } = default!;
}

public class TeacherItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
}