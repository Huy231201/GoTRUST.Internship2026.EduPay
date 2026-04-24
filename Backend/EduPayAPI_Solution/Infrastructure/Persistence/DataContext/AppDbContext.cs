

namespace EduPayAPI.Infrastructure.Persistence;

// DbContext: Lớp quan trọng nhất của EF Core, đại diện cho một phiên làm việc với Database
public class AppDbContext : DbContext  
{
    // Constructor: Nhận các cấu hình (chuỗi kết nối, loại DB) từ Program.cs
    // base(options): Chuyển các cấu hình này lên lớp cha (DbContext) để xử lý
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<School> Schools => Set<School>();
    public DbSet<Branch> Branches => Set<Branch>();

    public DbSet<SchoolYear> SchoolYears => Set<SchoolYear>();

    public DbSet<Grade> Grades => Set<Grade>();

    public DbSet<Class> Classes => Set<Class>();

    public DbSet<Teacher> Teachers => Set<Teacher>();

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<Student> Students => Set<Student>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    // OnModelCreating: Hàm chạy khi EF Core khởi tạo cấu trúc các bảng
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // base.OnModelCreating: Gọi hàm gốc của lớp DbContext (lớp cha)
        // Việc này đảm bảo các cấu hình mặc định, quan trọng của hệ thống vẫn được thực thi
        // Nếu xóa dòng này, một số tính năng mặc định của EF Core có thể bị lỗi
        base.OnModelCreating(modelBuilder);

        // Tự động tìm file cấu hình (như CustomerConfiguration)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
