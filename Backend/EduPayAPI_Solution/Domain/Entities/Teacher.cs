namespace EduPayAPI.Domain.Entities;
public class Teacher
{
    public Guid Id { get; private set; }

    public string Code { get; private set; } = default!;
    public string Name { get; private set; } = default!;

    public string Email { get; private set; } = default!;
    public string? PhoneNumber { get; private set; }

    public TeacherStatus Status { get; private set; }

    

    public Guid BranchId { get; set; }
    public Guid SchoolYearId { get; set; }
    public Guid? DepartmentId { get; set; }

    // Navigation
    public Branch Branch { get; private set; } = default!;

    public SchoolYear SchoolYear { get; private set; } = default!;

    public Department? Department { get; private set; }

    protected Teacher() {}

     public Teacher(
        string code,
        string name,
        Guid branchId,
        Guid schoolYearId,
        string email,
        string? phoneNumber,
        Guid? departmentId = null)
    {
        Id = Guid.NewGuid();
        Code = code;
        Name = name;
        BranchId = branchId;
        SchoolYearId = schoolYearId;
        DepartmentId = departmentId;
        Email = email;
        PhoneNumber = phoneNumber;
        Status = TeacherStatus.Working;
    }

    public void Update (
        string code, 
        string name,
        string email,
        string? phoneNumber,
        TeacherStatus status
    )
    {
        Code = code;
        Name = name;
        Email = email;
        PhoneNumber = phoneNumber;
        Status = status;
    }
}