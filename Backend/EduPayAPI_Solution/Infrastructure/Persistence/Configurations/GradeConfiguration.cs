

namespace EduPayAPI.Infrastructure.Configurations;

public class GradeConfiguration : IEntityTypeConfiguration<Grade>
{
    public void Configure(EntityTypeBuilder<Grade> builder)
    {

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(255);

        builder.Property(x => x.Status)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        // 🔥 FK: Grade -> Branch
        builder.HasOne(x => x.Branch)
            .WithMany(b => b.Grades)
            .HasForeignKey(x => x.BranchId)
            .OnDelete(DeleteBehavior.Cascade);

           builder.HasOne(x => x.SchoolYear)
            .WithMany(b => b.Grades)
            .HasForeignKey(x => x.SchoolYearId)
            .OnDelete(DeleteBehavior.Cascade);


        // 🔥 Unique Name trong 1 Branch
        builder.HasIndex(x => new { x.Name, x.BranchId, x.SchoolYearId })
        .IsUnique();
    }
}