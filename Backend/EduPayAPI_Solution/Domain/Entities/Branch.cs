namespace EduPayAPI.Domain.Entities;

public class Branch
{
    public Guid Id { get; private set; }
    public Guid SchoolId { get; private set; }

    // Bắt buộc
    public string Name { get; private set; } = default!;
    public string Code { get; private set; } = default!;
    public string Address { get; private set; } = default!;

    // Có thể null
    public string? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? TaxCode { get; private set; }

    public SchoolType? Type { get; private set; }
    public SchoolLevel? Level { get; private set; }

    // 🔥 Quan trọng
    public bool IsMain { get; private set; } // chi nhánh chính

    public DateTime CreatedAt { get; private set; }

    // Navigation
    public School School { get; private set; } = default!;

    public ICollection<Grade> Grades { get; set; } = new List<Grade>();
    public ICollection<Class> Classes { get; set; } = new List<Class>();
    public ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();
    public ICollection<Student> Students { get; private set; } = new List<Student>();

    protected Branch() { }

    public Branch(
        Guid schoolId,
        string name,
        string code,
        string address,
        bool isMain,
        SchoolType? type,
        SchoolLevel? level,
        string? email,
        string? phone,
        string? taxCode
    )
    {
        Id = Guid.NewGuid();
        SchoolId = schoolId;

        Name = name;
        Code = code;
        Address = address;

        IsMain = isMain;

        Type = type;
        Level = level;
        Email = email;
        Phone = phone;
        TaxCode = taxCode;

        CreatedAt = DateTime.UtcNow;
    }

    public void Update(
        string name,
        string code,
        string address,
        SchoolType? type,
        SchoolLevel? level,
        string? email,
        string? phone,
        string? taxCode

    )
    {
        Name = name;
        Code = code;
        Address = address;
        Type = type;
        Level = level;
        Email = email;
        Phone = phone;
        TaxCode = taxCode;
    }
}