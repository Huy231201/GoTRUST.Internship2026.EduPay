namespace EduPayAPI.Application.Features.Classes.BulkCreate;

public class BulkCreateClassHandler 
    : IRequestHandler<BulkCreateClassCommand, BulkCreateClassResponse>
{
    private readonly IClassRepository _classRepository;
    private readonly IGradeRepository _gradeRepository;
    private readonly IBranchRepository _branchRepository;
    private readonly ISchoolYearRepository _schoolYearRepository;
    private readonly IUnitOfWork _unitOfWork;

    public BulkCreateClassHandler(
        IClassRepository classRepository,
        IGradeRepository gradeRepository,
        IBranchRepository branchRepository,
        ISchoolYearRepository schoolYearRepository,
        IUnitOfWork unitOfWork)
    {
        _classRepository = classRepository;
        _gradeRepository = gradeRepository;
        _branchRepository = branchRepository;
        _schoolYearRepository = schoolYearRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<BulkCreateClassResponse> Handle(
        BulkCreateClassCommand request,
        CancellationToken cancellationToken)
    {
        // ❗ Validate input
        if (request.GradeId == Guid.Empty)
            throw new BadRequestException("Invalid gradeId");

        if (request.BranchId == Guid.Empty)
            throw new BadRequestException("Invalid branchId");

        if (request.SchoolYearId == Guid.Empty)
            throw new BadRequestException("Invalid schoolYearId");

        if (request.StartLetter > request.EndLetter)
            throw new BadRequestException("Invalid letter range");

        if (request.StartNumber > request.EndNumber)
            throw new BadRequestException("Invalid number range");

        // 🔥 Check Branch
        var branch = await _branchRepository
            .GetByIdAsync(request.BranchId, cancellationToken);
        if (branch == null)
            throw new NotFoundException("Branch not found");

        // 🔥 Check SchoolYear
        var schoolYear = await _schoolYearRepository
            .GetByIdAsync(request.SchoolYearId, cancellationToken);
        if (schoolYear == null)
            throw new NotFoundException("SchoolYear not found");

        // 🔥 Check Grade
        var grade = await _gradeRepository
            .GetByIdAsync(request.GradeId, cancellationToken);
        if (grade == null)
            throw new NotFoundException("Grade not found");

        if (grade.BranchId != request.BranchId ||
            grade.SchoolYearId != request.SchoolYearId)
            throw new BadRequestException("Grade không thuộc cơ sở hoặc năm học này");

        // 🔥 Lấy số khối từ Grade.Name (ví dụ "Khối 1" -> 1)
        var match = Regex.Match(grade.Name, @"\d+");
        if (!match.Success || !int.TryParse(match.Value, out int gradeNumber))
            throw new BadRequestException("Grade name không chứa số hợp lệ");

        // 🔥 Lấy danh sách class đã tồn tại
        var existingNames = await _classRepository
            .GetExistingClassNamesAsync(
                request.SchoolYearId,
                request.BranchId,
                cancellationToken);

        var existingSet = new HashSet<string>(existingNames);

        var newClasses = new List<Class>();
        var createdNames = new List<string>();
        var skippedNames = new List<string>();

        // 🔥 Generate class [GradeNumber][Letter][Number]
        for (char letter = char.ToUpper(request.StartLetter); 
             letter <= char.ToUpper(request.EndLetter); 
             letter++)
        {
            for (int inner = request.StartNumber; inner <= request.EndNumber; inner++)
            {
                var className = $"{gradeNumber}{letter}{inner}";

                if (existingSet.Contains(className))
                {
                    skippedNames.Add(className);
                    continue;
                }

                var newClass = new Class(
                    className,
                    className,
                    request.GradeId,
                    request.SchoolYearId,
                    request.BranchId
                );

                newClasses.Add(newClass);
                createdNames.Add(className);
            }
        }

        // 🔥 Save DB
        if (newClasses.Any())
        {
            await _classRepository.AddRangeAsync(newClasses, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // 🔥 Return response
        return new BulkCreateClassResponse
        {
            CreatedCount = createdNames.Count,
            CreatedClassNames = createdNames,
            SkippedClassNames = skippedNames
        };
    }
}