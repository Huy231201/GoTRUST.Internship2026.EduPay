namespace EduPayAPI.Domain.Entities;

public class School
{
    public Guid Id { get; private set; }

    // Bắt buộc
    public string Name { get; private set; } = default!;
    public string Code { get; private set; } = default!; // mã trường
    public SchoolLevel Level { get; private set; } = default!; // cấp học
    public string TaxCode { get; private set; } = default!; // mã số thuế

    // Có thể null
    public string? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? Website { get; private set; }
    public string? Principal { get; private set; } // hiệu trưởng
    public string? Address { get; private set; }
    public SchoolType? Type { get; private set; } // loại hình

    public DateTime CreatedAt { get; private set; }

    // Quan hệ
    public ICollection<User> Users { get; private set; } = new List<User>();
    public ICollection<Branch> Branches { get; private set; } = new List<Branch>();

    protected School() { }

    public School(
        string name,
        string code,
        SchoolLevel level,
        string taxCode,
        string? email,
        string? phone,
        string? website,
        string? principal,
        string? address,
        SchoolType? type
    )
    {
        Id = Guid.NewGuid();
        Name = name;
        Code = code;
        Level = level;
        TaxCode = taxCode;

        Email = email;
        Phone = phone;
        Website = website;
        Principal = principal;
        Address = address;
        Type = type;

        CreatedAt = DateTime.UtcNow;
    }


    public void Update(
    string name,
    string code,
    SchoolLevel level,
    string taxCode,
    string? email,
    string? phone,
    string? website,
    string? principal,
    string? address,
    SchoolType? type)
    {
        Name = name;
        Code = code;
        Level = level;
        TaxCode = taxCode;
        Email = email;
        Phone = phone;
        Website = website;
        Principal = principal;
        Address = address;
        Type = type;
    }
}