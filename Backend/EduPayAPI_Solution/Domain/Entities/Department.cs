
namespace EduPayAPI.Domain.Entities;

public class Department
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
}