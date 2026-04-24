

namespace EduPayAPI.Infrastructure.Persistence.Configurations;

public class SchoolConfiguration : IEntityTypeConfiguration<School>
{
    public void Configure(EntityTypeBuilder<School> builder)
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

        // Level (enum)
        builder.Property(x => x.Level)
               .IsRequired()
               .HasConversion<int>();

        // TaxCode
        builder.Property(x => x.TaxCode)
               .IsRequired()
               .HasMaxLength(50);

        // Type (enum nullable)
        builder.Property(x => x.Type)
               .HasConversion<int>();

        // Optional fields
        builder.Property(x => x.Email)
               .HasMaxLength(200);

        builder.Property(x => x.Phone)
               .HasMaxLength(20);

        builder.Property(x => x.Website)
               .HasMaxLength(200);

        builder.Property(x => x.Principal)
               .HasMaxLength(200);

        builder.Property(x => x.Address)
               .HasMaxLength(500);

        builder.Property(x => x.CreatedAt)
               .IsRequired();

        // Quan hệ School - Branch
        builder.HasMany(x => x.Branches)
               .WithOne(b => b.School)
               .HasForeignKey(b => b.SchoolId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}