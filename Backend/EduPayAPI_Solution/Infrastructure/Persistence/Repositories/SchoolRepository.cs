

namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class SchoolRepository : ISchoolRepository
{
    private readonly AppDbContext _context;

    public SchoolRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return await _context.Schools
            .AnyAsync(x => x.Code == code, cancellationToken);
    }

    public async Task AddAsync(School school, CancellationToken cancellationToken)
    {
        await _context.Schools.AddAsync(school, cancellationToken);
    }

    public async Task<School?> GetMainSchoolAsync(CancellationToken cancellationToken)
    {
        return await _context.Schools.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task UpdateAsync(School school, CancellationToken cancellationToken)
    {
        _context.Schools.Update(school);
    }

    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Schools
            .AnyAsync(x => x.Id == id, cancellationToken);
    }
}