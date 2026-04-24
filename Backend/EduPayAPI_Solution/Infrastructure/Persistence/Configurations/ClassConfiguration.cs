public class ClassConfiguration : IEntityTypeConfiguration<Class>
{
    public void Configure(EntityTypeBuilder<Class> builder)
    {
        // Primary key
        builder.HasKey(x => x.Id);

        // Name
        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(50);

        // Grade
        builder.HasOne(x => x.Grade)
            .WithMany(g => g.Classes)
            .HasForeignKey(x => x.GradeId)
            .OnDelete(DeleteBehavior.Restrict);

        // SchoolYear
        builder.HasOne(x => x.SchoolYear)
            .WithMany(sy => sy.Classes)
            .HasForeignKey(x => x.SchoolYearId)
            .OnDelete(DeleteBehavior.Restrict);

        // Branch
        builder.HasOne(x => x.Branch)
            .WithMany(b => b.Classes)
            .HasForeignKey(x => x.BranchId)
            .OnDelete(DeleteBehavior.Restrict);

        // HomeroomTeacher (nullable)
        builder.HasOne(x => x.HomeroomTeacher)
            .WithMany()
            .HasForeignKey(x => x.HomeroomTeacherId)
            .OnDelete(DeleteBehavior.SetNull);

        // Unique constraint (tránh trùng lớp)
        builder.HasIndex(x => new { x.Name, x.SchoolYearId, x.BranchId })
            .IsUnique();
    }
}