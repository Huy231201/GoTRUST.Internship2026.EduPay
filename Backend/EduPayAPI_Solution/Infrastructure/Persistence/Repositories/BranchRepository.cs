
namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class BranchRepository : IBranchRepository
{
    private readonly AppDbContext _context;

    public BranchRepository(AppDbContext context)
    {
        _context = context;
    }


    public async Task<bool> ExistsByCodeAsync(
    Guid schoolId,
    string code,
    Guid? excludeId,
    CancellationToken cancellationToken)
    {
        var normalized = code.Trim().ToLower();

        return await _context.Branches.AnyAsync(x =>
            x.SchoolId == schoolId &&
            x.Code.Trim().ToLower() == normalized &&
            (!excludeId.HasValue || x.Id != excludeId),
            cancellationToken
        );
    }

    public async Task<bool> ExistsByNameAsync(
        Guid schoolId,
        string name,
        Guid? excludeId,
        CancellationToken cancellationToken)
    {
        var normalized = name.Trim().ToLower();

        return await _context.Branches.AnyAsync(x =>
            x.SchoolId == schoolId &&
            x.Name.Trim().ToLower() == normalized &&
            (!excludeId.HasValue || x.Id != excludeId),
            cancellationToken
        );
    }

    public async Task AddAsync(Branch branch, CancellationToken cancellationToken)
    {
        await _context.Branches.AddAsync(branch, cancellationToken);
    }

    public async Task<Branch?> GetMainBranchBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken)
    {
        return await _context.Branches
            .FirstOrDefaultAsync(b => b.SchoolId == schoolId && b.IsMain, cancellationToken);
    }

    public async Task UpdateAsync(Branch branch, CancellationToken cancellationToken)
    {
        _context.Branches.Update(branch);
    }

    public async Task<List<Branch>> GetBySchoolIdAsync(Guid schoolId, CancellationToken cancellationToken)
    {
        return await _context.Branches
            .Where(b => b.SchoolId == schoolId)
            .OrderByDescending(b => b.IsMain) // optional: đưa main branch lên đầu
            .ToListAsync(cancellationToken);
    }

    public async Task<Branch?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Branches
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task DeleteAsync(Branch branch, CancellationToken cancellationToken)
    {
        _context.Branches.Remove(branch);
        await Task.CompletedTask;
    }
}