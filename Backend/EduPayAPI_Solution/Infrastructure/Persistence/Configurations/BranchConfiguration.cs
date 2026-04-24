

namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.HasKey(x => x.Id);

        // Code (8 số)
        builder.Property(x => x.Code)
               .IsRequired()
               .HasMaxLength(8);

        builder.HasIndex(x => x.Code)
               .IsUnique();

        // Name
        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(255);

        // Address (bắt buộc)
        builder.Property(x => x.Address)
               .IsRequired()
               .HasMaxLength(500);

        // Optional
        builder.Property(x => x.Email)
               .HasMaxLength(200);

        builder.Property(x => x.Phone)
               .HasMaxLength(20);

        builder.Property(x => x.TaxCode)
               .HasMaxLength(50);

        // Enum
        builder.Property(x => x.Type)
               .HasConversion<int>();

        builder.Property(x => x.Level)
               .HasConversion<int>();

        // IsMain
        builder.Property(x => x.IsMain)
               .IsRequired();

        builder.Property(x => x.CreatedAt)
               .IsRequired();

        // 🔥 Quan hệ Branch - School
        builder.HasOne(x => x.School)
               .WithMany(s => s.Branches)
               .HasForeignKey(x => x.SchoolId)
               .OnDelete(DeleteBehavior.Cascade);

        // 🔥 Unique Code trong cùng School (best practice)
        builder.HasIndex(x => new { x.Code, x.SchoolId })
               .IsUnique();

        // 🔥 Chỉ 1 chi nhánh chính / school
        builder.HasIndex(x => new { x.SchoolId, x.IsMain })
       .HasFilter("\"IsMain\" = true") // Dùng dấu ngoặc kép cho tên cột và 'true' cho kiểu boolean
       .IsUnique();
    }
}