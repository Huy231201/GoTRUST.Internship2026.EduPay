
namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class TeacherRepository : ITeacherRepository
{
    private readonly AppDbContext _context;

    public TeacherRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Teacher teacher, CancellationToken cancellationToken)
    {
        await _context.Teachers.AddAsync(teacher, cancellationToken);
    }

    public async Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return await _context.Teachers
            .AnyAsync(x => x.Code == code, cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken)
    {
        return await _context.Teachers
            .AnyAsync(x => x.Email == email, cancellationToken);
    }

    public async Task<Teacher?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Teachers
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task DeleteAsync(Teacher teacher, CancellationToken cancellationToken)
    {
        _context.Teachers.Remove(teacher);
        await Task.CompletedTask;
    }

    public async Task<List<Teacher>> GetAllAsync(
    Guid? branchId,
    Guid? schoolYearId,
    string? search,
    TeacherStatus? status,
    Guid? departmentId,
    CancellationToken cancellationToken)
    {
        var query = _context.Teachers.AsQueryable();

        //  Filter Branch
        if (branchId.HasValue)
            query = query.Where(x => x.BranchId == branchId.Value);

        //  Filter SchoolYear
        if (schoolYearId.HasValue)
            query = query.Where(x => x.SchoolYearId == schoolYearId.Value);

        //  Search (Code + Name) - PostgreSQL ILike
        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim().ToLower();

            query = query.Where(x =>
                EF.Functions.ILike(x.Code, $"%{keyword}%") ||
                EF.Functions.ILike(x.Name, $"%{keyword}%"));
        }

        //  Filter Status
        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        //  Filter Department
        if (departmentId.HasValue)
            query = query.Where(x => x.DepartmentId == departmentId.Value);

        return await query
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Teacher>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct)
    {
        var query = _context.Teachers.AsQueryable();

        if (branchId.HasValue)
            query = query.Where(x => x.BranchId == branchId);

        if (schoolYearId.HasValue)
            query = query.Where(x => x.SchoolYearId == schoolYearId);

        query = query.Where(x =>
            EF.Functions.ILike(x.Name, $"%{keyword}%") ||
            EF.Functions.ILike(x.Code, $"%{keyword}%"));

        return await query
            .Take(5)
            .ToListAsync(ct);
    }
}