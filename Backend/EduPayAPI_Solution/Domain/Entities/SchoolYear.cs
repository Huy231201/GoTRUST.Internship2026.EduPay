namespace EduPayAPI.Domain.Entities;

public class SchoolYear
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = default!; // tên năm học, ví dụ: "2023-2024"
    public DateOnly StartDate { get; private set; } = default!;// ngày bắt đầu năm

    public DateOnly EndDate { get; private set; } = default!; // ngày kết thúc năm học

    public string? Description { get; private set; } // mô tả thêm về năm học

     public ICollection<Grade> Grades { get; set; } = new List<Grade>();

      // navigation
    public ICollection<Class> Classes { get; set; } = new List<Class>();
    public ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
    public ICollection<Student> Students { get; private set; } = new List<Student>();


    protected SchoolYear () {}

    public SchoolYear(string name, DateOnly startDate, DateOnly endDate, string? description)
    {
            Id = Guid.NewGuid();
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            Description = description;
    }

    public void Update(string name, DateOnly startDate, DateOnly endDate, string? description)
    {
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            Description = description;

    }
}