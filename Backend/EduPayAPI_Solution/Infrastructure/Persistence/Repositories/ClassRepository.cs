namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class ClassRepository : IClassRepository
{
    private readonly AppDbContext _context;

    public ClassRepository(AppDbContext context)
    {
        _context = context;
    }

    // 🔹 Get list (filter + search)
    public async Task<List<Class>> GetListAsync(
    Guid? schoolYearId,
    Guid? branchId,
    Guid? gradeId,
    string? search,
    CancellationToken ct)
    {
        var query = _context.Classes
            .AsNoTracking()
            .Include(x => x.Grade)
            .Include(x => x.Branch)
            .Include(x => x.SchoolYear)
            .Include(x => x.HomeroomTeacher)
            .AsQueryable();

        // 🔹 filter schoolYear (optional)
        if (schoolYearId.HasValue && schoolYearId != Guid.Empty)
        {
            query = query.Where(x => x.SchoolYearId == schoolYearId.Value);
        }

        // 🔹 filter branch (optional)
        if (branchId.HasValue && branchId != Guid.Empty)
        {
            query = query.Where(x => x.BranchId == branchId.Value);
        }

        // 🔹 filter grade
        if (gradeId.HasValue && gradeId != Guid.Empty)
        {
            query = query.Where(x => x.GradeId == gradeId.Value);
        }

        // 🔍 Search
        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = $"%{search.Trim()}%";

            query = query.Where(x =>
                EF.Functions.ILike(x.Name, keyword) ||

                (x.HomeroomTeacher != null &&
                 EF.Functions.ILike(x.HomeroomTeacher.Name, keyword)) ||

                EF.Functions.ILike(x.Grade.Name, keyword)
            );
        }

        return await query
            .OrderBy(x => x.Name)
            .ToListAsync(ct);
    }
    // 🔹 Get by id
    public async Task<Class?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Classes
            .AsNoTracking() // ✅ thêm
            .Include(x => x.Grade)
            .Include(x => x.Branch)
            .Include(x => x.SchoolYear)
            .Include(x => x.HomeroomTeacher)
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    // 🔹 Check tồn tại
    public async Task<bool> ExistsAsync(
        string name,
        Guid schoolYearId,
        Guid branchId,
        CancellationToken ct)
    {
        return await _context.Classes.AnyAsync(x =>
            x.Name == name &&
            x.SchoolYearId == schoolYearId &&
            x.BranchId == branchId, ct);
    }

    // 🔹 Bulk check
    public async Task<List<string>> GetExistingClassNamesAsync(
        Guid schoolYearId,
        Guid branchId,
        CancellationToken ct)
    {
        return await _context.Classes
            .Where(x => x.SchoolYearId == schoolYearId &&
                        x.BranchId == branchId)
            .Select(x => x.Name)
            .ToListAsync(ct);
    }

    // 🔹 Create 1
    public async Task AddAsync(Class entity, CancellationToken ct)
    {
        await _context.Classes.AddAsync(entity, ct);
    }

    // 🔹 Create nhiều
    public async Task AddRangeAsync(List<Class> classes, CancellationToken ct)
    {
        await _context.Classes.AddRangeAsync(classes, ct);
    }

    // 🔹 Delete
    public Task DeleteAsync(Class entity, CancellationToken ct)
    {
        _context.Classes.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task<List<string>> GetExistingCodesAsync(
    List<string> codes,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct)
    {
        return await _context.Classes
            .Where(x => codes.Contains(x.Code.ToLower())
                     && x.BranchId == branchId
                     && x.SchoolYearId == schoolYearId)
            .Select(x => x.Code.ToLower())
            .ToListAsync(ct);
    }

    public async Task<List<string>> GetExistingNamesAsync(
    List<string> names,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct)
    {
        return await _context.Classes
            .Where(x => names.Contains(x.Name.ToLower())
                     && x.BranchId == branchId
                     && x.SchoolYearId == schoolYearId)
            .Select(x => x.Name.ToLower())
            .ToListAsync(ct);
    }

    public async Task<List<Class>> GetByBranchAndYearAsync(
        Guid branchId,
        Guid schoolYearId,
        CancellationToken cancellationToken)
    {
        return await _context.Classes
            .Where(x =>
                x.BranchId == branchId &&
                x.SchoolYearId == schoolYearId)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Class>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct)
    {
        var query = _context.Classes
            .Include(x => x.Grade)
            .Include(x => x.Branch)
            .AsQueryable();

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