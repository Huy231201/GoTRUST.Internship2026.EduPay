

using EduPayAPI.Application.Features.Report;

namespace EduPayAPI.Infrastructure.Persistence.Repositories;

public class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _context;

    public StudentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Student student, CancellationToken cancellationToken)
    {
        await _context.Students.AddAsync(student, cancellationToken);
    }

    public async Task<Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Students
            .Include(x => x.Class)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<bool> ExistsByCodeAsync(string code, CancellationToken cancellationToken)
    {
        return await _context.Students
            .AnyAsync(x => x.Code == code, cancellationToken);
    }

    public Task DeleteAsync(Student student, CancellationToken cancellationToken)
    {
        _context.Students.Remove(student);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Student student, CancellationToken cancellationToken)
    {
        _context.Students.Update(student);
        return Task.CompletedTask;
    }

    public async Task<List<Student>> GetAllAsync(
    string? search,
    StudentStatus? status,
    Guid? classId,
    Guid? branchId,
    Guid? schoolYearId,
    CancellationToken cancellationToken)
    {
        var query = _context.Students
            .AsNoTracking()
            .Include(x => x.Class)
            .AsQueryable();

        // 🔍 Search (PostgreSQL - ILIKE)
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x =>
                EF.Functions.ILike(x.Code, $"%{search}%") ||
                EF.Functions.ILike(x.FullName, $"%{search}%")
            );
        }

        // Status
        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        // Class
        if (classId.HasValue && classId != Guid.Empty)
        {
            query = query.Where(x => x.ClassId == classId.Value);
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
            .OrderBy(x => x.FullName)
            .ToListAsync(cancellationToken);
    }

    public async Task AddRangeAsync(
        List<Student> students,
        CancellationToken ct)
    {
        await _context.Students.AddRangeAsync(students, ct);
    }

    public async Task<List<string>> GetExistingCodesAsync(
    List<string> codes,
    Guid branchId,
    Guid schoolYearId,
    CancellationToken ct)
    {
        var normalizedCodes = codes
            .Select(x => x.Trim().ToLower())
            .ToList();

        return await _context.Students
            .Where(x =>
                x.BranchId == branchId &&
                x.SchoolYearId == schoolYearId &&
                normalizedCodes.Contains(x.Code.ToLower()))
            .Select(x => x.Code.ToLower())
            .ToListAsync(ct);
    }



    public async Task<List<StudentReportDto>> GetStudentReportAsync(
        Guid? branchId,
        Guid? schoolYearId,
        Guid? gradeId,
        Guid? classId,
        int? status
    )
    {
        // ===== BUILD FILTER TEXT =====
        var filters = new List<string>();

        if (schoolYearId.HasValue)
        {
            var sy = await _context.SchoolYears.FindAsync(schoolYearId);
            if (sy != null) filters.Add($"Niên khóa: {sy.Name}");
        }

        if (gradeId.HasValue)
        {
            var g = await _context.Grades.FindAsync(gradeId);
            if (g != null) filters.Add($"Khối: {g.Name}");
        }

        if (classId.HasValue)
        {
            var c = await _context.Classes.FindAsync(classId);
            if (c != null) filters.Add($"Lớp: {c.Name}");
        }

        if (status.HasValue)
        {
            filters.Add(status == (int)StudentStatus.Studying
                ? "Tình trạng: Đang học"
                : "Tình trạng: Đã nghỉ học");
        }

        var filterText = filters.Any()
            ? string.Join(" - ", filters)
            : "Tất cả";

        // ===== QUERY =====
        var query = _context.Students
            .AsNoTracking()
            .Include(s => s.Class)
                .ThenInclude(c => c.Grade)
            .Include(s => s.Class)
                .ThenInclude(c => c.Branch)
            .AsQueryable();

        if (branchId.HasValue)
            query = query.Where(x => x.Class.BranchId == branchId);

        if (schoolYearId.HasValue)
            query = query.Where(x => x.SchoolYearId == schoolYearId);

        if (classId.HasValue)
            query = query.Where(x => x.ClassId == classId);

        if (gradeId.HasValue)
            query = query.Where(x => x.Class.GradeId == gradeId);

        if (status.HasValue)
        {
            var statusEnum = (StudentStatus)status.Value;
            query = query.Where(x => x.Status == statusEnum);
        }

        var data = await query
            .OrderBy(x => x.Class.Name)
            .ThenBy(x => x.FullName)
            .Select(s => new StudentReportDto
            {
                BranchName = s.Class.Branch.Name,

                GradeName = s.Class.Grade.Name,
                ClassCode = s.Class.Code,

                StudentCode = s.Code,
                FullName = s.FullName,

                DateOfBirth = s.DateOfBirth,

                Gender = s.Gender == Gender.Male ? "Nam" : "Nữ",

                ParentName = "",
                PhoneNumber = s.PhoneNumber ?? "",
                Address = s.Class.Name,

                Status = s.Status == StudentStatus.Studying
                    ? "Đang học"
                    : "Đã nghỉ học",


                FilterText = filterText
            })
            .ToListAsync();

        // ===== FIX khi không có student =====
        if (!data.Any() && branchId.HasValue)
        {
            var branch = await _context.Branches
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == branchId);

            if (branch != null)
            {
                data.Add(new StudentReportDto
                {
                    BranchName = branch.Name,
                    FilterText = filterText
                });
            }
        }

        return data;
    }

    public async Task<List<Student>> SearchAsync(
    Guid? schoolYearId,
    Guid? branchId,
    string keyword,
    CancellationToken ct)
    {
        var query = _context.Students
            .Include(x => x.Class)
            .AsQueryable();

        if (branchId.HasValue)
            query = query.Where(x => x.BranchId == branchId);

        if (schoolYearId.HasValue)
            query = query.Where(x => x.SchoolYearId == schoolYearId);

        query = query.Where(x =>
            EF.Functions.ILike(x.FullName, $"%{keyword}%") ||
            EF.Functions.ILike(x.Code, $"%{keyword}%") ||
            EF.Functions.ILike(x.Class.Name, $"%{keyword}%") ||
            EF.Functions.ILike(x.Class.Code, $"%{keyword}%"));

        return await query
            .Take(5)
            .ToListAsync(ct);
    }

}