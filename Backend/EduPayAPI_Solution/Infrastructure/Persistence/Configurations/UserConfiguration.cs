namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        // Account
        builder.Property(x => x.Account)
               .IsRequired()
               .HasMaxLength(200);

        builder.HasIndex(x => x.Account)
               .IsUnique();

        // Password
        builder.Property(x => x.Password)
               .IsRequired();

        // FullName
        builder.Property(x => x.FullName)
               .IsRequired()
               .HasMaxLength(200);

        // Role (enum)
        builder.Property(x => x.Role)
               .IsRequired()
               .HasConversion<int>();

        // 🔥 SchoolId (bắt buộc)
        builder.Property(x => x.SchoolId)
               .IsRequired();

        // 🔥 Quan hệ User - School (n:1)
        builder.HasOne(x => x.School)
               .WithMany(s => s.Users)
               .HasForeignKey(x => x.SchoolId)
               .OnDelete(DeleteBehavior.Restrict);

        // CreatedAt
        builder.Property(x => x.CreatedAt)
               .IsRequired();
    }
}
