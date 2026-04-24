

namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class SchoolYearConfiguration : IEntityTypeConfiguration<SchoolYear>
{
    public void Configure(EntityTypeBuilder<SchoolYear> builder)
    {
        builder.HasKey(x => x.Id);

        // Name (ví dụ: "2025-2026")
        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(20);

        builder.HasIndex(x => x.Name)
               .IsUnique();

        // StartDate
        builder.Property(x => x.StartDate)
               .IsRequired();

        // EndDate
        builder.Property(x => x.EndDate)
               .IsRequired();

        // Description
        builder.Property(x => x.Description)
               .HasMaxLength(500);
    }
}