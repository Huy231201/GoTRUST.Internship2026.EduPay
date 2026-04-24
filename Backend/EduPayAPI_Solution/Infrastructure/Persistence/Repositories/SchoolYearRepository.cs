

namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class SchoolYearRepository : ISchoolYearRepository
{
    private readonly AppDbContext _context;

    public SchoolYearRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(SchoolYear schoolYear, CancellationToken cancellationToken)
    {
        await _context.SchoolYears.AddAsync(schoolYear, cancellationToken);
    }

     public async Task<bool> ExistsByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.SchoolYears
            .AnyAsync(x => x.Name == name, cancellationToken);
    }

     public async Task<List<SchoolYear>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.SchoolYears
            .OrderByDescending(x => x.StartDate)
            .ToListAsync(cancellationToken);
    }

    // 🔍 Search (PostgreSQL chuẩn - không phân biệt hoa thường)
    public async Task<List<SchoolYear>> SearchAsync(string? search, CancellationToken cancellationToken)
    {
        var query = _context.SchoolYears.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.ILike(x.Name, $"%{search}%"));
        }

        return await query
            .OrderByDescending(x => x.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<SchoolYear?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.SchoolYears
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task DeleteAsync(SchoolYear schoolYear, CancellationToken cancellationToken)
    {
        _context.SchoolYears.Remove(schoolYear);
        return Task.CompletedTask;

    }
}