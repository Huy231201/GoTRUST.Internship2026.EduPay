namespace EduPayAPI.Domain.Entities;

public class Student
{
    public Guid Id { get; private set; }

    // ===== Required (*) =====
    public string Code { get; private set; } = default!;

    public string FullName { get; private set; } = default!;

    public Gender Gender { get; private set; }

    public DateOnly DateOfBirth { get; private set; }

    public Guid ClassId { get; private set; }

    public StudentType Type { get; private set; }

    public Guid BranchId { get; private set; }

    public Guid SchoolYearId { get; private set; }

    // ===== Status =====
    public StudentStatus Status { get; private set; }

    // ===== Optional =====
    public string? Email { get; private set; }

    public string? PhoneNumber { get; private set; }

    // ===== Navigation =====
    public Class Class { get; private set; } = default!;

    public Branch Branch { get; private set; } = default!;

    public SchoolYear SchoolYear { get; private set; } = default!;

    protected Student() { }

    public Student(
        string code,
        string fullName,
        Gender gender,
        DateOnly dateOfBirth,
        Guid classId,
        StudentType type,
        Guid branchId,
        Guid schoolYearId,
        string? email,
        string? phoneNumber
    )
    {
        Id = Guid.NewGuid();
        Code = code;
        FullName = fullName;
        Gender = gender;
        DateOfBirth = dateOfBirth;
        ClassId = classId;
        Type = type; 
        BranchId = branchId;
        SchoolYearId = schoolYearId;
        Email = email;
        PhoneNumber = phoneNumber;
        Status = StudentStatus.Studying;
    }

    public void Update(
        string code,
        string fullName,
        Gender gender,
        DateOnly dateOfBirth,
        Guid classId,
        StudentType type, 
        string? email,
        string? phoneNumber,
        StudentStatus status
    )
    {
        Code = code;
        FullName = fullName;
        Gender = gender;
        DateOfBirth = dateOfBirth;
        ClassId = classId;
        Type = type; 
        Email = email;
        PhoneNumber = phoneNumber;
        Status = status;
    }
}