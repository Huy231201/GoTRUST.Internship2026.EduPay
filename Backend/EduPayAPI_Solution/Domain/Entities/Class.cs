namespace EduPayAPI.Domain.Entities;
public class Class
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;  

    public string Code {get; set; } = default!;
    public Guid GradeId { get; set; }
    public Grade Grade { get; set; } = default!;

    public Guid SchoolYearId { get; set; } 
    public Guid BranchId { get; set; }     

    // Giáo viên chủ nhiệm
    public Guid? HomeroomTeacherId { get; set; }

    // Navigation
    public Branch Branch { get; private set; } = default!;

    public SchoolYear SchoolYear { get; private set; } = default!;

    public Teacher? HomeroomTeacher { get; set; }
    
    public ICollection<Student> Students { get; private set; } = new List<Student>();

    // Constructor chính
     public Class(
        string name,
        string code,
        Guid gradeId,
        Guid schoolYearId,
        Guid branchId,
        Guid? homeroomTeacherId = null)
    {
        Id = Guid.NewGuid();

        Name = name;
        Code = code;
        GradeId = gradeId;
        SchoolYearId = schoolYearId;
        BranchId = branchId;

        HomeroomTeacherId = homeroomTeacherId;
    }
}