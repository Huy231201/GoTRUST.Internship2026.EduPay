namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students");

        // ===== Key =====
        builder.HasKey(x => x.Id);

        // ===== Required fields =====
        builder.Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.FullName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(x => x.Gender)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(x => x.DateOfBirth)
            .IsRequired();

        builder.Property(x => x.ClassId)
            .IsRequired();

        builder.Property(x => x.Type)
            .IsRequired();

        builder.Property(x => x.BranchId)
            .IsRequired();

        builder.Property(x => x.SchoolYearId)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired();

        // ===== Optional =====
        builder.Property(x => x.Email)
            .HasMaxLength(255);

        builder.Property(x => x.PhoneNumber)
            .HasMaxLength(20);

        // ===== Relationships =====
        builder.HasOne(x => x.Class)
            .WithMany(c => c.Students) 
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Branch)
            .WithMany(b => b.Students)
            .HasForeignKey(x => x.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.SchoolYear)
            .WithMany(s => s.Students)
            .HasForeignKey(x => x.SchoolYearId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===== Index (nên có) =====
        builder.HasIndex(x => x.Code)
            .IsUnique();

        builder.HasIndex(x => new { x.BranchId, x.SchoolYearId });

        builder.HasIndex(x => x.ClassId);
    }
}