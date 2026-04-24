namespace EduPayAPI.Domain.Entities;

public class Grade
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }

    public bool Status { get; private set; } // true = hoạt động

    public Guid BranchId { get; private set; }
    public Guid SchoolYearId {get; private set; }

    public DateTime CreatedAt { get; private set; }

    // Navigation
    public Branch Branch { get; private set; } = default!;

    public SchoolYear SchoolYear { get; private set; } = default!;

    // Navigation
    public ICollection<Class> Classes { get; private set; } = new List<Class>();


    protected Grade() { }

    public Grade(string name, string? description, bool status, Guid branchId, Guid schoolYearId)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        Status = status;
        BranchId = branchId;
        SchoolYearId = schoolYearId;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, string? description, bool status)
    {
        Name = name;
        Description = description;
        Status = status;
    }
}