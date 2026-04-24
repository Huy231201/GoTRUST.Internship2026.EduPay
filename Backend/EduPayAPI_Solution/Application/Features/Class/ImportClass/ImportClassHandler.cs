

namespace EduPayAPI.Application.Features.Classes.ImportClass;

public class ImportClassHandler 
    : IRequestHandler<ImportClassCommand, ImportClassResponse>
{
    private readonly ClassImportFactory _factory;
    private readonly IClassRepository _classRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGradeRepository _gradeRepository;

    public ImportClassHandler(
        ClassImportFactory factory,
        IClassRepository classRepository,
        IUnitOfWork unitOfWork,
        IGradeRepository gradeRepository)
    {
        _factory = factory;
        _classRepository = classRepository;
        _unitOfWork = unitOfWork;
        _gradeRepository = gradeRepository;
    }

    public async Task<ImportClassResponse> Handle(
        ImportClassCommand request,
        CancellationToken ct)
    {
        var extension = Path.GetExtension(request.File.FileName).ToLower();
        var service = _factory.Get(extension);

        var importData = await service.ReadAsync(
            request.File,
            request.BranchId,
            request.SchoolYearId,
            ct);

        // normalize
        var normalizedData = importData.Select(x => new
        {
            Name = x.Name.Trim(),
            Code = x.Code.Trim(),
            GradeName = x.GradeName.Trim(),
            NameKey = x.Name.Trim().ToLower(),
            CodeKey = x.Code.Trim().ToLower()
        }).ToList();

        var errors = new List<string>();
        var validClasses = new List<Class>();

        // dùng để giữ dòng đầu, loại dòng lặp phía sau
        var seenCodes = new HashSet<string>();
        var seenNames = new HashSet<string>();

        // lấy grade
        var grades = await _gradeRepository.GetByBranchAndYearAsync(
            request.BranchId,
            request.SchoolYearId,
            ct);

        // lấy data DB
        var codes = normalizedData.Select(x => x.CodeKey).ToList();
        var names = normalizedData.Select(x => x.NameKey).ToList();

        var existingCodes = await _classRepository.GetExistingCodesAsync(
            codes,
            request.BranchId,
            request.SchoolYearId,
            ct);

        var existingNames = await _classRepository.GetExistingNamesAsync(
            names,
            request.BranchId,
            request.SchoolYearId,
            ct);

        var existingCodeSet = existingCodes.ToHashSet();
        var existingNameSet = existingNames.ToHashSet();

        // validate từng dòng
        foreach (var item in normalizedData)
        {
            // trùng code trong file (chỉ loại dòng phía sau)
            if (!seenCodes.Add(item.CodeKey))
            {
                errors.Add($"Code '{item.Code}' bị trùng trong file");
                continue;
            }

            // trùng name trong file (chỉ loại dòng phía sau)
            if (!seenNames.Add(item.NameKey))
            {
                errors.Add($"Tên lớp '{item.Name}' bị trùng trong file");
                continue;
            }

            // trùng DB code
            if (existingCodeSet.Contains(item.CodeKey))
            {
                errors.Add($"Code '{item.Code}' đã tồn tại");
                continue;
            }

            // trùng DB name
            if (existingNameSet.Contains(item.NameKey))
            {
                errors.Add($"Tên lớp '{item.Name}' đã tồn tại");
                continue;
            }

            // check khối
            var grade = grades.FirstOrDefault(g =>
                g.Name.Trim().ToLower() == item.GradeName.ToLower());

            if (grade == null)
            {
                errors.Add($"Khối '{item.GradeName}' không tồn tại");
                continue;
            }

            var entity = new Class(
                item.Name,
                item.Code,
                grade.Id,
                request.SchoolYearId,
                request.BranchId
            );

            validClasses.Add(entity);
        }

        // lưu
        if (validClasses.Any())
        {
            await _classRepository.AddRangeAsync(validClasses, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        return new ImportClassResponse
        {
            TotalRows = importData.Count,
            SuccessCount = validClasses.Count,
            FailedCount = errors.Count,
            Errors = errors
        };
    }
}