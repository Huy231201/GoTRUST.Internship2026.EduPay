
namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class TeacherConfiguration : IEntityTypeConfiguration<Teacher>
{
    public void Configure(EntityTypeBuilder<Teacher> builder)
    {

        // Primary key
        builder.HasKey(x => x.Id);

        // Properties
        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(x => x.Status)
            .IsRequired();

        // Index (thường cần cho search / unique)
        builder.HasIndex(x => x.Code)
            .IsUnique();

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.BranchId)
            .IsRequired();

        builder.Property(x => x.SchoolYearId)
            .IsRequired();

        builder.Property(x => x.DepartmentId)
            .IsRequired(false);

        // Relationships

        // Teacher - Branch (many-to-one)
        builder.HasOne(x => x.Branch)
            .WithMany(c => c.Teachers)
            .HasForeignKey(x => x.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        // Teacher - SchoolYear (many-to-one)
        builder.HasOne(x => x.SchoolYear)
            .WithMany(c => c.Teachers)
            .HasForeignKey(x => x.SchoolYearId)
            .OnDelete(DeleteBehavior.Restrict);

        // Teacher - Department (optional)
        builder.HasOne(x => x.Department)
            .WithMany(c => c.Teachers)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => new { x.Code, x.BranchId, x.SchoolYearId })
        .IsUnique();
    }
}