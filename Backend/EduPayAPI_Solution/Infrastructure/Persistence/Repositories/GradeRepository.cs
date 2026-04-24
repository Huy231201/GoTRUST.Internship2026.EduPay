namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class GradeRepository : IGradeRepository
{
    private readonly AppDbContext _context;

    public GradeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Grade grade, CancellationToken cancellationToken)
    {
        await _context.Grades.AddAsync(grade, cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(
        string name,
        Guid branchId,
        Guid schoolYearId,
        CancellationToken cancellationToken)
    {
        return await _context.Grades.AnyAsync(x =>
            x.Name == name &&
            x.BranchId == branchId &&
            x.SchoolYearId == schoolYearId,
            cancellationToken);
    }

    public async Task<List<Grade>> GetAllAsync(
        string? search,
        bool? status,
        Guid? branchId,
        Guid? schoolYearId,
        CancellationToken cancellationToken)
    {
        var query = _context.Grades
            .AsNoTracking()
            .AsQueryable();

        // 🔍 Search (chuẩn PostgreSQL)
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.ILike(x.Name, $"%{search}%") ||
                (x.Description != null &&
                 EF.Functions.ILike(x.Description, $"%{search}%"))
            );
        }

        // Status
        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        // Branch
        if (branchId.HasValue && branchId != Guid.Empty)
        {
            query = query.Where(x => x.BranchId == branchId.Value);
        }

        // SchoolYear
        if (schoolYearId.HasValue && schoolYearId != Guid.Empty)
        {
            query = query.Where(x => x.SchoolYearId == schoolYearId.Value);
        }

        return await query
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Grade?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Grades
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public Task DeleteAsync(Grade grade, CancellationToken cancellationToken)
    {
        _context.Grades.Remove(grade);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Grade grade, CancellationToken cancellationToken)
    {
        _context.Grades.Update(grade);
        return Task.CompletedTask;
    }

    public async Task<List<Grade>> GetByBranchAndYearAsync(
    Guid branchId,
    Guid schoolYearId,
    CancellationToken cancellationToken)
{
    return await _context.Grades
        .Where(g => g.BranchId == branchId 
                 && g.SchoolYearId == schoolYearId
                 && g.Status == true) // nếu có status
        .ToListAsync(cancellationToken);
}
}