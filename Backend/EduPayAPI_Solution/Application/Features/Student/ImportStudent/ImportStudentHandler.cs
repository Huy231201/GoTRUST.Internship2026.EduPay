

namespace EduPayAPI.Application.Features.Students.ImportStudent;

public class ImportStudentHandler 
    : IRequestHandler<ImportStudentCommand, ImportStudentResponse>
{
    private readonly StudentImportFactory _factory;
    private readonly IClassRepository _classRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ImportStudentHandler(
        StudentImportFactory factory,
        IClassRepository classRepository,
        IStudentRepository studentRepository,
        IUnitOfWork unitOfWork)
    {
        _factory = factory;
        _classRepository = classRepository;
        _studentRepository = studentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ImportStudentResponse> Handle(
        ImportStudentCommand request,
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
            Code = x.Code.Trim(),
            FullName = x.FullName.Trim(),
            Email = x.Email?.Trim(),
            Phone = x.PhoneNumber?.Trim(),
            Gender = x.Gender.Trim(),
            Dob = x.DateOfBirth.Trim(),
            ClassName = x.ClassName.Trim(),
            Type = x.Type.Trim(),

            CodeKey = x.Code.Trim().ToLower(),
            ClassKey = x.ClassName.Trim().ToLower()
        }).ToList();

        var errors = new List<string>();
        var validStudents = new List<Student>();

        // dùng để giữ code đã gặp (giữ dòng đầu, bỏ dòng sau)
        var seenCodes = new HashSet<string>();

        // load class
        var classes = await _classRepository.GetByBranchAndYearAsync(
            request.BranchId,
            request.SchoolYearId,
            ct);

        var classDict = classes.ToDictionary(
            x => x.Name.Trim().ToLower(),
            x => x);

        // check DB
        var codes = normalizedData.Select(x => x.CodeKey).ToList();

        var existingCodes = await _studentRepository.GetExistingCodesAsync(
            codes,
            request.BranchId,
            request.SchoolYearId,
            ct);

        var existingCodeSet = existingCodes.ToHashSet();

        // validate từng dòng
        foreach (var item in normalizedData)
        {
            // code rỗng
            if (string.IsNullOrWhiteSpace(item.Code))
            {
                errors.Add("Code không được để trống");
                continue;
            }

            // trùng trong file (chỉ loại dòng lặp phía sau)
            if (!seenCodes.Add(item.CodeKey))
            {
                errors.Add($"Code '{item.Code}' bị trùng trong file");
                continue;
            }

            // trùng DB
            if (existingCodeSet.Contains(item.CodeKey))
            {
                errors.Add($"Code '{item.Code}' đã tồn tại");
                continue;
            }

            // class
            if (!classDict.TryGetValue(item.ClassKey, out var classEntity))
            {
                errors.Add($"Lớp '{item.ClassName}' không tồn tại");
                continue;
            }

            // gender
            if (!TryMapGender(item.Gender, out var gender))
            {
                errors.Add($"Giới tính '{item.Gender}' không hợp lệ");
                continue;
            }

            // type
            if (!TryMapType(item.Type, out var type))
            {
                errors.Add($"Loại '{item.Type}' không hợp lệ");
                continue;
            }

            // date
            if (!TryParseDob(item.Dob, out var dob))
            {
                errors.Add($"Ngày sinh '{item.Dob}' không hợp lệ");
                continue;
            }

            // create entity
            var student = new Student(
                item.Code,
                item.FullName,
                gender,
                dob,
                classEntity.Id,
                type,
                request.BranchId,
                request.SchoolYearId,
                item.Email,
                item.Phone
            );

            validStudents.Add(student);
        }

        // save
        if (validStudents.Any())
        {
            await _studentRepository.AddRangeAsync(validStudents, ct);
            await _unitOfWork.SaveChangesAsync(ct);
        }

        return new ImportStudentResponse
        {
            TotalRows = importData.Count,
            SuccessCount = validStudents.Count,
            FailedCount = errors.Count,
            Errors = errors
        };
    }

    // ===== PRIVATE =====

    private bool TryMapGender(string input, out Gender gender)
    {
        switch (input.Trim().ToLower())
        {
            case "nam":
                gender = Gender.Male;
                return true;
            case "nữ":
                gender = Gender.Female;
                return true;
            default:
                gender = default;
                return false;
        }
    }

    private bool TryMapType(string input, out StudentType type)
    {
        switch (input.Trim().ToLower())
        {
            case "nội trú":
                type = StudentType.Boarding;
                return true;
            case "ngoại trú":
                type = StudentType.External;
                return true;
            case "bán trú":
                type = StudentType.DayBoarding;
                return true;
            default:
                type = default;
                return false;
        }
    }

    private bool TryParseDob(string input, out DateOnly dob)
    {
        var formats = new[]
        {
            "yyyy-MM-dd",
            "dd/MM/yyyy",
            "MM/dd/yyyy",
            "dd-MM-yyyy"
        };

        return DateOnly.TryParseExact(
            input,
            formats,
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out dob);
    }
}